import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import { evolve } from 'ramda';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import MaskedInput from 'react-text-mask';
import styled from 'styled-components';

import {
  abortPatientCreation,
  addPatient,
} from '../../actions/patient-actions';
import { capitalize, capitalizeWords } from '../../helpers/capitalize';
import {
  PatientsSidebarCloseButton,
  PatientsSidebarContainer,
  PatientsSidebarHeader,
} from './PatientsSidebar.Styled';
import PatientsSidebarSection from './PatientsSidebar.Section';
import { onPatientAdded } from '../../helpers/ga-event-helper';

export const StyledTextField = styled(
  ({ InputProps, InputLabelProps, ...rest }) => (
    <TextField
      {...rest}
      variant="filled"
      margin="dense"
      fullWidth
      spellCheck={false}
      InputProps={{
        ...InputProps,
        spellCheck: false,
        disableUnderline: true,
        classes: { root: 'root', disabled: 'disabled' },
      }}
      InputLabelProps={{
        ...InputLabelProps,
        FormLabelClasses: { asterisk: 'asterisk', error: 'error' },
        classes: { shrink: 'shrink' },
      }}
    />
  ),
)`
  && {
    margin-top: 4px;
    margin-bottom: 0;

    input,
    textarea {
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
      color: #da0d71;
    }

    .shrink {
      color: #ababb2;
    }

    .error {
      color: #da0d71;
      background: none;
    }

    label {
      color: #2e3a43;
    }
  }
`;

export const Cancel = styled(Button)`
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

export const Save = styled(Button).attrs({
  variant: 'contained',
  color: 'secondary',
})`
  && {
    display: flex;
    width: 163px;
    height: 38px;
    border-radius: 0;
    background: #da0d71;
    box-shadow: none;
    margin-top: 18px;
    font-size: 16px;
  }
`;

const BirthdayTextMask = ({ inputRef, ...rest }) => (
  <MaskedInput
    {...rest}
    ref={reference => {
      inputRef(reference ? reference.inputElement : null);
    }}
    mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
    placeholderChar={'\u2000'}
    keepCharPositions
  />
);

const PhoneNumberTextMask = ({ inputRef, ...rest }) => (
  <MaskedInput
    {...rest}
    ref={reference => {
      inputRef(reference ? reference.inputElement : null);
    }}
    mask={[
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ]}
    placeholderChar={'\u2000'}
    keepCharPositions
  />
);

export const PatientsForm = ({
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
  onChange,
  onSubmit,
  isDisabled,
  errors,
  hideCollapse,
  isReadOnly,
  cancel,
}) => {
  return (
    <>
      <PatientsSidebarSection
        heading="Patient Details"
        hideCollapse={hideCollapse}
      >
        <Grid container style={{ marginTop: '18px' }} wrap="nowrap">
          <Grid item xs={4}>
            <StyledTextField
              name="firstName"
              value={firstName || ''}
              onChange={onChange}
              required={!isReadOnly}
              label="First Name"
            />
          </Grid>
          <Grid item xs={4} style={{ margin: '0 4px' }}>
            <StyledTextField
              name="middleName"
              value={middleName || ''}
              onChange={onChange}
              label="Middle Name"
            />
          </Grid>
          <Grid item xs={4}>
            <StyledTextField
              name="lastName"
              value={lastName || ''}
              onChange={onChange}
              required={!isReadOnly}
              label="Last Name"
            />
          </Grid>
        </Grid>
        <StyledTextField
          name="mrn"
          value={mrn || ''}
          onChange={onChange}
          label="MRN"
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
        />
        <StyledTextField
          name="gender"
          value={gender || ''}
          onChange={onChange}
          label="Gender"
          select
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
        />
        <StyledTextField
          name="email"
          value={email || ''}
          onChange={onChange}
          label="Email"
          type="email"
          error={errors?.email}
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
          value={notes || ''}
          onChange={onChange}
          label="Notes"
          multiline
          rows={3}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
        >
          {cancel && <Cancel onClick={cancel}>Cancel</Cancel>}
          {!isReadOnly && (
            <Save onClick={onSubmit} disabled={isDisabled}>
              Save
            </Save>
          )}
        </div>
      </PatientsSidebarSection>
    </>
  );
};

const validateBirthday = dob =>
  moment(dob, 'MM/DD/YYYY', true).isBefore(moment());
const validateEmail = email =>
  /^[\w%+-.]+@[\d-.a-z]+\.[a-z]{2,10}$/i.test(email);

const PatientCreation = () => {
  const dispatch = useDispatch();
  const abort = () => {
    dispatch(abortPatientCreation());
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    mrn: '',
    dob: null,
    gender: '',
    phoneHome: '',
    phoneMobile: '',
    email: null,
    notes: '',
  });
  const handleInputChange = useCallback(
    event => {
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
        notes: capitalize,
      });

      setFormState(formatFormState(updatedFormState));
    },
    [formState],
  );

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    await dispatch(addPatient(formState));
    setIsSubmitting(false);
    onPatientAdded();
  }, [dispatch, formState]);

  const canSubmit = () => {
    const { firstName, lastName, dob, email } = formState;
    return (
      firstName &&
      lastName &&
      (!email || validateEmail(email)) &&
      (!dob || validateBirthday(dob))
    );
  };

  return (
    <PatientsSidebarContainer>
      <PatientsSidebarHeader>
        <div>Add a new patient</div>
        <PatientsSidebarCloseButton onClick={abort}>
          ✕
        </PatientsSidebarCloseButton>
      </PatientsSidebarHeader>
      <div>
        <PatientsForm
          {...formState}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          isDisabled={!canSubmit() || isSubmitting}
          errors={{
            dob: formState.dob && !validateBirthday(formState.dob),
            email: formState.email && !validateEmail(formState.email),
          }}
          hideCollapse
        />
      </div>
    </PatientsSidebarContainer>
  );
};

export default PatientCreation;
