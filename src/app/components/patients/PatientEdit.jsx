import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import { equals, evolve } from 'ramda';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import MaskedInput from 'react-text-mask';
import styled from 'styled-components';

import { updatePatient } from '../../actions/patient-actions';
import { capitalizeWords } from '../../helpers/capitalize';
import PatientNotes from './PatientNotes';
import PatientsSidebarSection from './PatientsSidebar.Section';

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
      spellCheck: false,
      classes: {
        root: 'root',
        disabled: 'disabled',
      },
    }}
    InputLabelProps={{
      ...InputLabelProps,
      FormLabelClasses: {
        asterisk: 'asterisk',
        error: 'error',
      },
      classes: { shrink: 'shrink' },
    }}
  />
))`
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

const Save = styled(Button).attrs({
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
  allNotes,
  onChange,
  onSubmit,
  isDisabled,
  errors,
  hideCollapse,
  isReadOnly,
  isClean,
  cancel,
}) => {
  return (
    <>
      <PatientsSidebarSection
        heading="Patient Details"
        hideCollapse={hideCollapse}
      >
        <div
          style={{
            columnCount: 2,
            columnWidth: '500px',
            paddingTop: '14px',
          }}
        >
          <div>
            <Grid container wrap="nowrap">
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
              error={Boolean(errors?.dob)}
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
          </div>
          <div>
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
              error={Boolean(errors?.email)}
              type="email"
            />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
        >
          {cancel && <Cancel onClick={cancel}>Cancel</Cancel>}
          {!isReadOnly && (
            <Save onClick={onSubmit} disabled={isDisabled || isClean}>
              Save
            </Save>
          )}
        </div>
      </PatientsSidebarSection>
      <PatientsSidebarSection
        heading="Notes"
        style={{
          marginTop: 0,
          borderTop: 'none',
        }}
        headingStyle={{
          fontSize: '16px',
          lineHeigth: '16px',
        }}
      >
        <PatientNotes notes={allNotes} patientId={patientId} />
      </PatientsSidebarSection>
    </>
  );
};

const validateBirthday = dob =>
  moment(dob, 'MM/DD/YYYY', true).isBefore(moment());
const validateEmail = email =>
  /^[\w%+-.]+@[\d-.a-z]+\.[a-z]{2,10}$/i.test(email);

const handleChangeEvent = ({ formState, setFormState }) => event => {
  const { target } = event;
  const { name } = target;
  const value = target.type === 'checkbox' ? target.checked : target.value;

  let updatedFormState = {
    ...formState,
    [name]: value,
  };

  const formatFirstNameState = evolve({
    firstName: capitalizeWords,
  });
  const formatMiddleNameState = evolve({
    middleName: capitalizeWords,
  });
  const formatLastNameState = evolve({
    lastName: capitalizeWords,
  });

  if (updatedFormState.firstName) {
    updatedFormState = formatFirstNameState(updatedFormState);
  }
  if (updatedFormState.middleName) {
    updatedFormState = formatMiddleNameState(updatedFormState);
  }
  if (updatedFormState.lastName) {
    updatedFormState = formatLastNameState(updatedFormState);
  }

  setFormState(updatedFormState);
};

const PatientEdit = ({ patient }) => {
  const formattedPatient = useMemo(
    () => ({
      ...patient,
      dob: patient.dob && moment(patient.dob).format('MM/DD/YYYY'),
    }),
    [patient],
  );

  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState(formattedPatient);

  useEffect(() => {
    setFormState(formattedPatient);
  }, [formattedPatient]);

  const isClean = equals(formState, formattedPatient);

  const handleInputChange = useCallback(
    handleChangeEvent({ formState, setFormState }),
    [formState],
  );

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    await dispatch(updatePatient(formState));
    setIsSubmitting(false);
  }, [dispatch, formState]);

  const canSubmit = () => {
    const { firstName, lastName, dob, email } = formState;
    return (
      firstName &&
      firstName !== '' &&
      (lastName && lastName !== '') &&
      (!dob || dob === '' || validateBirthday(dob)) &&
      (!email || email === '' || validateEmail(email))
    );
  };

  const clear = () => {
    setFormState(formattedPatient);
  };

  return (
    <PatientsForm
      {...formState}
      onChange={handleInputChange}
      onSubmit={handleSubmit}
      isDisabled={!canSubmit() || isSubmitting}
      errors={
        isClean
          ? {}
          : {
              dob: formState.dob && !validateBirthday(formState.dob),
              email: formState.email && !validateEmail(formState.email),
            }
      }
      isReadOnly={false}
      isClean={isClean}
      cancel={isClean ? undefined : clear}
    />
  );
};

export default PatientEdit;
