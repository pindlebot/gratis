const RE = require('../src/constants').REQUIRE_REGEX
const { describe, it } = require('mocha')
const assert = require('assert')

const statements = [
  `import { x } from "y"`,
  `import { default } from "y"`,
  `import { default as x } from "y"`,
  `import * as x from "y"`,
  `import { x } from 'y'`,
  `import { default } from 'y'`,
  `import { default as x } from 'y'`,
  `import * as x from 'y'`,
  `import("y")`,
  `import ("y")`,
  `import("y").then(y => {})`,
  `import('y')`,
  `import ('y')`,
  `import('y').then(y => {})`,
  'const x = require("y")',
  `const x = require('y')`,
  `const { x } = require('y')`
]

const expected = [
  `import { x } from "z"`,
  `import { default } from "z"`,
  `import { default as x } from "z"`,
  `import * as x from "z"`,
  `import { x } from 'z'`,
  `import { default } from 'z'`,
  `import { default as x } from 'z'`,
  `import * as x from 'z'`,
  `import("z")`,
  `import ("z")`,
  `import("z").then(y => {})`,
  `import('z')`,
  `import ('z')`,
  `import('z').then(y => {})`,
  'const x = require("z")',
  `const x = require('z')`,
  `const { x } = require('z')`
]

describe('require_regex', () => {
  it('should match import and require arguments', () => {
    statements.forEach(statement => {
      assert.equal(statement.match(RE)[0], 'y')
    })
  })
})

describe('require_regex', () => {
  it('should replace import and require paths', () => {
    statements.forEach((statement, index) => {
      assert.equal(statement.replace(RE, 'z'), expected[index])
    })
  })
})
