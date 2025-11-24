import Pusher from 'pusher-js';
import axiosInstance from 'api/axios-heydoc';
import { isUserAlreadyAuthenticated } from 'api/user-auth-api';
import { log } from 'helpers/log';

const APP_KEY = import.meta.env.VITE_PUSHER_APP_KEY;
const APP_CLUSTER = import.meta.env.VITE_PUSHER_CLUSTER_NAME;

let cachedTokenData = {
  token: null,
  expiresAt: null,
};

let tokenFetchPromise = null;

/**
 * Retrieves the access token from the backend endpoint
 * The backend will use the secure cookie to authenticate and return the token
 * @returns {Promise<{token: string, expiresIn: number}|null>} The token data or null if not found
 */
const getAccessTokenFromBackend = async () => {
  try {
    // Call backend endpoint to get the access token
    // The secure cookie will be automatically sent via withCredentials
    const response = await axiosInstance.get('user/tempToken');
    // Handle different possible response formats
    const token =
      response?.data?.token ||
      response?.data?.accessToken ||
      response?.data?.access_token ||
      response?.data;
    const expiresIn = response?.data?.expires_in || response?.data?.expiresIn;

    if (!token) {
      return null;
    }

    return {
      token,
      expiresIn: expiresIn ? Number(expiresIn) : null,
    };
  } catch (error) {
    log('Failed to retrieve access token from backend:', error);
    return null;
  }
};

/**
 * Checks if the cached token is still valid (not expired)
 * @returns {boolean} True if token exists and is not expired
 */
const isTokenValid = () => {
  if (!cachedTokenData.token) {
    return false;
  }

  if (cachedTokenData.expiresAt === null) {
    // No expiration time, consider it valid
    return true;
  }

  // Check if token has expired (with 5 second buffer to avoid edge cases)
  return Date.now() < cachedTokenData.expiresAt - 5000;
};

/**
 * Fetches and caches the access token from the backend
 * This is called asynchronously in the background
 * @returns {Promise<string|null>} The access token or null if not found
 */
const fetchAndCacheToken = async () => {
  // If we have a valid cached token, return it
  if (isTokenValid()) {
    return cachedTokenData.token;
  }

  // Clear expired token
  if (cachedTokenData.token && !isTokenValid()) {
    cachedTokenData = { token: null, expiresAt: null };
  }

  const isLoggedIn = isUserAlreadyAuthenticated();
  if (!isLoggedIn) {
    return null;
  }

  if (!tokenFetchPromise) {
    tokenFetchPromise = getAccessTokenFromBackend();
  }

  try {
    const tokenData = await tokenFetchPromise;
    // Reset promise after it resolves so we can fetch a new token if needed later
    tokenFetchPromise = null;
    if (tokenData) {
      cachedTokenData.token = tokenData.token;
      // Calculate expiration timestamp (current time + expires_in seconds)
      cachedTokenData.expiresAt = tokenData.expiresIn
        ? Date.now() + tokenData.expiresIn * 1000
        : null;
      return cachedTokenData.token;
    }
    return null;
  } catch (error) {
    log('Failed to fetch access token:', error);
    tokenFetchPromise = null;
    return null;
  }
};

let pusherInstance = null;
let pusherAccessToken = null;

/**
 * Initializes Pusher instance with access token retrieved from backend
 * Token is fetched asynchronously in the background and cached with expiration
 * @returns {Promise<Pusher|null>} A Promise that resolves with the Pusher instance or null if initialization fails
 */
export const initializePusher = async () => {
  // If we already have an instance with a valid token, return it
  if (pusherInstance) {
    return pusherInstance;
  }

  // If token expired, clear the instance
  if (pusherInstance && !isTokenValid()) {
    pusherInstance = null;
    pusherAccessToken = null;
  }

  // If we have a valid cached token, use it to initialize
  if (isTokenValid() && cachedTokenData.token) {
    if (!pusherInstance || pusherAccessToken !== cachedTokenData.token) {
      pusherInstance = new Pusher(APP_KEY, {
        cluster: APP_CLUSTER,
        authEndpoint: `${
          import.meta.env.VITE_HEYDOC_SERVICES_BASE_URL
        }pusher/auth`,
        auth: {
          headers: { Authorization: `Bearer ${cachedTokenData.token}` },
        },
        forceTLS: true, // Cookies should be secure (HTTPS) in production
      });
      pusherAccessToken = cachedTokenData.token;
    }
    return pusherInstance;
  }

  // Wait for token to be fetched and then initialize
  const token = await fetchAndCacheToken();
  if (token && (!pusherInstance || pusherAccessToken !== token)) {
    pusherInstance = new Pusher(APP_KEY, {
      cluster: APP_CLUSTER,
      authEndpoint: `${
        import.meta.env.VITE_HEYDOC_SERVICES_BASE_URL
      }pusher/auth`,
      auth: {
        headers: { Authorization: `Bearer ${token}` },
      },
      forceTLS: true,
    });
    pusherAccessToken = token;
  }

  // Return existing instance or null if not yet initialized
  return pusherInstance;
};

let pusherInstanceForPresence = null;

/**
 * Initializes Pusher instance for presence channels with access token retrieved from backend
 * Token is fetched asynchronously in the background and cached with expiration
 * @returns {Promise<Pusher|null>} A Promise that resolves with the Pusher instance or null if initialization fails
 */
export const initializePusherForPresence = async () => {
  // If we already have an instance with a valid token, return it
  if (pusherInstanceForPresence) {
    return pusherInstanceForPresence;
  }

  // If token expired, clear the instance
  if (pusherInstanceForPresence && !isTokenValid()) {
    pusherInstanceForPresence = null;
    pusherAccessToken = null;
  }

  // If we have a valid cached token, use it to initialize
  if (isTokenValid() && cachedTokenData.token) {
    if (
      !pusherInstanceForPresence ||
      pusherAccessToken !== cachedTokenData.token
    ) {
      pusherInstanceForPresence = new Pusher(APP_KEY, {
        cluster: APP_CLUSTER,
        authEndpoint: `${
          import.meta.env.VITE_HEYDOC_SERVICES_BASE_URL
        }pusher/auth?presence=true`,
        auth: {
          headers: { Authorization: `Bearer ${cachedTokenData.token}` },
        },
        forceTLS: true, // Cookies should be secure (HTTPS) in production
      });
      pusherAccessToken = cachedTokenData.token;
    }
    return pusherInstanceForPresence;
  }

  // Wait for token to be fetched and then initialize
  const token = await fetchAndCacheToken();
  if (token && (!pusherInstanceForPresence || pusherAccessToken !== token)) {
    pusherInstanceForPresence = new Pusher(APP_KEY, {
      cluster: APP_CLUSTER,
      authEndpoint: `${
        import.meta.env.VITE_HEYDOC_SERVICES_BASE_URL
      }pusher/auth?presence=true`,
      auth: {
        headers: { Authorization: `Bearer ${token}` },
      },
      forceTLS: true,
    });
    pusherAccessToken = token;
  }

  // Return existing instance or null if not yet initialized
  return pusherInstanceForPresence;
};
