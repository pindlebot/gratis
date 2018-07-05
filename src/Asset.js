const url = require('url')
const path = require('path')
const fs = require('fs-extra')
const Parser = require('./Parser')

class Asset {
  constructor (name, parent, repkg) {
    this.options = (parent && parent.options) || repkg.options
    this.tree = (parent && parent.tree) || repkg.tree
    this.name = name
    this.children = new Map()
    this.parent = parent
    this.entry = this.tree.getEntry(this.name)
    this.parser = new Parser(this.name, this.tree, this.options)
    this.repkg = repkg
    this.processed = false
  }

  addChild (dependency) {
    if (dependency.startsWith('.')) {
      let name = this.parser.normalize(dependency)
      if (this.entry) {
        if (
          this.parent &&
          this.parent.children &&
          this.parent.children.has(name)
        ) {
          console.warn(`dependency cycle with ${name}`)
          return
        }

        let asset = new Asset(name, this, this.repkg)
        this.children.set(name, asset)
      } else {
        console.warn(`Cannot find asset ${name}`)
      }
    } else {
      this.repkg.addModule(
        ...getPackageJsonDependency(dependency, this.options)
      )
    }
  }

  save () {
    let source = this.options.flatten ? this.parser.code : this.source
    return fs.ensureDir(path.dirname(this.entry.localPath))
      .then(() =>
        fs.writeFile(this.entry.localPath, source, { encoding: 'utf-8' })
      )
  }

  async processChildren () {
    for (let [key, value] of this.children) {
      await value.processIfNeeded()
    }
    return this
  }

  async processIfNeeded () {
    if (this.processed) return this

    try {
      this.source = await this.tree.fetchCode(this.name)
    } catch (err) {
      console.error(err)
      throw err
    }

    if (!this.source) {
      return this
    }

    let parser = this.parser.transform(this.source)

    parser.dependecies.forEach(dependency => {
      this.addChild(dependency)
    })
    await this.processChildren()
    this.processed = true
    this.save()
    return this
  }
}

const getPackageJsonDependency = (dependency, { json }) => {
  let key = dependency.split(path.sep)[0]
  let packageJsonDependencies = {
    ...(json.peerDependencies || {}),
    ...(json.devDependencies || {}),
    ...(json.dependencies || {})
  }
  let value = packageJsonDependencies[key] || 'latest'
  return [key, value]
}

module.exports = Asset
