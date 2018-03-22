import { axios, base } from './../assets/js/axios-re'

export const getUsers = params => axios.get(`${base}/zt/users`, {params: params}).then(res => res.data)

export const getData = params => axios.get(`${base}/train`, {params: params}).then(res => res.data)

export const addTrain = params => axios.post(`${base}/train`, params).then(res => res.data)

export const editTrain = params => axios.put(`${base}/train`, params).then(res => res.data)

export const removeTrain = id => axios.delete(`${base}/train/` + id).then(res => res.data)
