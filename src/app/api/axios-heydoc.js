import axios from 'axios';

export default axios.create({
  baseURL: process.env.HEYDOC_SERVICES_BASE_URL,
});
