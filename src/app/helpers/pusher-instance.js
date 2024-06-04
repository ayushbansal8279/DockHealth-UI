import Pusher from 'pusher-js';

const APP_KEY = import.meta.env.VITE_PUSHER_APP_KEY;
const APP_CLUSTER = import.meta.env.VITE_PUSHER_CLUSTER_NAME;

let pusherInstance = null;
let pusherAccessToken = null;

export const initializePusher = () => {
  const currentAccessToken = sessionStorage.getItem('accessToken');
  if (
    currentAccessToken &&
    (!pusherInstance || pusherAccessToken !== currentAccessToken)
  ) {
    pusherInstance = new Pusher(APP_KEY, {
      cluster: APP_CLUSTER,
      authEndpoint: `${
        import.meta.env.VITE_HEYDOC_SERVICES_BASE_URL
      }pusher/auth`,
      auth: {
        headers: { Authorization: `Bearer ${currentAccessToken}` },
      },
    });
    pusherAccessToken = currentAccessToken;
  }
  return pusherInstance;
};

let pusherInstanceForPresence = null;

export const initializePusherForPresence = () => {
  const currentAccessToken = sessionStorage.getItem('accessToken');
  if (
    currentAccessToken &&
    (!pusherInstance || pusherInstanceForPresence !== currentAccessToken)
  ) {
    pusherInstanceForPresence = new Pusher(APP_KEY, {
      cluster: APP_CLUSTER,
      authEndpoint: `${
        import.meta.env.VITE_HEYDOC_SERVICES_BASE_URL
      }pusher/auth?presence=true`,
      auth: {
        headers: { Authorization: `Bearer ${currentAccessToken}` },
      },
    });
    pusherAccessToken = currentAccessToken;
  }
  return pusherInstanceForPresence;
};
