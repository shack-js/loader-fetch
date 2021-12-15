
let _headers = {}

export const request = async (url: string, params: any) => {
  let method = getMethod(url)

  const response = await fetch(
    method != 'GET' ? url : appendQuery(url, params), {
    method,
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      ..._headers
    },
    body: method == 'GET' ? undefined : JSON.stringify(params)
  })

  const { error, data } = await response.json();
  if (error)
    throw error
  return data
}

export const setHeaders = function (headers = {}) {
  _headers = headers
}

function getMethod(url: string) {
  let basename = url.substring(url.lastIndexOf('/') + 1).toUpperCase()
  for (let method of ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']) {
    if (basename.startsWith(method)) return method
  }
  return 'POST'
}

function appendQuery(url: string, params: any): any {
  return `${url}?${params.map(x => `q[]=${encodeURIComponent(x)}`).join('&')}`
}

