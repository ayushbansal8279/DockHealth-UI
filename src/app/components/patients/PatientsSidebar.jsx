import curry from 'ramda/es/curry';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { highlightPatient } from '../../actions/patient-actions';
import { findUserTasksByPatient } from '../../api/patient-api';
import { Flag } from '../../flags';
import { groupTasksAndCompletedTasksByList } from '../../helpers/group-tasks-by-list';
import PatientEdit from './PatientEdit';
import PatientsSidebarSection from './PatientsSidebar.Section';
import {
  PatientsSidebarCloseButton,
  PatientsSidebarContainer,
  PatientsSidebarHeader,
  PatientsSidebarName,
} from './PatientsSidebar.Styled';
import PatientsTasklist from './PatientsTasklist';

const renderTaskList = ({ listName, tasks, completedTasks, taskListId }) => (
  <PatientsSidebarSection key={taskListId} heading={listName}>
    <PatientsTasklist tasks={tasks} completedTasks={completedTasks} />
  </PatientsSidebarSection>
);

const PatientsSidebar = ({ patient }) => {
  const {
    mrn,
    firstName,
    middleName,
    lastName,
    dob,
    gender,
    phoneHome,
    phoneMobile,
    email,
    notes,
    patientId,
    allNotes,
  } = patient;
  const dispatch = useDispatch();
  const deselectPatient = useCallback(() => {
    dispatch(highlightPatient(null));
  }, [dispatch]);

  useEffect(() => curry(deselectPatient), [deselectPatient]);

  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    findUserTasksByPatient(patientId, 'INCOMPLETE').then(result => {
      setTasks(result);
    });
    findUserTasksByPatient(patientId, 'COMPLETE').then(result => {
      setCompletedTasks(result);
    });
  }, [patientId]);

  const taskLists = groupTasksAndCompletedTasksByList(tasks, completedTasks);

  const patientName = `${firstName || ''} ${lastName || ''} ${mrn ||
    ''}`.trim();

  return (
    <PatientsSidebarContainer>
      <PatientsSidebarHeader>
        <PatientsSidebarName>{patientName}</PatientsSidebarName>
        <PatientsSidebarCloseButton onClick={deselectPatient}>
          ✕
        </PatientsSidebarCloseButton>
      </PatientsSidebarHeader>
      <div>
        <PatientEdit
          patient={{
            allNotes,
            patientId,
            mrn,
            firstName,
            middleName,
            lastName,
            dob,
            gender,
            phoneHome,
            phoneMobile,
            email,
            notes,
          }}
        />
        <Flag name={['features', 'showTasksInPatientDrawer']}>
          {taskLists.map(renderTaskList)}
        </Flag>
      </div>
    </PatientsSidebarContainer>
  );
};

export default PatientsSidebar;
