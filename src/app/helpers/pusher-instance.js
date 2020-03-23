import Pusher from 'pusher-js';

const APP_KEY = process.env.PUSHER_APP_KEY;
const APP_CLUSTER = process.env.PUSHER_CLUSTER_NAME;

export default new Pusher(APP_KEY, {
  cluster: APP_CLUSTER,
});
