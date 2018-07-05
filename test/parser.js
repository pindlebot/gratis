const RePkg = require('../src/Reticent')
const { describe, it } = require('mocha')
const assert = require('assert')
const path = require('path')
const Asset = require('../src/Asset')
const Tree = require('../src/Tree')

const repkg = new RePkg('https://github.com/unshift/reticent/blob/master/src/Reticent.js', {
  flatten: true,
  dir: 'dist',
  ext: '.js'
})

describe('RePkg', () => {
  it('should normalize options', () => {
    assert.equal(repkg.options.dir, path.join(process.cwd(), 'dist'))
    assert.equal(repkg.options.branch, 'master')
    assert.equal(repkg.options.owner, 'unshift')
    assert.equal(repkg.options.repo, 'reticent')
    assert.equal(repkg.options.pathname, 'src/Reticent.js')
  })
})

/* describe('Asset', () => {
  it('should', (done) => {
    repkg.tree.findRoot().then(tree => {
      let asset = new Asset(
        repkg.options.pathname,
        null,
        repkg
      )
      assert.equal(asset.entry.path, repkg.options.pathname)
      done()
    })
  })
})
*/

describe('Tree', () => {
  it('should be able to find the root of a repository', (done) => {
    let options = RePkg.normalizeOptions('https://github.com/unshift/reticent/blob/master/test/repo')
    let tree = new Tree(options)
    tree.findRoot().then((data) => {
      console.log(data)
      assert.equal(3, 3)
      done()
    })
  })
})
