/* eslint-disable unicorn/consistent-function-scoping */
import * as TaskLabelApi from 'api/task-label-api';

import {
  FAILURE_ADDING_LABEL,
  FAILURE_EDITING_LABEL,
  FAILURE_FETCHING_INBOX_LABELS,
  FAILURE_FETCHING_LIST_LABELS,
  FAILURE_REMOVING_LABEL_FROM_DATABASE,
  FAILURE_REMOVING_TASK_LABEL,
  REQUEST_ADDING_LABEL,
  REQUEST_EDITING_LABEL,
  REQUEST_FETCHING_INBOX_LABELS,
  REQUEST_FETCHING_LIST_LABELS,
  REQUEST_REMOVING_LABEL_FROM_DATABASE,
  REQUEST_REMOVING_TASK_LABEL,
  SUCCESS_ADDING_LABEL,
  SUCCESS_EDITING_LABEL,
  SUCCESS_FETCHING_INBOX_LABELS,
  SUCCESS_FETCHING_LIST_LABELS,
  SUCCESS_REMOVING_LABEL_FROM_DATABASE,
  SUCCESS_REMOVING_TASK_LABEL,
} from './action-types';

const getActionResolver = ({
  fetchingActionType,
  successActionType,
  failureActionType,
  dispatch,
  apiMethod,
  apiMethodParameters = {},
}) => {
  dispatch({ type: fetchingActionType, payload: true });

  return apiMethod(apiMethodParameters)
    .then(response => {
      const data = response?.data;

      dispatch({
        type: successActionType,
        payload: data,
        parameters: apiMethodParameters,
      });
      dispatch({ type: fetchingActionType, payload: false });

      return data;
    })
    .catch(error => {
      dispatch({
        type: failureActionType,
        error,
        parameters: apiMethodParameters,
      });
      dispatch({ type: fetchingActionType, payload: false });

      throw error;
    });
};

export const addLabel = ({
  labelIdentifier,
  labelName,
  taskIdentifier,
}) => dispatch =>
  getActionResolver({
    fetchingActionType: REQUEST_ADDING_LABEL,
    successActionType: SUCCESS_ADDING_LABEL,
    failureActionType: FAILURE_ADDING_LABEL,
    dispatch,
    apiMethod: TaskLabelApi.addLabel,
    apiMethodParameters: { labelIdentifier, labelName, taskIdentifier },
  });

export const editLabel = ({
  labelIdentifier,
  labelName,
  taskIdentifier,
}) => dispatch =>
  getActionResolver({
    fetchingActionType: REQUEST_EDITING_LABEL,
    successActionType: SUCCESS_EDITING_LABEL,
    failureActionType: FAILURE_EDITING_LABEL,
    dispatch,
    apiMethod: TaskLabelApi.editLabel,
    apiMethodParameters: { labelIdentifier, labelName, taskIdentifier },
  });

export const removeLabelForTask = ({
  labelIdentifier,
  labelName,
  taskIdentifier,
}) => dispatch =>
  getActionResolver({
    fetchingActionType: REQUEST_REMOVING_TASK_LABEL,
    successActionType: SUCCESS_REMOVING_TASK_LABEL,
    failureActionType: FAILURE_REMOVING_TASK_LABEL,
    dispatch,
    apiMethod: TaskLabelApi.removeLabelForTask,
    apiMethodParameters: { labelIdentifier, labelName, taskIdentifier },
  });

export const getInboxLabels = () => dispatch =>
  getActionResolver({
    fetchingActionType: REQUEST_FETCHING_INBOX_LABELS,
    successActionType: SUCCESS_FETCHING_INBOX_LABELS,
    failureActionType: FAILURE_FETCHING_INBOX_LABELS,
    dispatch,
    apiMethod: TaskLabelApi.getInboxLabels,
  });

export const getTaskListLabels = ({ taskListIdentifier }) => dispatch =>
  getActionResolver({
    fetchingActionType: REQUEST_FETCHING_LIST_LABELS,
    successActionType: SUCCESS_FETCHING_LIST_LABELS,
    failureActionType: FAILURE_FETCHING_LIST_LABELS,
    dispatch,
    apiMethod: TaskLabelApi.getTaskListLabels,
    apiMethodParameters: { taskListIdentifier },
  });

export const removeLabelFromDatabase = ({
  labelIdentifier,
  isInbox,
}) => dispatch =>
  getActionResolver({
    fetchingActionType: REQUEST_REMOVING_LABEL_FROM_DATABASE,
    successActionType: SUCCESS_REMOVING_LABEL_FROM_DATABASE,
    failureActionType: FAILURE_REMOVING_LABEL_FROM_DATABASE,
    dispatch,
    apiMethod: TaskLabelApi.removeLabelFromDatabase,
    apiMethodParameters: { labelIdentifier, isInbox },
  });
