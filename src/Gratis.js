const fs = require('fs-extra')
const path = require('path')
const normalize = require('./normalize')
const Asset = require('./Asset')
const Tree = require('./Tree')

const isBuiltin = moduleName =>
  new Set(require('builtin-modules')).has(moduleName)

const defaultOptions = { dir: 'dist', ext: '.js' }

const normalizeOptions = (url, { ext, dir, ...rest } = defaultOptions) => ({
  dir: path.resolve(dir || 'dist'),
  ext: `${ext.startsWith('.') ? '' : '.'}${ext}`,
  ...normalize.normalizeUrl(url),
  ...(rest || {})
})

class RePkg {
  constructor (url, options = defaultOptions) {
    this.options = normalizeOptions(url, options)
    this.tree = new Tree(this.options)
    this.dependencies = new Map()
    this.modules = new Map()
  }

  async start () {
    await fs.ensureDir(this.options.dir)
    try {
      let pkg = await this.tree.findRoot()
      this.options.root = pkg.root
      this.options.json = pkg.json
    } catch (err) {
      console.error(err)
      process.exit = 1
    }
    let pathname = adjustPathname(this.options, this.tree)
    this.mainAsset = new Asset(pathname, null, this)
    await this.mainAsset.processIfNeeded()
    await this.writePackageJson()
  }

  addModule (key, value) {
    this.modules.set(key, value)
  }

  getRelativePath () {
    return this.options.flatten
      ? path.basename(this.mainAsset.entry.localPath)
      : path.relative(this.options.root, this.mainAsset.entry.localPath)
  }

  writePackageJson () {
    let json = [...this.modules.entries()]
      .filter(([key, value]) => !isBuiltin(key))
      .reduce((acc, val) => {
        let [key, value] = val
        acc.dependencies[key] = value
        return acc
      }, { dependencies: {} })
    json.main = this.getRelativePath()
    return fs.writeJson(path.join(this.options.dir, 'package.json'), json, { spaces: 2 })
  }
}

const adjustPathname = ({ pathname, json }, tree) => {
  if (!pathname) {
    return json.main
  }
  if (path.extname(pathname)) {
    return pathname
  }
  let asset = path.join(pathname, json.main)

  asset = normalize.expandPath(asset, tree)
  return asset
}

RePkg.normalizeOptions = normalizeOptions

module.exports = RePkg
