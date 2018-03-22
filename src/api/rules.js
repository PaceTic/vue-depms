import { axios, base } from './../assets/js/axios-re'
export default {
  getDate: params => axios.get(`${base}/configure/search`, {params: params}).then(res => res.data),
  add: params => axios.post(`${base}/configure/insert`, params).then(res => res.data),
  edit: params => axios.put(`${base}/configure/update`, params).then(res => res.data),
  delete: params => axios.put(`${base}/configure/delete`, params).then(res => res.data),
  getAlldate: params => axios.get(`${base}/configure/allBeginDate`, {params: params}).then(res => res.data)
  /* addActivity: params => axios.post(`${base}/lott/activity/add`, params).then(res => res.data),
  delActivity: params => axios.delete(`${base}/lott/activity/delete`, {params: params}).then(res => res.data),
  updateActivity: params => axios.put(`${base}/lott/activity/update`, params).then(res => res.data),
  getMember: params => axios.get(`${base}/lott/activity/searchMember/${sessionStorage.getItem('memberPage')}`, {params: params}).then(res => res.data), */
}
