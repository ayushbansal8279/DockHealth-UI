import {
  when, set, lensProp, pathEq, over, lensPath, propEq, map, prepend, evolve, always,
} from 'ramda';
import {
  ADD_TASK_SUCCESS,
  CLEAR_PATIENT,
  FETCH_PATIENT,
  FETCH_PATIENT_ERROR,
  FETCH_PATIENT_SUCCESS, MOVE_TASK_SUCCESS,
  UPDATE_PATIENT_NOTE,
  UPDATE_PATIENT_SUCCESS,
} from '../actions/action-types';
import TaskReducer from './task-reducer';

const initialState = {
  details: null,
  isLoading: false,
  error: null,
  tasks: null,
  completedTasks: null,
  isLoading: false,
  error: null,
};

const updateDetails = patient => when(
  pathEq(['details', 'patientId'], patient.patientId),
  set(lensProp('details'), patient),
);

const updateNote = (patientId, patientNoteId, description) => when(
  pathEq(['details', 'patientId'], patientId),
  over(
    lensPath(['details', 'allNotes']),
    map(when(
      propEq('patientNoteId', patientNoteId),
      set(lensProp('description'), description),
    )),
  ),
);

const moveTask = (task, taskList) => map(when(
  propEq('taskId', task.parentTaskId || task.taskId),
  evolve({
    taskList: always(taskList),
    subtasks: map(set(lensProp('taskList'), taskList)),
  }),
));

const reducer = (state = initialState, action) => {
  const { type, ...payload } = action;
  switch (type) {
    case CLEAR_PATIENT: {
      return initialState;
    }
    case FETCH_PATIENT: {
      return { ...state, isLoading: true, error: null };
    }
    case FETCH_PATIENT_ERROR: {
      const { error } = payload;
      return { ...state, isLoading: false, error };
    }
    case FETCH_PATIENT_SUCCESS: {
      const { details, tasks, completedTasks } = payload;
      return {
        ...state, isLoading: false, error: null, details, tasks, completedTasks,
      };
    }
    case UPDATE_PATIENT_SUCCESS: {
      const { patient } = action;
      return updateDetails(patient)(state);
    }
    case UPDATE_PATIENT_NOTE: {
      const { patientId, note: { patientNoteId, description } } = action;
      return updateNote(patientId, patientNoteId, description)(state);
    }
    case MOVE_TASK_SUCCESS: {
      const { task, taskList } = action;
      return { ...state, tasks: moveTask(task, taskList)(state.tasks) };
    }
    default: {
      const { tasks, completedTasks, selectedTaskId } = state;
      const taskState = TaskReducer({ tasks, completedTasks, selectedTaskId }, action);

      return {
        ...state,
        tasks: taskState.tasks,
        completedTasks: taskState.completedTasks,
        selectedTaskId: taskState.selectedTaskId,
      };
    }
  }
};

export default reducer;
