import Pusher from 'pusher-js';

const APP_KEY = import.meta.env.PUSHER_APP_KEY;
const APP_CLUSTER = import.meta.env.PUSHER_CLUSTER_NAME;

let pusherInstance = null;

export const initializePusher = () => {
  const currentAccessToken = sessionStorage.getItem('accessToken');
  if (currentAccessToken && !pusherInstance) {
    pusherInstance = new Pusher(APP_KEY, {
      cluster: APP_CLUSTER,
      authEndpoint: `${import.meta.env.HEYDOC_SERVICES_BASE_URL}pusher/auth`,
      auth: {
        headers: { Authorization: `Bearer ${currentAccessToken}` },
      },
    });
  }
  return pusherInstance;
};

let pusherInstanceForPresence = null;

export const initializePusherForPresence = () => {
  const currentAccessToken = sessionStorage.getItem('accessToken');
  if (currentAccessToken && !pusherInstanceForPresence) {
    pusherInstanceForPresence = new Pusher(APP_KEY, {
      cluster: APP_CLUSTER,
      authEndpoint: `${
        import.meta.env.HEYDOC_SERVICES_BASE_URL
      }pusher/auth?presence=true`,
      auth: {
        headers: { Authorization: `Bearer ${currentAccessToken}` },
      },
    });
  }
  return pusherInstanceForPresence;
};
