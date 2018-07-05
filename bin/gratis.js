#!/usr/bin/env node

const yargs = require('yargs')
const path = require('path')

const _ = yargs
  .option('dir', {
    default: 'dist',
    type: 'string'
  })
  .option('flatten', {
    default: true,
    type: 'boolean'
  })
  .option('ext', {
    default: '.js',
    type: 'string'
  })
  .command('$0 <url>', '', () => {}, async (argv) => {
    require('dotenv').config({path: path.join(process.cwd(), '.env')})

    const Packager = require('../src')
    const { dir, flatten, ext } = argv
    await new Packager(argv.url, { dir, flatten, ext }).start()
}).argv
