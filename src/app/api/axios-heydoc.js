import axios from 'axios';
import { identity } from 'ramda';
import { showToast } from '../helpers/utility-functions';

const NETWORK_ERROR = 'NETWORK_ERROR';

const axiosInstance = axios.create({
  baseURL: process.env.HEYDOC_SERVICES_BASE_URL,
});

axiosInstance.interceptors.response.use(identity, error => {
  if (error.response) {
    localStorage.setItem(NETWORK_ERROR, 'false');
    return Promise.reject(error);
  }
  if (localStorage.getItem(NETWORK_ERROR) === 'false') {
    localStorage.setItem(NETWORK_ERROR, 'true');
    window.location.reload();
    return undefined;
  }

  // donot show the error for login
  if (window.location.hash && window.location.hash.includes('/login')) {
    return undefined;
  }

  return showToast({
    status: 'error',
    title: 'Connection error',
    text: 'Check your Internet connection and refresh the page',
    confirmButtonText: 'Refresh page',
    showConfirmButton: true,
    showCloseButton: true,
    timerProgressBar: false,
    timer: 0,
  }).then(({ value }) => {
    if (value) window.location.reload();
  });
});

export default axiosInstance;
