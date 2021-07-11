import axios from 'api/axios-heydoc';

export const addLabel = ({ labelIdentifier, labelName, patientIdentifier }) =>
  axios({
    method: 'post',
    url: '/patient/label',
    data: {
      labelIdentifier,
      labelName,
      patientIdentifier,
    },
  }).then(({ data }) => {
    return data;
  });

export const editLabel = ({ labelIdentifier, labelName, patientIdentifier }) =>
  axios({
    method: 'put',
    url: '/patient/label',
    data: {
      labelIdentifier,
      labelName,
      patientIdentifier,
    },
  }).then(({ data }) => {
    return data;
  });

export const removeLabelForPatient = ({
  labelIdentifier,
  labelName,
  patientIdentifier,
}) =>
  axios({
    method: 'put',
    url: '/patient/label/remove',
    data: {
      labelIdentifier,
      labelName,
      patientIdentifier,
    },
  }).then(({ data }) => {
    return data;
  });

export function getAllPatientLabels() {
  return axios.get(`/patient/label/getAll`).then(({ data }) => data);
}

export const removeLabelFromDatabase = ({ labelIdentifier }) =>
  axios({
    method: 'delete',
    url: `/patient/label/${labelIdentifier}`,
  }).then(({ data }) => {
    return data;
  });
