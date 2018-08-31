import axios from 'axios'

axios.defaults.withCredentials = true

export const fetchTest = () => {
  return axios.get('/motor/pleasure/worldcup/awards/list')
}
