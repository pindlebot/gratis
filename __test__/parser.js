const RePkg = require('../src/Gratis')
const path = require('path')
const Asset = require('../src/Asset')
const Tree = require('../src/Tree')

const repkg = new RePkg('https://github.com/unshift/reticent/blob/master/src/Reticent.js', {
  flatten: true,
  dir: 'dist',
  ext: '.js'
})

it('should normalize options', () => {
  expect(repkg.options.dir).toMatch(path.join(process.cwd(), 'dist'))
  expect(repkg.options.branch).toMatch('master')
  expect(repkg.options.owner).toMatch('unshift')
  expect(repkg.options.repo).toMatch('reticent')
  expect(repkg.options.pathname).toMatch('src/Reticent.js')
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
  it('should be able to find the root of a repository', () => {
    expect.assertions(1)

    let options = RePkg.normalizeOptions('https://github.com/unshift/reticent/blob/master/test/repo')
    let tree = new Tree(options)
    return expect(tree.findRoot()).resolves.toBeTruthy()
  })
})
