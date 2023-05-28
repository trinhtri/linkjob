import axios from 'axios';
import getConfig from 'next/config';
import { ApiEndpoint } from './api-endpoint';
import qs from 'qs';

const { publicRuntimeConfig } = getConfig();
const api = axios.create({
    baseURL: publicRuntimeConfig.apiUrl
});

// Thêm interceptor để thêm access token vào trong request
api.interceptors.request.use(
    (config) => {
        const access_token = localStorage.getItem('access_token');

        if (access_token) {
            config.headers.Authorization = `Bearer ${access_token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Thêm interceptor để xử lý khi access token hết hạn
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refresh_token = localStorage.getItem('refresh_token');
                const response = await axios.post(ApiEndpoint.refreshToken, { refreshToken: refresh_token });
                const { accessToken, refreshToken } = response.data;

                // Lưu trữ access token mới vào cookie
                localStorage.setItem('access_token', accessToken);
                localStorage.setItem('refresh_token', refreshToken);
                // Thực hiện lại request ban đầu với access token mới
                return api(originalRequest);
            } catch (error) {
                // Xóa access token và refresh token và redirect về trang đăng nhập
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);
api.interceptors.request.use(
    (config) => {
        config.paramsSerializer = {
            ...(config.paramsSerializer ?? {}),
            serialize: (params) => {
                return qs.stringify(params);
            }
        };

        return config;
    },
    () => {}
);
export default api;
