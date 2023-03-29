
let _headers = {}

export const request = async (url: string, params: any) => {
  const response = await fetch(
    url,
    {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        ..._headers
      },
      body: JSON.stringify(params)
    }
  )
  const { error, data } = await response.json();
  if (error)
    throw error
  return data
}

export const setHeaders = function (headers = {}) {
  _headers = headers
}


