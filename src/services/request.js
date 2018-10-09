/**
 * Created by toplan on 16/11/11.
 */
import 'whatwg-fetch'
import qs from 'querystring'
const FormData = window.FormData

const request = (url, method = 'GET', data = {}, headers = {}) => {
  let body = data
  method = method.toUpperCase()

  headers = Object.assign({
    'Content-Type': 'application/json'
  }, headers)

  if (FormData && data instanceof FormData) {
    delete headers['Content-Type']
  }
  if (headers['Content-Type'] === 'application/json') {
    body = JSON.stringify(data)
  }
  if (method === 'GET') {
    url = url + qs.stringify(data)
    body = undefined
  }

  return Promise.resolve(fetch(url, {
    method,
    body,
    headers,
    credentials: 'same-origin'
  }))
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response
      }
      const error = new Error(response.statusText)
      error.response = response
      throw error
    })
    .then((response) => {
      return response.json()
    })
}

export default request
