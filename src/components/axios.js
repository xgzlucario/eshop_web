let axios = require('axios')

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
            return Promise.reject(err.response.data)
        }
    }
)

export default axios