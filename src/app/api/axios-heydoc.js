import axios from 'axios';
import { identity } from 'ramda';
import { showAlert } from '../helpers/utility-functions';

const NETWORK_ERROR = 'NETWORK_ERROR';

const axiosInstance = axios.create({
  baseURL: process.env.HEYDOC_SERVICES_BASE_URL,
});

// axiosInstance.interceptors.response.use(identity, error => {
//   if (error.response) {
//     localStorage.setItem(NETWORK_ERROR, 'false');
//   } else if (localStorage.getItem(NETWORK_ERROR) === 'false') {
//     localStorage.setItem(NETWORK_ERROR, 'true');
//     window.location.href = '/';
//   } else {
//     showAlert({
//       status: 'error',
//       title: 'Connection error',
//       text: 'Check your Internet connection and refresh the page',
//       confirmButtonText: 'Refresh page',
//     }).then(() => {
//       window.location.href = '/';
//     });
//   }
// });

export default axiosInstance;
