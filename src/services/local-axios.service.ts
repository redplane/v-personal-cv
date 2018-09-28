import {LocalStorageKeyConstant} from '@/constants/local-storage-key.constant.ts';
import axios, {AxiosRequestConfig} from 'axios';

const $axios = axios.create();

$axios
    .interceptors
    .request
    .use((axiosRequest: AxiosRequestConfig) => {
        let accessToken = localStorage.getItem(LocalStorageKeyConstant.accessToken);
        if (!accessToken)
            return axiosRequest;

        axiosRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosRequest;
    });

export default $axios;
