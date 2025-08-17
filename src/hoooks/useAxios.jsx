import axios from 'axios';
import React from 'react';


const axiosInstance = axios.create({
  // baseURL: `https://plate-share-server-rho.vercel.app/`
  baseURL: `http://localhost:3000/`
});
const useAxios = () => {
    
    return axiosInstance;
};

export default useAxios;