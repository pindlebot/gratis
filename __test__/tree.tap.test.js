const Tree = require('../src/Tree')
const uniqBy = require('lodash.uniqby')

const files = [{
  type: 'blob',
  path: 'src/index.js'
}, {
  type: 'tree',
  path: 'src'
}, {
  type: 'blob',
  path: 'src/ab/cd.js'
}, {
  type: 'blob',
  path: 'src/abCd.js'
}, {
  type: 'blob',
  path: 'src/ab/cd/index.js'
}, {
  type: 'blob',
  path: 'lib/ab/cd.js'
}, {
  type: 'blob',
  path: 'lib/a/b.js'
}]

const options = {
  dir: 'dist',
  root: '.'
}

it('should set file paths while preservering file path uniqueness', () => {
  expect(files.length).toBe(uniqBy(files, (file) => file.path).length)
  let tapped = files.map(Tree.tap(options)).map(v => v[1])
  let uniq = uniqBy(tapped, (file) => file.localPath)
  console.log({ tapped: tapped.map(v => v.localPath), uniq: uniq.map(v => v.localPath) })
  expect(tapped.length).toBe(uniq.length)
})
