import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
});

// axiosInstance.defaults.headers.common['Authorization'] = AUTH_TOKEN;

const AxiosUseInstance = () => {
  return axiosInstance;
};

export default AxiosUseInstance;
