import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { getTaskHistory, clearCurrentTaskHistory } from '../task-actions';
import {
  REQUEST_HISTORY,
  GET_TASK_HISTORY_SUCCESS,
  GET_TASK_HISTORY_ERROR,
  CLEAR_CURRENT_TASK_HISTORY,
} from '../action-types';
import TaskApi from '../../api/task-api';

jest.mock('../../api/task-api', () => ({
  getTaskHistory: jest.fn(),
}));

describe('getTaskHistory', async () => {
  const middlewares = [thunk];
  const mockStore = configureStore(middlewares);

  it('should fetch audit history', async () => {
    const expectedActions = [
      { type: REQUEST_HISTORY },
      { type: GET_TASK_HISTORY_SUCCESS, auditDetails: [] },
    ];

    const store = mockStore({
      taskState: {
        currentTaskHistory: null,
        isHistoryFetching: false,
        historyError: null,
      },
    });

    // eslint-disable-next-line import/no-named-as-default-member
    TaskApi.getTaskHistory.mockReturnValue(Promise.resolve([]));

    const task = { taskId: 0 };

    await store.dispatch(getTaskHistory(task));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should handle fetching errors', async () => {
    const expectedActions = [
      { type: REQUEST_HISTORY },
      { type: GET_TASK_HISTORY_ERROR, error: new Error({}) },
    ];

    const store = mockStore({
      taskState: {
        currentTaskHistory: null,
        isHistoryFetching: false,
        historyError: null,
      },
    });

    // eslint-disable-next-line import/no-named-as-default-member
    TaskApi.getTaskHistory.mockReturnValue(Promise.reject(new Error({})));

    const task = { taskId: 0 };

    await store.dispatch(getTaskHistory(task));
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe('clearCurrentTaskHistory', () => {
  it('should create an action to clear audit history', () => {
    const expectedAction = { type: CLEAR_CURRENT_TASK_HISTORY };

    const dispatch = jest.fn();

    clearCurrentTaskHistory()(dispatch);

    expect(dispatch).toBeCalledTimes(1);
    expect(dispatch).toBeCalledWith(expectedAction);
  });
});
