import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import MaskedInput from 'react-text-mask';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { abortPatientCreation, addPatient } from '../../actions/patient-actions';
import {
  PatientsSidebarCloseButton,
  PatientsSidebarContainer,
  PatientsSidebarHeader,
  PatientsSidebarSection,
} from './PatientsSidebar';

const StyledTextField = styled(({ InputProps, InputLabelProps, ...rest }) => (
  <TextField
    {...rest}
    variant="filled"
    margin="dense"
    fullWidth
    InputProps={{
      ...InputProps,
      disableUnderline: true,
      classes: { root: 'root' },
    }}
    InputLabelProps={{
      ...InputLabelProps,
      FormLabelClasses: { asterisk: 'asterisk', focused: 'focused' },
      classes: { shrink: 'shrink' },
    }}
  />
))`
  && {
    margin-top: 4px;
    margin-bottom: 0;
  
    input, textarea {
      height: inherit;
      box-shadow: none;
      color: #2e3a43;
      :focus {
        border: none;
        background: none;
      }
    }
    
    .root {
      background-color: rgba(243, 245, 246, 0.5);
    }
    
    .asterisk {
      color: #DA0D71;
    }
    
    .shrink {
      color: #ABABB2;
    }
    
    label {
      color: #2e3a43;
    }
  }
`;

const Save = styled(Button).attrs({ variant: 'contained', color: 'secondary' })`
  && {
    display: flex;
    width: 163px;
    height: 38px;
    border-radius: 0;
    background: #DA0D71; 
    box-shadow: none;
    margin-left: auto;
    margin-top: 18px;
    font-size: 16px;
  }
`;

const BirthdayTextMask = ({ inputRef, ...rest }) => (
  <MaskedInput
    {...rest}
    ref={(ref) => {
      inputRef(ref ? ref.inputElement : null);
    }}
    placeholder="MM/DD/YYYY"
    mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
    placeholderChar={'\u2000'}
    // guide={false}
    keepCharPositions
  />
);

const PatientCreation = () => {
  const dispatch = useDispatch();
  const abort = () => {
    dispatch(abortPatientCreation());
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({ gender: 'female' });
  const handleInputChange = useCallback((event) => {
    const { target } = event;
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    setFormState({
      ...formState,
      [name]: value,
    });
  }, [formState]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    await dispatch(addPatient(formState));
    setIsSubmitting(false);
  }, [dispatch, formState]);

  const validateBirthday = (dob) => {
    const now = moment();
    const birthday = moment(dob, 'MM/DD/YYYY', true);
    return birthday.isBefore(now);
  };

  const canSubmit = () => {
    const { firstName, lastName, dob } = formState;
    return (firstName && firstName !== '')
      && (lastName && lastName !== '')
      && (!dob || validateBirthday(dob));
  };

  // const error = useSelector(({ patientState }) => patientState.creatingPatientError);
  return (
    <PatientsSidebarContainer>
      <PatientsSidebarHeader>
        <div>Add a new patient</div>
        <PatientsSidebarCloseButton onClick={abort}>✕</PatientsSidebarCloseButton>
      </PatientsSidebarHeader>
      <div>
        <PatientsSidebarSection heading="Patient Details" hideCollapse>
          <StyledTextField
            name="mrn"
            value={formState.mrn}
            onChange={handleInputChange}
            label="MRN"
            style={{ marginTop: '18px' }}
          />
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1, marginRight: '4px' }}>
              <StyledTextField
                name="firstName"
                value={formState.firstName}
                onChange={handleInputChange}
                required
                label="First Name"
              />
            </div>
            {/* <div style={{ margin: '0 4px' }}> */}
            {/*  <StyledTextField */}
            {/*    name="middleName" */}
            {/*    value={formState.middleName} */}
            {/*    label="Middle Name" */}
            {/*  /> */}
            {/* </div> */}
            <div style={{ flex: 1 }}>
              <StyledTextField
                name="lastName"
                value={formState.lastName}
                onChange={handleInputChange}
                required
                label="Last Name"
              />
            </div>
          </div>
          <StyledTextField
            name="dob"
            value={formState.dob}
            onChange={handleInputChange}
            label="Birthday"
            InputProps={{
              inputComponent: BirthdayTextMask,
            }}
          />
          <StyledTextField
            name="gender"
            value={formState.gender}
            onChange={handleInputChange}
            label="Gender"
            select
            InputLabelProps={{
              shrink: true,
            }}
          >
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="male">Male</MenuItem>
          </StyledTextField>
          <StyledTextField
            name="phoneHome"
            value={formState.phoneHome}
            onChange={handleInputChange}
            label="Home Phone"
            type="tel"
          />
          <StyledTextField
            name="phoneMobile"
            value={formState.phoneMobile}
            onChange={handleInputChange}
            label="Mobile Phone"
            type="tel"
          />
          <StyledTextField
            name="email"
            value={formState.email}
            onChange={handleInputChange}
            label="Email"
            type="email"
          />
        </PatientsSidebarSection>
        <PatientsSidebarSection
          hideCollapse
          style={{
            marginTop: 0,
            borderTop: 'none',
          }}
        >
          <StyledTextField
            name="notes"
            value={formState.notes}
            onChange={handleInputChange}
            label="Notes"
            multiline
            rows={3}
          />
          {/* {error && (error?.statusMessage || 'Error.')} */}
          <Save onClick={handleSubmit} disabled={!canSubmit() || isSubmitting}>Save</Save>
        </PatientsSidebarSection>
      </div>
    </PatientsSidebarContainer>
  );
};

export default PatientCreation;
