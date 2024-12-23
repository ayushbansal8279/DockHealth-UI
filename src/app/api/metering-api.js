import { log } from 'helpers/log';
import axios from './axios-heydoc';

export async function getMeteringEvents(payload) {
  try {
    const response = await axios.post(`/metering/event/search`, payload);
    return response.data;
  } catch (error) {
    log(error);
    throw new Error(error?.response?.data?.errorMessage);
  }
}
