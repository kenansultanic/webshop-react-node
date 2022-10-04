import axios from 'axios'

axios.defaults.withCredentials = true

export const axiosRequest = axios.create({
    baseUrl: "http://localhost:4000"
})