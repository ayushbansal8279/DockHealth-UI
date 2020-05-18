import axios from 'api/axios-heydoc';

export const addLabel = ({ labelIdentifier, labelName, taskIdentifier }) =>
  axios({
    method: 'post',
    url: '/task/label',
    data: {
      labelIdentifier,
      labelName,
      taskIdentifier,
    },
  });

export const editLabel = ({ labelIdentifier, labelName, taskIdentifier }) =>
  axios({
    method: 'put',
    url: '/task/label',
    data: {
      labelIdentifier,
      labelName,
      taskIdentifier,
    },
  });

export const removeLabelForTask = ({
  labelIdentifier,
  labelName,
  taskIdentifier,
}) =>
  axios({
    method: 'put',
    url: '/task/label/remove',
    data: {
      labelIdentifier,
      labelName,
      taskIdentifier,
    },
  });

export const getInboxLabels = () =>
  axios({
    method: 'get',
    url: '/task/label/getLabelsForInboxTaskList',
  });

export const getTaskListLabels = ({ taskListIdentifier }) =>
  axios({
    method: 'get',
    url: `/task/label/getLabelsForTaskList/${taskListIdentifier}`,
  });

export const removeLabelFromDatabase = ({ labelIdentifier }) =>
  axios({
    method: 'delete',
    url: `/task/label/${labelIdentifier}`,
  });
