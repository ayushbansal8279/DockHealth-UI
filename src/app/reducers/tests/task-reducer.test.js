import reducer from '../task-reducer';
import {
  REQUEST_HISTORY,
  GET_TASK_HISTORY_SUCCESS,
  GET_TASK_HISTORY_ERROR,
  CLEAR_CURRENT_TASK_HISTORY,
  UPDATE_TASK_DUE_DATE,
} from '../../actions/action-types';

describe('task-reducer', () => {
  it('should return the initial state', () => {
    const state = reducer(undefined, {});

    expect(state.isHistoryFetching).toBe(false);
    expect(state.currentTaskHistory).toBe(null);
    expect(state.historyError).toBe(null);
  });

  it('should handle REQUEST_HISTORY', () => {
    const action = { type: REQUEST_HISTORY };
    const state = reducer(undefined, action);

    expect(state.isHistoryFetching).toBe(true);
    expect(state.currentTaskHistory).toBe(null);
    expect(state.historyError).toBe(null);
  });

  it('should handle GET_TASK_HISTORY_SUCCESS', () => {
    const action = { type: GET_TASK_HISTORY_SUCCESS, auditDetails: [] };
    const state = reducer(undefined, action);

    expect(state.isHistoryFetching).toBe(false);
    expect(state.currentTaskHistory).toEqual(action.auditDetails);
    expect(state.historyError).toBe(null);
  });

  it('should handle GET_TASK_HISTORY_ERROR', () => {
    const action = { type: GET_TASK_HISTORY_ERROR, error: { response: { status: 500 } } };
    const state = reducer(undefined, action);

    expect(state.isHistoryFetching).toBe(false);
    expect(state.currentTaskHistory).toEqual(null);
    expect(state.historyError).toEqual(action.error);
  });

  it('should handle CLEAR_CURRENT_TASK_HISTORY', () => {
    const action = { type: CLEAR_CURRENT_TASK_HISTORY };
    const state = reducer(undefined, action);

    expect(state.isHistoryFetching).toBe(false);
    expect(state.currentTaskHistory).toBe(null);
    expect(state.historyError).toBe(null);
  });

  it('should handle UPDATE_TASK_DUE_DATE', () => {
    const action = { type: UPDATE_TASK_DUE_DATE, taskId: 0, dueDate: '2019-03-27T03:00:00.000Z' };
    const initialState = {
      tasks: [{ taskId: 0, dueDate: '' }],
    };
    const state = reducer(initialState, action);

    expect(state.tasks[0].dueDate).toEqual(action.dueDate);
    expect(state.tasks).toMatchSnapshot();
  });
});
