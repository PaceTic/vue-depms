import Axios from 'axios'
import helper from './../../assets/js/axios-helper'

helper.requestInterceptor(Axios)
helper.responseInterceptor(Axios)

export const axios = Axios

export const base = '/api'
