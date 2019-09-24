import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import ButtonBase from '@material-ui/core/ButtonBase';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import { groupWith, equals, evolve } from 'ramda';
import { Flag } from '../../flags';
import {
  highlightPatient,
  updatePatient,
} from '../../actions/patient-actions';
import CollapseIcon from '../../img/collapse.svg';
import PhoneHomeIcon from '../../img/phone-home.svg';
import PhoneCellIcon from '../../img/phone-cell.svg';
import PatientsTasklist from './PatientsTasklist';
import { findUserTasksByPatient } from '../../api/patient-api';
import PatientEdit, { PatientsForm } from './PatientEdit';
import { capitalize, capitalizeWords } from '../../helpers/capitalize';

export const PatientsSidebarContainer = styled.div`
  min-width: 562px;
  //flex-shrink: 0;
  padding: 4px;
`;

export const PatientsSidebarHeader = styled.div`
  display: flex;
  position: relative;
  height: 67px;
  background: #2a4a70;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.24), 0 0 4px 0 rgba(0, 0, 0, 0.12);
  color: #fff;
  font-size: 24px;
  font-weight: 600;
  padding: 15px 13.5px 19px 27px;
`;

export const PatientsSidebarSectionContainer = styled.div`
  border: solid 2px #ddf2f7;
  background: #fff;
  padding: 18px 27px 27px 24px;
  
  :not(:first-child) {
     margin-top: 4px;
   }
`;

export const PatientsSidebarSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const PatientsSidebarSectionHeading = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #0ca1c7;
`;

const PatientsSidebarField = styled.div`
  border-radius: 2px;
  background-color: rgba(243, 245, 246, 0.5);
  display: flex;
  justify-content: space-between;
  padding: 10px 22px 10px 14px;
  margin-top: 9px;
`;

const PatientsSidebarSubsection = styled.div`
  border-top: solid 1px #a6dcea;
  margin-top: 22px;
  
  margin-left: -11px;
  margin-right: -11px;
  padding-left: 11px;
  padding-right: 11px;
`;

export const PatientsSidebarSubsectionHeading = styled.div`
  font-size: 14px;
  font-weight: bold;
  line-height: 36px;
  color: #0ca1c7;
`;

const PatientsSidebarNoteDescription = styled.div`
  font-size: 14px;
  color: #303538;
`;

const PatientsSidebarNoteInfo = styled.div`
  font-size: 14px;
  color: #ababb2;
`;

const PatientsSidebarContact = styled.div`
  display: flex;
  padding: 8px;
  width: 278px;
  height: 81px;
  border-radius: 2px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.24), 0 0 2px 0 rgba(0, 0, 0, 0.12);
  border-style: solid;
  border-width: 0.5px;
  border-image-source: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0) 80%, rgba(0, 0, 0, 0.02) 95%, rgba(0, 0, 0, 0.04));
  border-image-slice: 1;
  background-image: #ffffff, linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0) 80%, rgba(0, 0, 0, 0.02) 95%, rgba(0, 0, 0, 0.04));
  background-origin: border-box;
  background-clip: content-box, border-box;
`;

const PatientsSidebarContactNumber = styled.div`
  font-size: 16px;
  color: rgba(0, 0, 0, 0.87);
`;

const PatientsSidebarContactCategory = styled.div`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.54);
`;

export const PatientsSidebarCloseButton = styled(ButtonBase)`
  && {
    margin-left: auto;
    width: 36px;
    height: 36px;
    background: #ababb2;
    border-radius: 50%;
    color: #fff;
    font-weight: bold;
    font-size: 18px;
  }
`;

const StyledButton = styled(({ isCollapsed, ...props }) => <IconButton {...props} />)`
  && {
    height: 36px;
    width: 36px;
    padding: 0;
    ${({ isCollapsed }) => isCollapsed && 'transform: rotate(180deg);'}
  }
`;

export const PatientsSidebarSection = ({
  heading, children, hideCollapse = false, style,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleIsCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <PatientsSidebarSectionContainer style={style}>
      <PatientsSidebarSectionHeader>
        <PatientsSidebarSectionHeading>{heading}</PatientsSidebarSectionHeading>
        {!hideCollapse && (
          <StyledButton isCollapsed={isCollapsed} onClick={toggleIsCollapsed}>
            <img src={CollapseIcon} alt="Collapse Details" />
          </StyledButton>)}
      </PatientsSidebarSectionHeader>
      {!isCollapsed && children }
    </PatientsSidebarSectionContainer>
  );
};

const PatientsSidebarValue = styled.div`
  font-weight: 600;
`;

const calculateAgeFromDateOfBirth = dob => dob && moment().diff(dob, 'years');
const formatAge = age => (age === 1 ? '1yr old' : `${age}yrs old`);

const PatientsDetailsSection = ({
  dob, gender, email, phoneHome, phoneMobile, notes,
}) => (
  <PatientsSidebarSection heading="Patient Details">
    <PatientsSidebarField>
      <div style={{ flex: 0.5 }}>Birthday</div>
      <div style={{
        flex: 0.25,
        textAlign: 'right',
      }}
      >
        {dob && <PatientsSidebarValue>{formatAge(calculateAgeFromDateOfBirth(dob))}</PatientsSidebarValue>}
      </div>
      <div style={{
        flex: 0.25,
        textAlign: 'right',
      }}
      >
        {(dob && <PatientsSidebarValue>{dob}</PatientsSidebarValue>) || '—'}
      </div>
    </PatientsSidebarField>
    <PatientsSidebarField>
      <div>Gender</div>
      <div>
        {(gender && <PatientsSidebarValue>{gender}</PatientsSidebarValue>) || '—'}
      </div>
    </PatientsSidebarField>
    <PatientsSidebarField>
      <div>Email</div>
      <div>
        {(email && (
          <PatientsSidebarValue style={{ color: '#0ca1c7' }}>
            <a href={`mailto:${email}`}>
              {email}
            </a>
          </PatientsSidebarValue>
        )) || '—'}
      </div>
    </PatientsSidebarField>
    <PatientsSidebarSubsection>
      <PatientsSidebarSubsectionHeading>Patient Contact</PatientsSidebarSubsectionHeading>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
      >
        <PatientsSidebarContact>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: '#00a73c',
          }}
          >
            <img src={PhoneHomeIcon} alt="Phone Number (Home)" />
          </div>
          <div style={{ marginLeft: '15px' }}>
            <PatientsSidebarContactNumber>{phoneHome || '—'}</PatientsSidebarContactNumber>
            <PatientsSidebarContactCategory>Home</PatientsSidebarContactCategory>
          </div>
        </PatientsSidebarContact>
        <PatientsSidebarContact>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: '#FB7C06',
          }}
          >
            <img src={PhoneCellIcon} alt="Phone Number (Cell)" />
          </div>
          <div style={{ marginLeft: '15px' }}>
            <PatientsSidebarContactNumber>{phoneMobile || '—'}</PatientsSidebarContactNumber>
            <PatientsSidebarContactCategory>Mobile</PatientsSidebarContactCategory>
          </div>
        </PatientsSidebarContact>
      </div>
    </PatientsSidebarSubsection>
    <PatientsSidebarSubsection>
      <PatientsSidebarSubsectionHeading>Notes</PatientsSidebarSubsectionHeading>
      <div>
        <PatientsSidebarNoteDescription>
          {notes || '—'}
        </PatientsSidebarNoteDescription>
         {/*<PatientsSidebarNoteInfo>*/}
         {/* Michael Docktor | Tuesday, October 2nd*/}
         {/*</PatientsSidebarNoteInfo>*/}
      </div>
    </PatientsSidebarSubsection>
  </PatientsSidebarSection>
);

const PatientsSidebar = ({ patient }) => {
  const {
    mrn, firstName, middleName, lastName, dob, gender, phoneHome, phoneMobile, email, notes, patientId, allNotes,
  } = patient;
  const dispatch = useDispatch();
  const deselectPatient = useCallback(() => {
    dispatch(highlightPatient(null));
  }, [dispatch]);

  useEffect(() => () => {
    deselectPatient();
  }, [deselectPatient]);

  // Fetch tasks
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  useEffect(() => {
    findUserTasksByPatient(patientId, 'INCOMPLETE').then((result) => {
      const resultWInbox = result.map(task => ({ ...task, taskList: task.taskList || ({ listName: 'Inbox' }) }));
      const resultWSubtasks = resultWInbox.map(task => ({ ...task, subtasks: task.subtasks.map(subtask => ({ ...subtask, taskList: task.taskList })) }));
      setTasks(resultWSubtasks);
    });
    findUserTasksByPatient(patientId, 'COMPLETE').then((result) => {
      const resultWInbox = result.map(task => ({ ...task, taskList: task.taskList || ({ listName: 'Inbox' }) }));
      const resultWSubtasks = resultWInbox.map(task => ({ ...task, subtasks: task.subtasks.map(subtask => ({ ...subtask, taskList: task.taskList })) }));
      setCompletedTasks(resultWSubtasks);
    });
  }, [patientId]);

  // Group by tasklist
  const sameTasklist = (a, b) => a.taskList.taskListId === b.taskList.taskListId;
  const taskListsIncomplete = groupWith(sameTasklist, tasks)
    .map(tasks => ({ ...tasks[0].taskList, tasks })); // eslint-disable-line no-shadow
  const taskListsComplete = groupWith(sameTasklist, completedTasks)
    .map(tasks => ({ ...tasks[0].taskList, tasks })); // eslint-disable-line no-shadow

  const taskLists = taskListsIncomplete.map(taskList => ({
    ...taskList,
    completedTasks: (taskListsComplete.find(tl => tl.taskListId === taskList.taskListId))?.tasks,
  }));

  return (
    <PatientsSidebarContainer>
      <PatientsSidebarHeader>
        <div>{`${firstName || ''} ${lastName || ''} ${mrn || ''}`}</div>
        <PatientsSidebarCloseButton onClick={deselectPatient}>✕</PatientsSidebarCloseButton>
      </PatientsSidebarHeader>
      <div>
        <Flag
          name={['features', 'showOldPatientDetails']}
          render={() => (
            <PatientsDetailsSection
              dob={dob}
              gender={gender}
              email={email}
              phoneHome={phoneHome}
              phoneMobile={phoneMobile}
              notes={notes}
            />
          )}
          fallbackRender={() => (
            <PatientEdit patient={{
              allNotes, patientId, mrn, firstName, middleName, lastName, dob: dob && moment(dob).format('MM/DD/YYYY'), gender, phoneHome, phoneMobile, email, notes,
            }}
            />
          )}
        />
        <Flag name={['features', 'showTasksInPatientDrawer']}>
          {taskLists.map(taskList => (
            <PatientsSidebarSection heading={taskList.listName}>
              <PatientsTasklist tasks={taskList.tasks} completedTasks={taskList.completedTasks} />
            </PatientsSidebarSection>
          ))}
        </Flag>
      </div>
    </PatientsSidebarContainer>
  );
};

export default PatientsSidebar;
