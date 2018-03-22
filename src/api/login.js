import { axios, base } from './../assets/js/axios-re'

export const loginMsg = params => axios.post(`${base}/user`, params).then(res => res.data)
