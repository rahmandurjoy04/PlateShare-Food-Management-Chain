import axios from 'axios';
import React from 'react';

const axiosSecure = axios.create({
  baseURL: `https://plate-share-server-rho.vercel.app/`

});

const useAxiosSecure = () => {
  axiosSecure.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  })
  return axiosSecure
};

export default useAxiosSecure;