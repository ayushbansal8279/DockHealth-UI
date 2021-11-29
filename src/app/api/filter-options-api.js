import { mapFilterOptions } from 'helpers/filter-options-helpers';
import axios from './axios-heydoc';

// eslint-disable-next-line import/prefer-default-export
export function getAllTasksFilterOptions(status = 'INCOMPLETE') {
  return axios
    .get(`task/filter/filterOptionsForTasksInOrganization?status=${status}`)
    .then(({ data }) => mapFilterOptions(data));
}
