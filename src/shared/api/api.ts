import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios'

const BASEURL = import.meta.env.VITE_API_URL

interface RetryableRequestConfig extends AxiosRequestConfig {
    _retry?: boolean
}

const api = axios.create({
    baseURL: BASEURL
})

api.interceptors.request.use((config) => {
    const authToken = (localStorage.getItem('accessToken'))
    console.log(authToken,'authToken');
    if (authToken && config.headers) {
        config.headers.Authorization = `Bearer ${authToken}`
    }
    config.headers['Content-Type'] = 'application/json'

    return config
})

api.interceptors.response.use(
    (response: AxiosResponse) => {

        return response.data
    },
    async (error: AxiosError) => {
        const status = error.response?.status
        const originalRequest = error.config as RetryableRequestConfig

        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            localStorage.removeItem('accessToken')
            if (window.location.pathname !== '/') {
                window.location.href = '/'
            }
            return Promise.reject(error)
        }

        // if (status === 403) {
        // }

        // if (status === 404) {
        // }

        return Promise.reject(error)
    }
)

export default api
