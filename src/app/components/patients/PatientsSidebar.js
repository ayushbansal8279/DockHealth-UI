import React, { useCallback } from 'react';
import styled from 'styled-components';
import ButtonBase from '@material-ui/core/ButtonBase';
import { useDispatch } from 'react-redux';
import { highlightPatient } from '../../actions/patient-actions';

const patient = {
  patientId: 11,
  mrn: '14322343',
  firstName: 'Anastasia',
  lastName: 'Blame',
  dob: '2015-08-11',
  gender: 'Female',
  phoneHome: '(917) 722-8899',
  phoneMobile: '(415) 698-0003',
  email: 'anastasia@blame.com',
  creator: null,
  notes: null,
};

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
`;
// 28
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

const PatientsSidebar = () => {
  const {
    mrn, firstName, lastName, dob, gender, phoneHome, phoneMobile, email, notes,
  } = patient;
  const dispatch = useDispatch();
  const deselectPatient = useCallback(() => {
    dispatch(highlightPatient(null));
  }, [dispatch]);

  return (
    <PatientsSidebarContainer>
      <PatientsSidebarHeader>
        <div>{`${firstName} ${lastName} ${mrn}`}</div>
        <PatientsSidebarCloseButton onClick={deselectPatient}>✕</PatientsSidebarCloseButton>
      </PatientsSidebarHeader>
      <PatientsSidebarDetails>
        <PatientsSidebarDetailsHeader>
          <PatientsSidebarDetailsHeading>Patient Details</PatientsSidebarDetailsHeading>
        </PatientsSidebarDetailsHeader>
        <PatientsSidebarField>
          <div>Birthday</div>
          <div>3yrs old</div>
          <div>{dob}</div>
        </PatientsSidebarField>
        <PatientsSidebarField>
          <div>Gender</div>
          <div>{gender}</div>
        </PatientsSidebarField>
        <PatientsSidebarField>
          <div>Email</div>
          <div>{email}</div>
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
                <PatientsSidebarContactNumber>{phoneHome}</PatientsSidebarContactNumber>
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
                <PatientsSidebarContactNumber>{phoneMobile}</PatientsSidebarContactNumber>
                <PatientsSidebarContactCategory>Mobile</PatientsSidebarContactCategory>
              </div>
            </PatientsSidebarContact>
          </div>
        </PatientsSidebarSubsection>
        <PatientsSidebarSubsection>
          <PatientsSidebarSubsectionHeading>Notes</PatientsSidebarSubsectionHeading>
          <div>
            <PatientsSidebarNoteDescription>
              Sean primarily lives with his Grandma in Boston. Her number is 423-321-3241.
              Additional notes can go here. Sean’s Grandma is kind and gentle.
            </PatientsSidebarNoteDescription>
            <PatientsSidebarNoteInfo>
              Michael Docktor | Tuesday, October 2nd
            </PatientsSidebarNoteInfo>
          </div>
        </PatientsSidebarSubsection>
      </PatientsSidebarDetails>
      <PatientsSidebarTaskList>
        <PatientsSidebarDetailsHeader>
          <PatientsSidebarDetailsHeading>Boston Clinic</PatientsSidebarDetailsHeading>
          {/* <div>v</div> */}
        </PatientsSidebarDetailsHeader>
      </PatientsSidebarTaskList>
    </PatientsSidebarContainer>
  );
};

export default PatientsSidebar;
