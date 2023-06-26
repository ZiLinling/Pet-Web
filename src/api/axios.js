import axios from 'axios'
import router from '@/router'

axios.defaults.timeout = 5000;

export const base_url = "http://localhost:8090/Pet"

// 添加请求拦截器，在请求头中加token
axios.interceptors.request.use(
    config => {
        if (localStorage.getItem('token')) {
            config.headers.token = localStorage.getItem('token');
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    });

axios.interceptors.response.use(
    config => {
        if (localStorage.getItem('token') && config.data.statusCode == 600) {
            localStorage.removeItem('token')
            router.replace({
                path: '/login',
            })
            return config;
        }
        if (config.data.statusCode != 200)
            return Promise.reject(config.data);
        return config;
    },
    error => {
        return Promise.reject(error);
    });

export function getRequest(url, params) {
    return axios({
        method: "get",
        url: base_url + url,
        params: params,
    })
}
export function postRequest(url, params) {
    return axios({
        method: "post",
        url: base_url + url,
        params: params,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    })
}
export function postJsonRequest(url, params) {
    return axios({
        method: "post",
        url: base_url + url,
        data: params,
        headers: {
            "Content-Type": "application/json",
        }
    })
}

export function deleteRequest(url, params) {
    return axios({
        method: "delete",
        url: base_url + url,
        params: params,
    })
}

export function addressRequest(params) {
    return axios({
        method: "get",
        url: "https://restapi.amap.com/v3/geocode/geo?output=JSON&key=dfbcbfcff0e7ce8114242c24c21d1bf5",
        params: params,
    })
}