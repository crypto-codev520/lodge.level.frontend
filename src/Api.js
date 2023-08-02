import axios from 'axios'
export const insertLog = payload => axios.post(`/api/log`, payload)
export const getLogs = payload => axios.post(`/api/logs`, payload)

const apis = {
     insertLog,
     getLogs,
}

export default apis