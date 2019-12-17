import moment from 'moment';
import curry from 'ramda/es/curry';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { highlightPatient } from '../../actions/patient-actions';
import { findUserTasksByPatient } from '../../api/patient-api';
import { Flag } from '../../flags';
import { groupTasksAndCompletedTasksByList } from '../../helpers/groupTasksByList';
import PhoneCellIcon from '../../img/phone-cell.svg';
import PhoneHomeIcon from '../../img/phone-home.svg';
import PatientEdit from './PatientEdit';
import PatientsSidebarSection from './PatientsSidebar.Section';
import {
  PatientsSidebarCloseButton,
  PatientsSidebarContact,
  PatientsSidebarContactCategory,
  PatientsSidebarContactNumber,
  PatientsSidebarContainer,
  PatientsSidebarField,
  PatientsSidebarHeader,
  PatientsSidebarNoteDescription,
  PatientsSidebarSubsection,
  PatientsSidebarSubsectionHeading,
  PatientsSidebarValue,
} from './PatientsSidebar.Styled';
import PatientsTasklist from './PatientsTasklist';

const calculateAgeFromDateOfBirth = dob => {
  if (!dob) {
    return '';
  }

  const yearsOld = moment().diff(moment(dob), 'years');

  if (yearsOld < 0) {
    return '';
  }

  const yearsLabel = yearsOld === 1 ? 'yr' : 'yrs';

  return `${yearsOld} ${yearsLabel}`;
};

const formatAge = age => (age === 1 ? '1yr old' : `${age}yrs old`);

const PatientsDetailsSection = ({
  dob,
  gender,
  email,
  phoneHome,
  phoneMobile,
  notes,
}) => (
  <PatientsSidebarSection heading="Patient Details">
    <PatientsSidebarField>
      <div style={{ flex: 0.5 }}>Birthday</div>
      <div
        style={{
          flex: 0.25,
          textAlign: 'right',
        }}
      >
        {dob && (
          <PatientsSidebarValue>
            {formatAge(calculateAgeFromDateOfBirth(dob))}
          </PatientsSidebarValue>
        )}
      </div>
      <div
        style={{
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
        {(gender && <PatientsSidebarValue>{gender}</PatientsSidebarValue>) ||
          '—'}
      </div>
    </PatientsSidebarField>
    <PatientsSidebarField>
      <div>Email</div>
      <div>
        {(email && (
          <PatientsSidebarValue style={{ color: '#0ca1c7' }}>
            <a href={`mailto:${email}`}>{email}</a>
          </PatientsSidebarValue>
        )) ||
          '—'}
      </div>
    </PatientsSidebarField>
    <PatientsSidebarSubsection>
      <PatientsSidebarSubsectionHeading>
        Patient Contact
      </PatientsSidebarSubsectionHeading>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <PatientsSidebarContact>
          <div
            style={{
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
            <PatientsSidebarContactNumber>
              {phoneHome || '—'}
            </PatientsSidebarContactNumber>
            <PatientsSidebarContactCategory>
              Home
            </PatientsSidebarContactCategory>
          </div>
        </PatientsSidebarContact>
        <PatientsSidebarContact>
          <div
            style={{
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
            <PatientsSidebarContactNumber>
              {phoneMobile || '—'}
            </PatientsSidebarContactNumber>
            <PatientsSidebarContactCategory>
              Mobile
            </PatientsSidebarContactCategory>
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
      </div>
    </PatientsSidebarSubsection>
  </PatientsSidebarSection>
);

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

  return (
    <PatientsSidebarContainer>
      <PatientsSidebarHeader>
        <div>{`${firstName || ''} ${lastName || ''} ${mrn || ''}`}</div>
        <PatientsSidebarCloseButton onClick={deselectPatient}>
          ✕
        </PatientsSidebarCloseButton>
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
          )}
        />
        <Flag name={['features', 'showTasksInPatientDrawer']}>
          {taskLists.map(renderTaskList)}
        </Flag>
      </div>
    </PatientsSidebarContainer>
  );
};

export default PatientsSidebar;
