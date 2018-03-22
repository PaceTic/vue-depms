import { axios, base } from './../assets/js/axios-re'
// 用户管理
export const getUserList = params => axios.get(`${base}/user`, {params: params}).then(res => res.data)
export const addUser = params => axios.post(`${base}/user`, params).then(res => res.data)
export const removeUser = id => axios.delete(`${base}/user` + '/' + id).then(res => res.data)
export const editUser = params => axios.put(`${base}/user`, params).then(res => res.data)
export const updatePsw = params => axios.put(`${base}/user/update`, params).then(res => res.data)
export const lockUser = params => axios.put(`${base}/user/batchlocked`, params).then(res => res.data)
export const unLockUser = params => axios.put(`${base}/user/batchunlocked`, params).then(res => res.data)
export const updataRole = params => axios.put(`${base}/user/upadteUserRole`, params).then(res => res.data)
export const editMsgSubmit = params => axios.put(`${base}/user/newUpdateUser`, params).then(res => res.data)
export const getAllUser = params => axios.get(`${base}/user/queryAllUser`, {params: params}).then(res => res.data)
export const getNewData = params => axios.post(`${base}/manager/importUsers`, params).then(res => res.data)
