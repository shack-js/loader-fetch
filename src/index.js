const { relative, sep, extname, join } = require('path')
const { getOptions } = require('loader-utils')
const replaceAll = require('replaceall')

const getPathes = require('./get-pathes')
const cache = {}

module.exports = function (source) {
  const {
    apiPrefix = '/apis',
    backendFolder = 'apis',
    postPath = '@shack-js/loader-fetch/src/fetch.js',
    sourceType = 'module'
  } = getOptions(this)
  const { resourcePath, rootContext } = this
  if (cache[resourcePath]) return cache[resourcePath]
  let codes = [`import $SHACKPOST from ${JSON.stringify(postPath)}`]
  getPathes(source,sourceType)
    .forEach(x => {
      let url = getUrl(apiPrefix, resourcePath,
        join(rootContext, replaceAll('/', sep, backendFolder)), x)
      let exportLeft = x ? `export const ${x} =` : `export default`
      let code = `${exportLeft} async (...params) => await $SHACKPOST(${JSON.stringify(url)},params)`
      codes.push(code)
    })
  cache[resourcePath] = codes.join('\n')
  // console.log(JSON.stringify(cache[resourcePath]))
  return cache[resourcePath]
}


function getUrl(prefix, resourcePath, rootContext, path) {
  let t1 = replaceAll(sep, '/', relative(rootContext, resourcePath))
  let t2 = t1.substr(0, t1.length - extname(t1).length)
  return `${prefix}/${t2}/${path}`
}