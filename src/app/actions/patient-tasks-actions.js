import { SET_ACTIVE_TAB, CLEAR_PATIENT_TASKS } from './action-types';

export const setActiveTab = activeTab => ({
  type: SET_ACTIVE_TAB,
  payload: { activeTab },
});

export const clearPatientTasksState = () => ({
  type: CLEAR_PATIENT_TASKS,
});
