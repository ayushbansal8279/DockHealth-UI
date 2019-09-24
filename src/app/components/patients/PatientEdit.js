import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import MaskedInput from 'react-text-mask';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { abortPatientCreation, addPatient, updatePatient } from '../../actions/patient-actions';
import {
  PatientsSidebarCloseButton,
  PatientsSidebarContainer,
  PatientsSidebarHeader,
  PatientsSidebarSection,
} from './PatientsSidebar';
import PatientNotes from './PatientNotes';
import { equals, evolve } from 'ramda';
import { capitalize, capitalizeWords } from '../../helpers/capitalize';

const StyledTextField = styled(({ InputProps, InputLabelProps, ...rest }) => (
  <TextField
    {...rest}
    variant="filled"
    margin="dense"
    fullWidth
    autoComplete="no"
    InputProps={{
      ...InputProps,
      disableUnderline: true,
      classes: { root: 'root', disabled: 'disabled' },
    }}
    InputLabelProps={{
      ...InputLabelProps,
      FormLabelClasses: { asterisk: 'asterisk', error: 'error' },
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
      :disabled {
        background: none;
        cursor: default;
      }
    }
    
    .root {
      background-color: rgba(243, 245, 246, 0.5);
    }
    
    .disabled {
      color: #2e3a43;
    }
    
    .asterisk {
      color: #DA0D71;
    }
    
    .shrink {
      color: #ABABB2;
    }
    
    .error {
      color: #DA0D71;
      background: none;
    }
    
    label {
      color: #2e3a43;
    }
  }
`;

const Cancel = styled(Button)`
  && {
    display: flex;
    width: 108px;
    height: 38px;
    border-radius: 0;
    font-size: 16px;
    margin-right: 4px;
    margin-top: 18px;
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

const PhoneNumberTextMask = ({ inputRef, ...rest }) => (
  <MaskedInput
    {...rest}
    ref={(ref) => {
      inputRef(ref ? ref.inputElement : null);
    }}
    placeholder="123-123-1234"
    mask={[/\d/, /\d/, /\d/,'-', /\d/, /\d/, /\d/,'-', /\d/, /\d/, /\d/, /\d/]}
    placeholderChar={'\u2000'}
    keepCharPositions
  />
);

export const PatientsForm = ({
                               patientId, mrn, firstName, middleName, lastName, dob, gender, phoneHome, phoneMobile, email, notes, allNotes, onChange, onSubmit, isDisabled, errors, hideCollapse, isReadOnly, isClean, cancel,
                             }) => {
  const readOnlyProps = placeholder => ({
    InputLabelProps: { shrink: isReadOnly || undefined },
    // disabled: isReadOnly,
    placeholder: isReadOnly ? undefined : placeholder,
  });

  return (
    <>
      <PatientsSidebarSection heading="Patient Details" hideCollapse={hideCollapse}>
        <div style={{ display: 'flex', marginTop: '18px' }}>
          <div style={{
            flex: 1,
          }}
          >
            <StyledTextField
              name="firstName"
              value={firstName || ''}
              onChange={onChange}
              required={!isReadOnly}
              label="First Name"
              {...readOnlyProps('Sam')}
            />
          </div>
          <div style={{ margin: '0 4px' }}>
            <StyledTextField
              name="middleName"
              value={middleName || ''}
              onChange={onChange}
              label="Middle Name"
              {...readOnlyProps('Max')}
            />
          </div>
          <div style={{ flex: 1 }}>
            <StyledTextField
              name="lastName"
              value={lastName || ''}
              onChange={onChange}
              required={!isReadOnly}
              label="Last Name"
              {...readOnlyProps('Nelson')}
            />
          </div>
        </div>
        <StyledTextField
          name="mrn"
          value={mrn || ''}
          onChange={onChange}
          label="MRN"
          {...readOnlyProps('123-123-23444')}
        />
        <StyledTextField
          name="dob"
          value={dob || ''}
          onChange={onChange}
          label="Birthday"
          error={errors?.dob}
          InputProps={{
            inputComponent: isReadOnly ? undefined : BirthdayTextMask,
          }}
          {...readOnlyProps()}
        />
        <StyledTextField
          name="gender"
          value={gender || ''}
          onChange={onChange}
          label="Gender"
          select
          {...readOnlyProps()}
        >
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </StyledTextField>
        <StyledTextField
          name="phoneHome"
          value={phoneHome || ''}
          onChange={onChange}
          label="Home Phone"
          type="tel"
          InputProps={{
            inputComponent: isReadOnly ? undefined : PhoneNumberTextMask,
          }}
          {...readOnlyProps('234-234-2333')}
        />
        <StyledTextField
          name="phoneMobile"
          value={phoneMobile || ''}
          onChange={onChange}
          label="Mobile Phone"
          type="tel"
          InputProps={{
            inputComponent: isReadOnly ? undefined : PhoneNumberTextMask,
          }}
          {...readOnlyProps('456-456-4444')}
        />
        <StyledTextField
          name="email"
          value={email || ''}
          onChange={onChange}
          label="Email"
          type="email"
          {...readOnlyProps('name@email.com')}
        />
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
          {cancel && <Cancel onClick={cancel}>Cancel</Cancel>}
          {!isReadOnly && <Save onClick={onSubmit} disabled={isDisabled}>Save</Save>}
        </div>
      </PatientsSidebarSection>
      <PatientsSidebarSection
        // heading="Notes"
        hideCollapse
        style={{
          marginTop: 0,
          borderTop: 'none',
        }}
      >
        <PatientNotes notes={allNotes} patientId={patientId} />
      </PatientsSidebarSection>
    </>
  );
};

const PatientEdit = ({ patient }) => {
  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState(patient);

  useEffect(() => {
    setFormState(patient);
  }, [patient]);

  const isClean = equals(formState, patient);

  const handleInputChange = useCallback((event) => {
    const { target } = event;
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    const updatedFormState = {
      ...formState,
      [name]: value,
    };

    const formatFormState = evolve({
      firstName: capitalizeWords,
      middleName: capitalizeWords,
      lastName: capitalizeWords,
    });

    setFormState(formatFormState(updatedFormState));
  }, [formState]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    await dispatch(updatePatient(formState));
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

  const clear = () => {
    setFormState(patient);
  };

  return (
    <PatientsForm
      {...formState}
      onChange={handleInputChange}
      onSubmit={handleSubmit}
      isDisabled={!canSubmit() || isSubmitting}
      errors={isClean ? {} : {
        dob: formState.dob && !validateBirthday(formState.dob),
      }}
      isReadOnly={isClean}
      cancel={isClean ? undefined : clear}
    />
  );
};


export default PatientEdit;
