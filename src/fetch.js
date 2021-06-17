export default async (url, params) => {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  })
  const { error, data } = await response.json()
  if (error) throw error
  return data
}
