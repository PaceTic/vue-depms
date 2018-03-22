import { axios, base } from './../assets/js/axios-re'

export const getStaff = params => axios.get(`${base}/staff/getulist`, {params: params}).then(res => res.data)

export const submitPlus = params => axios.post(`${base}/staff/plus`, params).then(res => res.data)

export const submitReduce = params => axios.post(`${base}/staff/reduce`, params).then(res => res.data)

export const submitQuali = params => axios.post(`${base}/staff/quali`, params).then(res => res.data)

export const getScore = params => axios.get(`${base}/manager/triple`, {params: params}).then(res => res.data)

export const getQualiScore = params => axios.get(`${base}/manager/getWorkAndQua`, {params: params}).then(res => res.data)
