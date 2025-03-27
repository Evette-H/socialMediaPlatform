import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://3.26.52.110', 
  //baseURL: 'http://3.26.52.110:5001', // live
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
