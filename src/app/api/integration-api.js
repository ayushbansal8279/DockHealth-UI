import axios from './axios-heydoc';

// eslint-disable-next-line import/prefer-default-export
export function getAllESignTemplates() {
  return axios
    .get(`task/communication/esign/templates`)
    .then(({ data }) => data);
}
