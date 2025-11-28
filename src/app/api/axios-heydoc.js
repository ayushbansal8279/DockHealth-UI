/* eslint-disable no-param-reassign */
import axios from 'axios';
import identity from 'ramda/src/identity';
import { showToast } from 'helpers/utility-functions';
import { log } from 'helpers/log';

const NETWORK_ERROR = 'NETWORK_ERROR';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_HEYDOC_SERVICES_BASE_URL,
  // Enable credentials to send HTTPOnly cookies with requests
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // OIDC and FHIR endpoints may need Bearer tokens, so skip cookie auth for them
    // Also skip for token exchange endpoint as it uses Bearer token
    if (
      config.url.includes('/oidc/') ||
      config.url.includes('/fhir/') ||
      config.url.includes('/auth/exchangeToken')
    ) {
      // For these endpoints, use Bearer token if available
      // const currentAccessToken = sessionStorage.getItem('accessToken');
      // if (currentAccessToken) {
      //   config.headers.Authorization = `Bearer ${currentAccessToken}`;
      // }
      return config;
    }

    // For all other endpoints, use HTTPOnly cookie authentication
    // The cookie is automatically sent via withCredentials: true
    // Only set Bearer token as fallback if cookie auth fails (handled by backend)
    const currentAccessToken = sessionStorage.getItem('accessToken');
    const currentOrganizationIdentifier = sessionStorage.getItem(
      'currentOrganizationIdentifier',
    );

    config.headers.CurrentOrganizationIdentifier =
      currentOrganizationIdentifier;

    // Only set Bearer token if we have one and cookie might not be available
    // This is a fallback mechanism - ideally cookie should be used
    if (currentAccessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${currentAccessToken}`;
    }

    return config;
  },
  (error) =>
    // Do something with request error
    Promise.reject(error),
);

// eslint-disable-next-line consistent-return
axiosInstance.interceptors.response.use(identity, (error) => {
  if (error.response) {
    localStorage.setItem(NETWORK_ERROR, 'false');
    return Promise.reject(error);
  }

  if (localStorage.getItem(NETWORK_ERROR) === 'false') {
    localStorage.setItem(NETWORK_ERROR, 'true');
    window.location.reload();
    return;
  }

  // donot show the error for login
  if (window.location.hash && window.location.hash.includes('/auth/login')) {
    return;
  }
  // ignore head requests for cookie check failures
  if (error?.config?.method === 'head') {
    return;
  }

  log('Connection error');
  log(error);
  if (String(error).includes('Network Error')) {
    // window.location.href = '/#/auth/login';
  }
  if (String(error).includes('Token verification failed')) {
    window.location.href = '/#/auth/login';
  }
  // window.location.href = '/#/auth/login';
  // window.location.href = '/#/core/home/my-tasks';
  showToast({
    status: 'error',
    title: 'Error',
    text: `A connection error has occured, please refresh the page. If that does not helpful, please logout and log back in. Details: ${error}`,
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
