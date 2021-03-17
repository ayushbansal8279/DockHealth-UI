import React from 'react';
import {
  initializePatient,
  clearPatientTasksState,
  setActiveTab,
} from 'actions/patient-tasks-actions';
import {
  fetchStatsForPatientTasks,
  fetchPatientTasks,
  fetchPatientFilters,
  initalizeSavedFilters,
} from 'sagas/patient-tasks-saga';
import { setHeader } from 'actions/template-actions';
import GenericHeader from 'components/template/GenericHeader/GenericHeader';
import { TaskListTabName } from 'helpers/tasklist-helpers';

export const onEnterPatientDetailsView = async ({ match, dispatch }) => {
  const { params } = match;
  const { patientIdentifier, tabName } = params;

  dispatch(
    setHeader({
      layout: [
        {
          key: 'patient-header',
          component: <GenericHeader>Patient</GenericHeader>,
        },
      ],
    }),
  );
  await dispatch(initializePatient(patientIdentifier));

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
};

export const onEnterPatientOpenTasksListView = () => {
  // do nothing
};

export const onEnterPatientCompleteTasksListView = () => {
  // do nothing
};
