import { Close } from '@material-ui/icons';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  highlightPatient,
  abortPatientCreation,
} from 'actions/patient-actions';
import { findUserTasksByPatient } from 'api/patient-api';
// import { groupTasksAndCompletedTasksByList } from 'helpers/group-tasks-by-list';
// import { Flag } from 'helpers/flags';
import PatientEdit from './PatientEdit';
// import PatientsSidebarSection from './PatientsSidebar.Section';
import {
  PatientsSidebarCloseButton,
  PatientsSidebarContainer,
  PatientsSidebarHeader,
  PatientsSidebarName,
} from './PatientsSidebar.Styled';
// import PatientsTasklist from './PatientsTasklist';

// const renderTaskList = ({
//   listName,
//   tasks,
//   completedTasks,
//   taskListIdentifier,
// }) => (
//   <PatientsSidebarSection key={taskListIdentifier} heading={listName}>
//     <PatientsTasklist tasks={tasks} completedTasks={completedTasks} />
//   </PatientsSidebarSection>
// );

const PatientsSidebar = ({ patient }) => {
  const { mrn, firstName, lastName, patientIdentifier } = patient ?? {};

  const dispatch = useDispatch();
  const deselectPatient = useCallback(() => {
    dispatch(highlightPatient(null));
    dispatch(abortPatientCreation());
  }, [dispatch]);

  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    if (patientIdentifier) {
      findUserTasksByPatient(patientIdentifier, 'INCOMPLETE').then(result => {
        setTasks(result);
      });
      findUserTasksByPatient(patientIdentifier, 'COMPLETE').then(result => {
        setCompletedTasks(result);
      });
    }
  }, [patientIdentifier]);

  // const taskLists = groupTasksAndCompletedTasksByList(tasks, completedTasks);

  const patientHeaderLabel = patient
    ? `${firstName || ''} ${lastName || ''} ${mrn || ''}`.trim()
    : 'Add a patient';

  return (
    <PatientsSidebarContainer>
      <PatientsSidebarHeader>
        <PatientsSidebarName variant="h4" weight="500">
          {patientHeaderLabel}
        </PatientsSidebarName>
        <PatientsSidebarCloseButton size="small" onClick={deselectPatient}>
          <Close />
        </PatientsSidebarCloseButton>
      </PatientsSidebarHeader>
      <div>
        <PatientEdit patient={patient} compact />
        {/* <Flag name={['features', 'showTasksInPatientDrawer']}>
          {taskLists.map(renderTaskList)}
        </Flag> */}
      </div>
    </PatientsSidebarContainer>
  );
};

export default PatientsSidebar;
