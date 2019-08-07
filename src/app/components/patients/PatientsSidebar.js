import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import ButtonBase from '@material-ui/core/ButtonBase';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { highlightPatient } from '../../actions/patient-actions';
import PatientsTasklist from './PatientsTasklist';

const PatientsSidebarContainer = styled.div`
  width: 632px;
  flex-shrink: 0;
  padding: 4px;
`;

const PatientsSidebarHeader = styled.div`
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

const PatientsSidebarSection = styled.div`
  border: solid 2px #ddf2f7;
  background: #fff;
  padding: 18px 27px 27px 24px;
`;

const PatientsSidebarDetailsHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const PatientsSidebarDetailsHeading = styled.div`
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

const PatientsSidebarDetails = styled(PatientsSidebarSection)``;

const PatientsSidebarTaskList = styled(PatientsSidebarSection)`
  margin-top: 4px;
`;

const PatientsSidebarSubsection = styled.div`
  border-top: solid 1px #a6dcea;
  margin-top: 22px;
  
  margin-left: -11px;
  margin-right: -11px;
  padding-left: 11px;
  padding-right: 11px;
`;

const PatientsSidebarSubsectionHeading = styled.div`
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

const PatientsSidebarCloseButton = styled(ButtonBase)`
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

const calculateAgeFromDateOfBirth = dob => dob && moment().diff(dob, 'years');
const formatAge = age => (age === 1 ? '1yr old' : `${age}yrs old`);

const PatientsSidebar = ({ patient }) => {
  const {
    mrn, firstName, lastName, dob, gender, phoneHome, phoneMobile, email, notes,
  } = patient;
  const dispatch = useDispatch();
  const deselectPatient = useCallback(() => {
    dispatch(highlightPatient(null));
  }, [dispatch]);

  useEffect(() => () => {
    deselectPatient();
  }, [deselectPatient]);

  return (
    <PatientsSidebarContainer>
      <PatientsSidebarHeader>
        <div>{`${firstName || ''} ${lastName || ''} ${mrn}`}</div>
        <PatientsSidebarCloseButton onClick={deselectPatient}>✕</PatientsSidebarCloseButton>
      </PatientsSidebarHeader>
      <PatientsSidebarDetails>
        <PatientsSidebarDetailsHeader>
          <PatientsSidebarDetailsHeading>Patient Details</PatientsSidebarDetailsHeading>
        </PatientsSidebarDetailsHeader>
        <PatientsSidebarField>
          <div style={{ flex: 0.5 }}>Birthday</div>
          <div style={{ flex: 0.25, textAlign: 'right' }}>{dob && formatAge(calculateAgeFromDateOfBirth(dob))}</div>
          <div style={{ flex: 0.25, textAlign: 'right' }}>{dob || '—'}</div>
        </PatientsSidebarField>
        <PatientsSidebarField>
          <div>Gender</div>
          <div>{gender || '—'}</div>
        </PatientsSidebarField>
        <PatientsSidebarField>
          <div>Email</div>
          <div>{email || '—'}</div>
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
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: '#00a73c',
              }}
              />
              <div style={{ marginLeft: '15px' }}>
                <PatientsSidebarContactNumber>{phoneHome || '—'}</PatientsSidebarContactNumber>
                <PatientsSidebarContactCategory>Home</PatientsSidebarContactCategory>
              </div>
            </PatientsSidebarContact>
            <PatientsSidebarContact>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: '#05adec',
              }}
              />
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
            {/* <PatientsSidebarNoteInfo> */}
            {/*  Michael Docktor | Tuesday, October 2nd */}
            {/* </PatientsSidebarNoteInfo> */}
          </div>
        </PatientsSidebarSubsection>
      </PatientsSidebarDetails>
      <PatientsSidebarTaskList>
        <PatientsSidebarDetailsHeader>
          <PatientsSidebarDetailsHeading>Boston Clinic</PatientsSidebarDetailsHeading>
        </PatientsSidebarDetailsHeader>
        <PatientsTasklist />
      </PatientsSidebarTaskList>
    </PatientsSidebarContainer>
  );
};

export default PatientsSidebar;
