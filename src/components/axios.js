import {ElMessage} from 'element-plus'

let axios = require('axios')
let tips =  ElMessage

axios.interceptors.request.use(
    config => {
        config.timeout = 30000
        return config
    },
    err => {
        return Promise.reject(err)
    }
)
axios.interceptors.response.use(
    // 请求成功
    res => {
        if (res.status === 200) return res.data
    },
    // 请求错误
    err => {
        if (err.response) {
            if (err.response.status === 401) {
                // 这种情况一般调到登录页

            } else if (err.response.status === 403) {
                tips({
                    message: '请登陆后重试!',
                    type: 'error',
                    grouping: true,
                    duration: 1500,
                })

            } else {
                tips({
                    message: '无法连接服务器!',
                    type: 'error',
                    grouping: true,
                    duration: 1500,
                })
            }
            return Promise.reject(err.response.data)
        }
    }
)

export default axios