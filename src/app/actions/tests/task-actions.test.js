import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { getTaskHistory as getTaskHistoryApi, updateTask } from 'api/task-api';
import {
  getTaskHistory,
  clearCurrentTaskHistory,
  moveTask,
  updateDueDate,
  updateReminder,
  updatePatient,
} from '../task-actions';
import {
  REQUEST_HISTORY,
  GET_TASK_HISTORY_SUCCESS,
  GET_TASK_HISTORY_ERROR,
  CLEAR_CURRENT_TASK_HISTORY,
  UPDATE_TASK_DUE_DATE,
  UPDATE_TASK_REMINDER,
  UPDATE_TASK_PATIENT,
  MOVE_TASK_SUCCESS,
} from '../action-types';

jest.mock('api/task-api', () => ({
  getTaskHistory: jest.fn(),
  updateTask: jest.fn(),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const MOCKED_DATA = '2019-03-27T03:00:00.000Z';

describe('getTaskHistory', () => {
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

    getTaskHistoryApi.mockReturnValue(Promise.resolve([]));

    const task = { taskIdentifier: 0 };

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

    getTaskHistoryApi.mockReturnValue(Promise.reject(new Error({})));

    const task = { taskIdentifier: 0 };

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

describe('moveTask', () => {
  it('should remove task from current tasklist after update', async () => {
    const taskList = { taskListIdentifier: '', listName: 'List #1' };
    const task = { taskIdentifier: 0, taskList };

    const expectedActions = [{ type: MOVE_TASK_SUCCESS, task }];

    const store = mockStore({
      taskState: {
        tasks: [task, { taskIdentifier: 1, taskList }],
      },
    });

    const updatedTask = {
      taskIdentifier: 0,
      taskList: { taskListIdentifier: 1, listName: 'List #2' },
    };
    updateTask.mockReturnValue(Promise.resolve(updatedTask));

    await store.dispatch(
      moveTask(task, { taskListIdentifier: 1, listName: 'List #2' }),
    );
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should remove subtask from current tasklist after update', async () => {
    const taskList = { taskListIdentifier: '', listName: 'List #1' };
    const task = { taskIdentifier: 2, parentTaskIdentifier: 0, taskList };

    const expectedActions = [{ type: MOVE_TASK_SUCCESS, task }];

    const store = mockStore({
      taskState: {
        tasks: [
          { taskIdentifier: 0, taskList, subtasks: [task] },
          { taskIdentifier: 1, taskList },
        ],
      },
    });

    const updatedTask = {
      taskIdentifier: 0,
      parentTaskIdentifier: null,
      taskList: { taskListIdentifier: 1, listName: 'List #2' },
    };
    updateTask.mockReturnValue(Promise.resolve(updatedTask));

    await store.dispatch(
      moveTask(task, { taskListIdentifier: 1, listName: 'List #2' }),
    );
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe('updateDueDate', () => {
  it('should update due date', async () => {
    const expectedActions = [
      {
        type: UPDATE_TASK_DUE_DATE,
        taskIdentifier: 0,
        dueDate: MOCKED_DATA,
      },
    ];

    const store = mockStore({
      taskState: {
        tasks: [{ taskIdentifier: 0, dueDate: null }],
      },
    });

    updateTask.mockReturnValue(
      Promise.resolve({
        taskIdentifier: 0,
        dueDate: MOCKED_DATA,
      }),
    );

    await store.dispatch(
      updateDueDate({ taskIdentifier: 0, dueDate: null }, MOCKED_DATA),
    );
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe('updateReminder', () => {
  it('should update due date', async () => {
    const expectedActions = [
      {
        type: UPDATE_TASK_REMINDER,
        taskIdentifier: 0,
        reminderDt: MOCKED_DATA,
      },
    ];

    const store = mockStore({
      taskState: {
        tasks: [{ taskIdentifier: 0, reminderDt: null }],
      },
    });

    updateTask.mockReturnValue(Promise.resolve({}));

    await store.dispatch(
      updateReminder({ taskIdentifier: 0, reminderDt: null }, MOCKED_DATA),
    );
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe('updatePatient', () => {
  it('should update assigned patient', async () => {
    const expectedActions = [
      {
        type: UPDATE_TASK_PATIENT,
        parentTaskIdentifier: 0,
        patient: { patientIdentifier: 1 },
      },
    ];

    const store = mockStore({
      taskState: {
        tasks: [{ taskIdentifier: 0, patient: null }],
      },
    });

    updateTask.mockReturnValue(
      Promise.resolve({ taskIdentifier: 0, patient: { patientIdentifier: 1 } }),
    );

    await store.dispatch(
      updatePatient(
        { taskIdentifier: 0, patient: null },
        { patientIdentifier: 1 },
      ),
    );
    expect(store.getActions()).toEqual(expectedActions);
  });
});
