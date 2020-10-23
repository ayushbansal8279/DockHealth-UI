import produce from 'immer';
import {
  always,
  evolve,
  lensProp,
  map,
  pathEq,
  propEq,
  set,
  when,
} from 'ramda';
import {
  ADD_PATIENT_NOTE,
  CLEAR_PATIENT,
  FETCH_PATIENT,
  FETCH_PATIENT_ERROR,
  FETCH_PATIENT_SUCCESS,
  MOVE_TASK_SUCCESS,
  UPDATE_PATIENT_NOTE,
  UPDATE_PATIENT_SUCCESS,
} from 'actions/action-types';
// import TaskReducer from './task-reducer';
// import ListTasksReducer from './list-tasks-reducer';

const initialState = {
  details: {},
  isLoading: false,
  error: null,
  tasks: null,
  completedTasks: null,
};

const updateDetails = patient =>
  when(
    pathEq(['details', 'patientIdentifier'], patient.patientIdentifier),
    set(lensProp('details'), patient),
  );

const moveTask = (task, taskList) =>
  map(
    when(
      propEq(
        'taskIdentifier',
        task.parentTaskIdentifier || task.taskIdentifier,
      ),
      evolve({
        taskList: always(taskList),
        subtasks: map(set(lensProp('taskList'), taskList)),
      }),
    ),
  );

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
        ...state,
        isLoading: false,
        error: null,
        details,
        tasks,
        completedTasks,
      };
    }

    case UPDATE_PATIENT_SUCCESS: {
      const { patient } = action;
      return updateDetails(patient)(state);
    }

    case ADD_PATIENT_NOTE: {
      const { note } = action;
      const allNotes = state.details?.allNotes ?? [];

      /* eslint-disable no-param-reassign */
      return produce(state, draftState => {
        draftState.details.allNotes = [note, ...allNotes];
      });
      /* eslint-enable no-param-reassign */
    }

    case UPDATE_PATIENT_NOTE: {
      const { note } = action;

      const { patientNoteIdentifier } = note;

      const oldAllNotes = state.details?.allNotes ?? [];

      const allNotes = oldAllNotes.map(oldNote =>
        oldNote.patientNoteIdentifier === patientNoteIdentifier
          ? note
          : oldNote,
      );

      return produce(state, draftState => {
        // eslint-disable-next-line no-param-reassign
        draftState.details.allNotes = allNotes;
      });
    }

    case MOVE_TASK_SUCCESS: {
      const { task, taskList } = action;
      return { ...state, tasks: moveTask(task, taskList)(state.tasks) };
    }

    default: {
      // const { tasks, completedTasks, selectedTaskId, groupedTasks } = state;
      // const taskState = TaskReducer({ selectedTaskId }, action);
      // const listTasks = ListTasksReducer({ tasks, completedTasks, groupedTasks }, action);

      // return {
      //   ...state,
      //   tasks: listTasks.tasks,
      //   completedTasks: listTasks.completedTasks,
      //   selectedTaskId: taskState.selectedTaskId,
      // };
      return state;
    }
  }
};

export default reducer;
