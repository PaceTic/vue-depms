import { axios, base } from './../assets/js/axios-re'

export const getRoleList = params => axios.get(`${base}/role`, {params: params}).then(res => res.data)

export const getMenuList = params => axios.get(`${base}/role/getmenu`, {params: params}).then(res => res.data)

export const getPermission = params => axios.get(`${base}/role/menu`, {params: params}).then(res => res.data)

export const addRole = params => axios.post(`${base}/role`, params).then(res => res.data)

export const editRole = params => axios.put(`${base}/role`, params).then(res => res.data)

export const submitMenu = params => axios.put(`${base}/role/menu`, params).then(res => res.data)

export const removeRole = id => axios.delete(`${base}/role/` + id).then(res => res.data)
