import { relative, sep, extname, join } from 'path'
import getPathes from './get-pathes'

const { getOptions } = require('loader-utils')
const replaceAll = require('replaceall')

const cache: any = {}

export default function (this: any, source: string) {
  const {
    apiPrefix = '/apis',
    backendFolder = 'apis',
    postPath = '@shack-js/loader-fetch/dist/fetch.js',
    sourceType = 'module'
  } = getOptions(this)
  const { resourcePath, rootContext } = this
  if (cache[resourcePath]) return cache[resourcePath]
  let codes = [`import { request } from ${JSON.stringify(postPath)}`]
  getPathes(source, sourceType)
    .forEach(x => {
      let url = getUrl(apiPrefix, resourcePath,
        join(rootContext, replaceAll('/', sep, backendFolder)), x)
      let exportLeft = x ? `export const ${x} =` : `export default`
      let code = `${exportLeft} async (...params) => await request(${JSON.stringify(url)}, params)`
      codes.push(code)
    })
  cache[resourcePath] = codes.join('\n')
  return cache[resourcePath]
}


function getUrl(prefix: string, resourcePath: string, rootContext: string, path: string) {
  let t1 = replaceAll(sep, '/', relative(rootContext, resourcePath))
  let t2 = t1.substr(0, t1.length - extname(t1).length)
  return `${prefix}/${t2}/${path}`
}