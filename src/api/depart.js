import { axios, base } from './../assets/js/axios-re'

export const getDeparts = params => axios.get(`${base}/depart`, {params: params}).then(res => res.data)

export const addDepart = params => axios.post(`${base}/depart`, params).then(res => res.data)

export const editDepart = params => axios.put(`${base}/depart`, params).then(res => res.data)

export const removeDepart = id => axios.delete(`${base}/depart/` + id).then(res => res.data)

export const getFreeUsers = params => axios.get(`${base}/depart/freeusers`, params).then(res => res.data)

export const setMember = params => axios.put(`${base}/depart/users`, params).then(res => res.data)
