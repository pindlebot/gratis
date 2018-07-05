require('dotenv').config()
const fetch = require('node-fetch')
const atob = require('atob')
const path = require('path')
const normalize = require('./normalize')

class Tree {
  constructor (options) {
    const { owner, repo } = options
    this.endpoint = `https://api.github.com/repos/${owner}/${repo}`
    this.cache = new Map()
    this.options = options
  }

  async fetchCode (pathname) {
    let file = this.entries.get(pathname)
    if (file.processed) {
      console.warn(`file "${file.path}" already processed`)
      return
    }
    file.processed = true
    this.entries.set(pathname, file)
    let data = await this.fetch(file.url)
    if (!data.content) {
      console.warn(`file ${file.path} is empty`)
      return
    }
    return this.decode(data)
  }

  async findRoot () {
    let tree = await this.getTree()

    let rootEntry
    let pathname = this.options.pathname.slice(0)
    if (path.extname(pathname)) {
      pathname = path.dirname(pathname)
    }
    while (pathname.length) {
      let key = path.join(pathname, 'package.json')
      let entry = tree.find(entry => entry.path === key)
      if (entry) {
        rootEntry = entry
        break
      }
      pathname = path.dirname(pathname)
    }
    if (!rootEntry) {
      rootEntry = tree.find(entry => entry.path === 'package.json')
    }

    let data = await this.fetch(rootEntry.url)
    let json = JSON.parse(this.decode(data))
    let rootDir = path.dirname(rootEntry.path)
    this.options.root = rootDir
    this.entries = new Map(tree.map(tap(this.options)))
    return {
      json,
      root: rootDir
    }
  }

  isTree (name) {
    let entry = [...this.entries.entries()]
      .find(([key, value]) => key === name)
    return entry && entry[1] && entry[1].type === 'tree'
  }

  decode ({ content }) {
    return atob(content)
  }

  fetch (endpoint) {
    let params = {}
    if (process.env.GITHUB_TOKEN) {
      params.headers = {
        'Authorization': `bearer ${process.env.GITHUB_TOKEN}`
      }
    }
    return fetch(endpoint, params)
      .then(resp => resp.json())
  }

  getEntry (name) {
    return this.entries.get(name)
  }

  async getTree () {
    let refs = await this.fetch(`${this.endpoint}/git/refs`)
    let { object: { sha } } = refs.find(({ ref }) => ref === 'refs/heads/master')
    let endpoint = `${this.endpoint}/git/trees/${sha}?recursive=true`
    let data = await this.fetch(endpoint)
    return data.tree
  }
}

Tree.camelCase = normalize.camelCase

const tap = (options) => (file, index, array) => {
  let { name, base } = path.parse(file.path)
  let duplicate = array.find(entry =>
    path.basename(entry.path) === base &&
    entry.path !== file.path
  )
  let camelCaseName = normalize.camelCase(file, options)
  file.localPath = path.join(
    options.dir, duplicate
      ? camelCaseName
      : (base || file.path)
  )
  file.relativePath = duplicate
    ? camelCaseName.replace(/\.\w{1,255}$/, '')
    : (name || file.path)
  return [file.path, file]
}

module.exports = Tree
