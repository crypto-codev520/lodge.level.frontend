import axios from 'axios'

const api = axios.create({
    baseURL: 'http://3.144.112.196:5000',
})

export const insertLog = payload => axios.post(`/api/log`, payload)
export const getLogs = payload => axios.post(`/api/logs`, payload)

const apis = {
     insertLog,
     getLogs,
}

export default apis