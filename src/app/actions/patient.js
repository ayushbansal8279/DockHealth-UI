import { findUserTasksByPatient, getPatientById } from '../api/patient-api';
import {
  FETCH_PATIENT,
  FETCH_PATIENT_ERROR,
  FETCH_PATIENT_SUCCESS,
} from './action-types';
import { storeAsCurrentTask } from './task-actions';
import { getMembersByTaskListId } from './tasklist-actions';

export const fetchPatient = patientId => async (dispatch) => {
  dispatch({ type: FETCH_PATIENT });
  try {
    const fetchDetails = getPatientById(patientId);
    const fetchTasks = findUserTasksByPatient(patientId, 'INCOMPLETE');
    const fetchCompletedTasks = findUserTasksByPatient(patientId, 'COMPLETE');

    const [details, tasks, completedTasks] = await Promise.all([
      fetchDetails,
      fetchTasks,
      fetchCompletedTasks,
    ]);

    dispatch({ type: FETCH_PATIENT_SUCCESS, details, tasks, completedTasks });
  } catch (error) {
    dispatch({ type: FETCH_PATIENT_ERROR, error });
  }
};

export const selectPatientTask = task => async (dispatch) => {
  const taskListId = task?.taskList?.taskListId;
  if (taskListId) {
    dispatch(getMembersByTaskListId(taskListId, 'ALL'));
  }
  dispatch(storeAsCurrentTask(task));
};
