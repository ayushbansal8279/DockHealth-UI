import React from 'react';
import {
  initializePatient,
  clearPatientTasksState,
  setActiveTab,
} from 'actions/patient-tasks-actions';
import { getPatient } from 'sagas/patient-saga';
import {
  fetchStatsForPatientTasks,
  fetchPatientTasks,
  fetchPatientFilters,
  initalizeSavedFilters,
} from 'sagas/patient-tasks-saga';
import { clearPatientDetails } from 'actions/patient';
import { setHeader } from 'actions/header-actions';
import GenericHeader from 'components/common/GenericHeader';
import { TaskListTabName } from 'components/taskView/Toolbar/config';

export const onEnterPatientDetailsView = async ({ match, dispatch }) => {
  const { params } = match;
  const { patientIdentifier, tabName } = params;

  setHeader(dispatch)({
    layout: [
      {
        key: 'patient-header',
        component: <GenericHeader>Patient</GenericHeader>,
      },
    ],
  });
  await dispatch(initializePatient(patientIdentifier));
  await dispatch(getPatient());

  if (tabName === TaskListTabName.COMPLETE) {
    dispatch(setActiveTab(TaskListTabName.COMPLETE));
  } else {
    dispatch(setActiveTab(TaskListTabName.OPEN));
  }
  dispatch(fetchStatsForPatientTasks());
  dispatch(initalizeSavedFilters());
  dispatch(fetchPatientTasks());
  dispatch(fetchPatientFilters());
};

export const onLeavePatientDetailsView = ({ dispatch }) => {
  dispatch(clearPatientTasksState());
  dispatch(clearPatientDetails());
};

export const onEnterPatientOpenTasksListView = () => {
  // do nothing
};

export const onEnterPatientCompleteTasksListView = () => {
  // do nothing
};
