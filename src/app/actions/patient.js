import { findUserTasksByPatient, getPatientById } from '../api/patient-api';
import {
  FETCH_PATIENT,
  FETCH_PATIENT_ERROR,
  FETCH_PATIENT_SUCCESS,
} from './action-types';
import { storeAsCurrentTask, storeAllTasks } from './task-actions';
import { getMembersByTaskListId } from './tasklist-actions';

export const fetchPatient = patientIdentifier => async dispatch => {
  dispatch({ type: FETCH_PATIENT });
  try {
    const fetchDetails = getPatientById(patientIdentifier);
    const fetchTasks = findUserTasksByPatient(patientIdentifier, 'INCOMPLETE');
    const fetchCompletedTasks = findUserTasksByPatient(patientIdentifier, 'COMPLETE');

    const [details, tasks, completedTasks] = await Promise.all([
      fetchDetails,
      fetchTasks,
      fetchCompletedTasks,
    ]);

    dispatch({
      type: FETCH_PATIENT_SUCCESS,
      details,
      tasks,
      completedTasks,
    });

    dispatch(storeAllTasks(tasks, completedTasks));
  } catch (error) {
    dispatch({ type: FETCH_PATIENT_ERROR, error });
  }
};

export const selectPatientTask = task => async dispatch => {
  const taskListIdentifier = task?.taskList?.taskListIdentifier;
  if (taskListIdentifier) {
    dispatch(getMembersByTaskListId(taskListIdentifier, 'ALL'));
  }
  dispatch(storeAsCurrentTask(task));
};
