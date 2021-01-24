/* eslint-disable no-param-reassign */
import axios from 'axios';
import { identity } from 'ramda';
// import { showToast } from 'helpers/utility-functions';

const NETWORK_ERROR = 'NETWORK_ERROR';

const axiosInstance = axios.create({
  baseURL: process.env.HEYDOC_SERVICES_BASE_URL,
});

axiosInstance.interceptors.request.use(
  function(config) {
    if (config.url.includes('/oidc/') || config.url.includes('/fhir/')) {
      return config;
    }
    // Do something before request is sent
    const currentAccessToken = sessionStorage.getItem('accessToken');
    const currentOrganizationIdentifier = sessionStorage.getItem(
      'currentOrganizationIdentifier',
    );
    config.headers.CurrentOrganizationIdentifier = currentOrganizationIdentifier;
    config.headers.Authorization = `Bearer ${currentAccessToken}`;
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// eslint-disable-next-line consistent-return
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
  if (window.location.hash && window.location.hash.includes('/auth/login')) {
    return undefined;
  }

  window.location.href = '/#/auth/login';
});

export default axiosInstance;
