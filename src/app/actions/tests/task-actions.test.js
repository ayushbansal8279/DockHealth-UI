import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  getTaskHistory, clearCurrentTaskHistory, moveTask, updateDueDate, updateReminder, updatePatient,
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
import TaskApi from '../../api/task-api';

jest.mock('../../api/task-api', () => ({
  getTaskHistory: jest.fn(),
  updateTask: jest.fn(),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

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


describe('moveTask', () => {
  it('should remove task from current tasklist after update', async () => {
    const taskList = { taskListId: 0, listName: 'List #1' };
    const task = { taskId: 0, taskList };

    const expectedActions = [
      { type: MOVE_TASK_SUCCESS, task },
    ];

    const store = mockStore({
      taskState: {
        tasks: [
          task,
          { taskId: 1, taskList },
        ],
      },
    });

    const updatedTask = { taskId: 0, taskList: { taskListId: 1, listName: 'List #2' } };
    TaskApi.updateTask.mockReturnValue(Promise.resolve(updatedTask));

    await store.dispatch(moveTask(task, { taskListId: 1, listName: 'List #2' }));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should remove subtask from current tasklist after update', async () => {
    const taskList = { taskListId: 0, listName: 'List #1' };
    const task = { taskId: 2, parentTaskId: 0, taskList };

    const expectedActions = [
      { type: MOVE_TASK_SUCCESS, task },
    ];

    const store = mockStore({
      taskState: {
        tasks: [
          { taskId: 0, taskList, subtasks: [task] },
          { taskId: 1, taskList },
        ],
      },
    });

    const updatedTask = { taskId: 0, parentTaskId: null, taskList: { taskListId: 1, listName: 'List #2' } };
    TaskApi.updateTask.mockReturnValue(Promise.resolve(updatedTask));

    await store.dispatch(moveTask(task, { taskListId: 1, listName: 'List #2' }));
    expect(store.getActions()).toEqual(expectedActions);
  });
});


describe('updateDueDate', () => {
  it('should update due date', async () => {
    const expectedActions = [
      { type: UPDATE_TASK_DUE_DATE, taskId: 0, dueDate: '2019-03-27T03:00:00.000Z' },
    ];

    const store = mockStore({
      taskState: {
        tasks: [{ taskId: 0, dueDate: null }],
      },
    });

    TaskApi.updateTask.mockReturnValue(Promise.resolve({ taskId: 0, dueDate: '2019-03-27T03:00:00.000Z' }));

    await store.dispatch(updateDueDate({ taskId: 0, dueDate: null }, '2019-03-27T03:00:00.000Z'));
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe('updateReminder', () => {
  it('should update due date', async () => {
    const expectedActions = [
      { type: UPDATE_TASK_REMINDER, taskId: 0, reminderDt: '2019-03-27T03:00:00.000Z' },
    ];

    const store = mockStore({
      taskState: {
        tasks: [{ taskId: 0, reminderDt: null }],
      },
    });

    TaskApi.updateTask.mockReturnValue(Promise.resolve({}));

    await store.dispatch(updateReminder({ taskId: 0, reminderDt: null }, '2019-03-27T03:00:00.000Z'));
    expect(store.getActions()).toEqual(expectedActions);
  });
});


describe('updatePatient', () => {
  it('should update assigned patient', async () => {
    const expectedActions = [
      { type: UPDATE_TASK_PATIENT, taskId: 0, patient: { patientId: 1 } },
    ];

    const store = mockStore({
      taskState: {
        tasks: [{ taskId: 0, patient: null }],
      },
    });

    TaskApi.updateTask.mockReturnValue(Promise.resolve({ taskId: 0, patient: { patientId: 1 } }));

    await store.dispatch(updatePatient({ taskId: 0, patient: null }, { patientId: 1 }));
    expect(store.getActions()).toEqual(expectedActions);
  });
});
