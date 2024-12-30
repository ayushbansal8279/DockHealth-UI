import { log } from 'helpers/log';
import axios from './axios-heydoc';
import { mapFilterOptions } from '../helpers/filter-options-helpers';

export async function getMeteringEvents(payload) {
  try {
    const response = await axios.post(`/metering/event/search`, payload);
    return response.data;
  } catch (error) {
    log(error);
    throw new Error(error?.response?.data?.errorMessage);
  }
}

export async function getMeteringFilterOptions() {
  try {
    const response = await axios.get('/metering/filterOptions');
    return mapFilterOptions(response.data);
  } catch (error) {
    log(error);
    throw new Error(error?.response?.data?.errorMessage);
  }
}
