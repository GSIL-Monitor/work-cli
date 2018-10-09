/**
 * Created by toplan on 16/11/11.
 */
import request from './request'
import forEach from 'lodash/forEach'

const http = {
  request
}

forEach(['get', 'post', 'put'], method => {
  http[method] = (url, data, headers) => {
    return request(url, method, data, headers)
  }
})

export default http
