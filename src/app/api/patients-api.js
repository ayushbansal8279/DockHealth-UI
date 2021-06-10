import axios from './axios-heydoc';

// eslint-disable-next-line import/prefer-default-export
export const getDefaultPatientsLists = () =>
  axios
    .get('patient/list/getAll')
    .then(response => response.data)
    .catch(error => console.log(error));
