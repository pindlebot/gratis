const { parse } = require('url')
const path = require('path')

const normalizeUrl = (url) => {
  const { pathname, hostname } = parse(url)
  if (!hostname) {
    throw new Error(`${url} is not a url.`)
  }
  const [owner, repo, _, branch = 'master', ...rest] = pathname.split(path.sep).slice(1)
  return { pathname: rest.join('/'), owner, repo, branch }
}

const stripTrailingSlash = pathname => {
  if (pathname.endsWith('/')) {
    pathname = pathname.slice(0, pathname.length - 1)
  }
  return pathname
}

const stripLeadingSlash = pathname => {
  if (pathname.charAt(0) === '/') {
    pathname = pathname.slice(1)
  }
  return pathname
}

const relative = (dir, pathname) => {
  if (pathname.startsWith(dir)) {
    pathname = pathname.replace(dir, '')
  }
  return pathname
}

const appendExtension = (pathname, opts = { ext: '.js' }) => {
  if (!opts.ext.startsWith('.')) {
    opts.ext = `.${opts.ext}`
  }
  if (!path.extname(pathname)) {
    pathname += opts.ext
  }
  return pathname
}

const expandPath = (pathname, tree) => {
  pathname = stripTrailingSlash(pathname)
  if (tree.isTree(pathname)) {
    pathname = path.join(pathname, 'index.js')
  }
  return appendExtension(pathname)
}

const compressPath = (pathname) => {
  if (pathname === 'index') {
    return './'
  }
  if (!pathname.startsWith('./')) {
    return `./${pathname}`
  }
  return pathname
}

const capitalize = (str, i) => i > 0
  ? str.slice(0, 1).toUpperCase() + str.slice(1)
  : str

const camelCase = (file, options) => {
  let pathname = relative(options.root, file.path)
  pathname = stripLeadingSlash(pathname)
  let { ext, dir, name } = path.parse(pathname)
  if (!dir) {
    return pathname
  }
  let parts = pathname.split(path.sep)
  if (name === 'index') {
    parts.pop()
  }
  let camelCaseName = parts.map(capitalize).join('')
  return appendExtension(camelCaseName, { ext })
}

module.exports = {
  normalizeUrl,
  stripTrailingSlash,
  stripLeadingSlash,
  appendExtension,
  expandPath,
  compressPath,
  camelCase
}
