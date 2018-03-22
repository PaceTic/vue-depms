import { axios, base } from './../assets/js/axios-re'
/* 项目管理 */
export const getProjectList = params => axios.get(`${base}/project`, {params: params}).then(res => res.data)
export const removeProject = id => axios.delete(`${base}/project` + '/' + id).then(res => res.data)
export const addProject = params => axios.post(`${base}/project`, params).then(res => res.data)
export const editProject = params => axios.put(`${base}/project`, params).then(res => res.data)
export const userProject = params => axios.put(`${base}/project/users`, params).then(res => res.data)
export const getScore = params => axios.get(`${base}/manager/checkjxkh`, {params: params}).then(res => res.data)
export const getTotal = params => axios.get(`${base}/manager/total`, {params: params}).then(res => res.data)
export const getMonth = params => axios.get(`${base}/zt/getMonth`, {params: params}).then(res => res.data)
export const unemployed = params => axios.get(`${base}/manager/unemployed`, {params: params}).then(res => res.data)
export const checkVersionTime = params => axios.get(`${base}/manager/checkVersionTime`, {params: params}).then(res => res.data)
export const queryProjectUser = params => axios.get(`${base}/project/queryProjectUser`, {params: params}).then(res => res.data)
export const getSuggest = params => axios.post(`${base}/manager/setSuggestion`, params).then(res => res.data)
export const jxkhAll = params => axios.post(`${base}/manager/newJXKHAll`, params).then(res => res.data)
/* 项目人员 */
/* export const removePerson = id => axios.delete(`${base}/user` + '/' + id).then(res => res.data)
export const addPerson = params => axios.post(`${base}/user`, params).then(res => res.data)
export const editPerson = params => axios.put(`${base}/user`, params).then(res => res.data) */
