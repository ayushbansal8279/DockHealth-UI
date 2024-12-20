import { log } from 'helpers/log';
import axios from './axios-heydoc';

export function getMeteringEvents(payload) {
  return axios
    .post(`/metering/event/search`, payload)
    .then((response) => response.data)
    .catch((error) => {
      log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}
