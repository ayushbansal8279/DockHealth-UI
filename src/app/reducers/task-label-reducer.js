/* eslint-disable no-param-reassign */
import {
  FAILURE_ADDING_LABEL,
  FAILURE_FETCHING_INBOX_LABELS,
  FAILURE_FETCHING_LIST_LABELS,
  FAILURE_REMOVING_LABEL_FROM_DATABASE,
  FAILURE_REMOVING_TASK_LABEL,
  REQUEST_ADDING_LABEL,
  REQUEST_FETCHING_INBOX_LABELS,
  REQUEST_FETCHING_LIST_LABELS,
  REQUEST_REMOVING_LABEL_FROM_DATABASE,
  REQUEST_REMOVING_TASK_LABEL,
  SUCCESS_ADDING_LABEL,
  SUCCESS_FETCHING_INBOX_LABELS,
  SUCCESS_FETCHING_LIST_LABELS,
  SUCCESS_REMOVING_LABEL_FROM_DATABASE,
  SUCCESS_REMOVING_TASK_LABEL,
} from 'actions/action-types';
import produce from 'immer';

const STATE_KEYS = {
  ADDING_LABEL: 'addingLabel',
  INBOX_LABELS: 'inboxLabels',
  LIST_LABELS: 'listLabels',
  REMOVING_LABEL_FROM_DATABASE: 'removingLabelFromDatabase',
  REMOVING_TASK_LABEL: 'removingTaskLabel',
};

const STATE_DATA_KEYS = {
  ERRORS: 'errors',
  REQUESTING: 'requesting',
  DATA: 'data',
};

const initialState = Object.fromEntries(
  Object.values(STATE_DATA_KEYS).map(dataKey => [
    dataKey,
    Object.fromEntries(
      Object.values(STATE_KEYS).map(stateKey => [stateKey, null]),
    ),
  ]),
);

const getErrorResolver = ({ state, path, error }) =>
  produce(state, draftState => {
    draftState[STATE_DATA_KEYS.ERRORS][path] = error;
    draftState[STATE_DATA_KEYS.DATA][path] = null;
  });

const getRequestingResolver = ({ state, path, payload }) =>
  produce(state, draftState => {
    draftState[STATE_DATA_KEYS.REQUESTING][path] = payload;
    if (payload) {
      draftState[STATE_DATA_KEYS.DATA][path] = null;
    }
  });

const getSuccessResolver = ({ state, path, payload }) =>
  produce(state, draftState => {
    draftState[STATE_DATA_KEYS.DATA][path] = payload;
  });

// array with [path, resolver] tuples
const actionTypeResolverBindings = {
  [FAILURE_ADDING_LABEL]: [STATE_KEYS.ADDING_LABEL, getErrorResolver],
  [FAILURE_FETCHING_INBOX_LABELS]: [STATE_KEYS.INBOX_LABELS, getErrorResolver],
  [FAILURE_FETCHING_LIST_LABELS]: [STATE_KEYS.LIST_LABELS, getErrorResolver],
  [FAILURE_REMOVING_LABEL_FROM_DATABASE]: [
    STATE_KEYS.REMOVING_LABEL_FROM_DATABASE,
    getErrorResolver,
  ],
  [FAILURE_REMOVING_TASK_LABEL]: [
    STATE_KEYS.REMOVING_TASK_LABEL,
    getErrorResolver,
  ],
  [REQUEST_ADDING_LABEL]: [STATE_KEYS.ADDING_LABEL, getRequestingResolver],
  [REQUEST_FETCHING_INBOX_LABELS]: [
    STATE_KEYS.INBOX_LABELS,
    getRequestingResolver,
  ],
  [REQUEST_FETCHING_LIST_LABELS]: [
    STATE_KEYS.LIST_LABELS,
    getRequestingResolver,
  ],
  [REQUEST_REMOVING_LABEL_FROM_DATABASE]: [
    STATE_KEYS.REMOVING_LABEL_FROM_DATABASE,
    getRequestingResolver,
  ],
  [REQUEST_REMOVING_TASK_LABEL]: [
    STATE_KEYS.REMOVING_TASK_LABEL,
    getRequestingResolver,
  ],
  [SUCCESS_ADDING_LABEL]: [STATE_KEYS.ADDING_LABEL, getSuccessResolver],
  [SUCCESS_FETCHING_INBOX_LABELS]: [
    STATE_KEYS.INBOX_LABELS,
    getSuccessResolver,
  ],
  [SUCCESS_FETCHING_LIST_LABELS]: [STATE_KEYS.LIST_LABELS, getSuccessResolver],
  [SUCCESS_REMOVING_LABEL_FROM_DATABASE]: [
    STATE_KEYS.REMOVING_LABEL_FROM_DATABASE,
    getSuccessResolver,
  ],
  [SUCCESS_REMOVING_TASK_LABEL]: [
    STATE_KEYS.REMOVING_TASK_LABEL,
    getSuccessResolver,
  ],
};

const TaskLabelReducer = (state = initialState, { type, payload, error }) => {
  const [path, resolver] = actionTypeResolverBindings[type] || [];

  if (resolver && path) {
    return resolver({ state, path, payload, error });
  }

  return state;
};

export default TaskLabelReducer;
