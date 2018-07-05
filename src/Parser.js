const path = require('path')
const { REQUIRE_REGEX } = require('./constants')
const { expandPath } = require('./normalize')

const normalize = (source, dest, tree) =>
  expandPath(path.join(path.dirname(source), dest), tree)

class Parser {
  constructor (name, tree, options) {
    this.code = ''
    this.dependecies = []
    this.options = options
    this.tree = tree
    this.name = name
  }

  normalize (name) {
    return normalize(this.name, name, this.tree)
  }

  reducer (acc, line, array, index) {
    if (REQUIRE_REGEX.test(line)) {
      let [name, ...rest] = line.match(REQUIRE_REGEX)
      this.dependecies.push(name)
      if (name.startsWith('.')) {
        if (this.options.flatten) {
          let asset = this.normalize(name)
          let entry = this.tree.getEntry(asset)
          let relativePath = entry.relativePath === 'index'
            ? './'
            : `./${entry.relativePath}`
          line = line.replace(REQUIRE_REGEX, relativePath)
        } else {
          line = line.replace(REQUIRE_REGEX, `./${path.basename(name)}`)
        }
      }
    }
    acc.push(line)
    return acc
  }

  transform (code) {
    if (!this.options.flatten) {
      return this.getDependencies(code)
    }
    let lines = code.split(/\r?\n/)
      .reduce(this.reducer.bind(this), [])
    this.code = lines.join('\n')
    return this
  }

  getDependencies (code) {
    this.dependecies = code.split(/\r?\n/)
      .filter(line => REQUIRE_REGEX.test(line))
      .map(line => line.match(REQUIRE_REGEX)[0])
    return this
  }
}

Parser.normalize = normalize

module.exports = Parser
