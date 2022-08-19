import axios from "axios";
import {Auth} from "../types/CustomTypes";
const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        "Content-type": "application/json"
    }
});

instance.interceptors.request.use(
    config => {
        let authStr = localStorage.getItem('auth');
        if(authStr){
            let auth = JSON.parse(authStr) as Auth;
            if(auth.accessToken){
                if (config.headers) {
                    config.headers['Authorization'] = `Bearer ${auth.accessToken}`;
                }
            }
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default instance;