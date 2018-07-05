const { camelCase } = require('../src/Tree')
const { describe, it } = require('mocha')
const assert = require('assert')

const paths = [
  'ab/cd/ef.js',
  'ab/cd/ef/index.js',
  'lorem/ipsum/index.js',
  'lorem/ipsum.js',
  'lorem.js',
  'index.js',
  'loremIndex.js',
  'lorem/index.js',
  'index/index.js',
  'src/abc/def.js'
]

const expected = [
  'abCdEf.js',
  'abCdEf.js',
  'loremIpsum.js',
  'loremIpsum.js',
  'lorem.js',
  'index.js',
  'loremIndex.js',
  'lorem.js',
  'index.js',
  'abcDef.js'
]

describe('camelcase', () => {
  it('should compress a path to a camelcased filename', () => {
    paths.forEach((path, i) => {
      assert.equal(
        camelCase({ path }, { root: 'src' }),
        expected[i]
      )
    })
  })
})
