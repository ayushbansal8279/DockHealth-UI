import axios from 'api/axios-heydoc';

export const addLabel = ({
  labelIdentifier,
  labelName,
  taskIdentifier,
  taskWorkflowIdentifier,
}) =>
  axios({
    method: 'post',
    url: '/task/label',
    data: {
      labelIdentifier,
      labelName,
      taskIdentifier,
      taskWorkflowIdentifier,
    },
  }).then(({ data }) => data);

export const editLabel = ({
  labelIdentifier,
  labelName,
  taskIdentifier,
  taskWorkflowIdentifier,
}) =>
  axios({
    method: 'put',
    url: '/task/label',
    data: {
      labelIdentifier,
      labelName,
      taskIdentifier,
      taskWorkflowIdentifier,
    },
  }).then(({ data }) => data);

export const removeLabelForTask = ({
  labelIdentifier,
  taskIdentifier,
  taskWorkflowIdentifier,
}) =>
  axios({
    method: 'put',
    url: '/task/label/remove',
    data: {
      labelIdentifier,
      taskIdentifier,
      taskWorkflowIdentifier,
    },
  }).then(({ data }) => data);

export const getTaskListLabels = ({ taskListIdentifier }) =>
  axios({
    method: 'get',
    url: `/task/label/getLabelsForTaskList/${taskListIdentifier}`,
  }).then(({ data }) => data);

export function getTemplateLabels() {
  return axios
    .get(`task/label/getLabelsForTemplateTaskList`)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

export const removeLabelFromDatabase = ({ labelIdentifier }) =>
  axios({
    method: 'delete',
    url: `/task/label/${labelIdentifier}`,
  }).then(({ data }) => data);
