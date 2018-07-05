const Tree = require('../src/Tree')

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
  'abCdEfIndex.js',
  'loremIpsumIndex.js',
  'loremIpsum.js',
  'lorem.js',
  'index.js',
  'loremIndex.js',
  'loremIndex.js',
  'indexIndex.js',
  'abcDef.js'
]

it('should compress a path to a camelcased filename', () => {
  paths.forEach((path, i) => {
    expect(Tree.camelCase({ path }, { root: 'src' })).toMatch(
      expected[i]
    )
  })
})
