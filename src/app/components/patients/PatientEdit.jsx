import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import moment from 'moment';
import { equals, evolve } from 'ramda';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useDeepCompareEffect } from 'react-use';
import Button from '@material-ui/core/Button';
import { addPatientNote, updatePatient } from '../../actions/patient-actions';
import { capitalizeWords } from '../../helpers/capitalize';
import {
  onPatientEdited,
  onPatientNoteAdded,
} from '../../helpers/ga-event-helper';
import { noop } from '../../helpers/utility-functions';
import useBoolean from '../../hooks/useBoolean';
import {
  BirthdayTextMask,
  Cancel,
  PhoneNumberTextMask,
  StyledSelect,
  StyledTextField,
} from './PatientEdit.Components';
import PatientNotes from './PatientNotes';
import PatientsSidebarSection from './PatientsSidebar.Section';

const DATE_FORMAT = 'MM/DD/YYYY';

export const PatientsForm = ({
  patientIdentifier,
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
  const [isCreating, startCreating, stopCreating] = useBoolean(false);
  const [note, setNote] = useState('');

  const dispatch = useDispatch();

  const handleCancel = useCallback(() => {
    setNote('');
    stopCreating();
  }, [stopCreating]);

  const handleNewNoteSubmit = useCallback(() => {
    addPatientNote(patientIdentifier, note)(dispatch)
      .then(newNote => {
        handleCancel();
        onPatientNoteAdded();
        toggleAlert('Note added successfully', 'success');
        return newNote;
      })
      .catch(() => {
        toggleAlert('Error adding note. Please try again.', 'error');
      });
  }, [dispatch, handleCancel, note, patientIdentifier]);

  const handleSaveAndClose = useCallback(() => {
    onSubmit()
      .then(() => {
        handleNewNoteSubmit();
      })
      .catch(noop);
  }, [handleNewNoteSubmit, onSubmit]);

  useEffect(() => {
    handleCancel();
  }, [handleCancel, patientIdentifier]);

  const {
    BirthdayInputComponent,
    GenderInputComponent,
    PhoneNumberComponent,
  } = isReadOnly
    ? {}
    : {
        BirthdayInputComponent: BirthdayTextMask,
        GenderInputComponent: 'select',
        PhoneNumberComponent: PhoneNumberTextMask,
      };

  return (
    <>
      <PatientsSidebarSection
        heading="Patient Details"
        hideCollapse={hideCollapse}
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
                error={errors?.firstName}
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
                error={errors?.lastName}
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
              inputComponent: BirthdayInputComponent,
            }}
          />
          <StyledSelect
            name="gender"
            value={gender || ''}
            onChange={onChange}
            label="Gender"
            InputProps={{
              inputComponent: GenderInputComponent,
            }}
          >
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </StyledSelect>
        </div>
        <div>
          <StyledTextField
            name="phoneHome"
            value={phoneHome || ''}
            onChange={onChange}
            label="Home Phone"
            type="tel"
            InputProps={{
              inputComponent: PhoneNumberComponent,
            }}
          />
          <StyledTextField
            name="phoneMobile"
            value={phoneMobile || ''}
            onChange={onChange}
            label="Mobile Phone"
            type="tel"
            InputProps={{
              inputComponent: PhoneNumberComponent,
            }}
          />
          <StyledTextField
            name="email"
            value={email || ''}
            onChange={onChange}
            label="Email"
            error={errors?.email}
            type="email"
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            margin: '0.5rem 0',
          }}
        >
          {cancel && <Cancel onClick={cancel}>Cancel</Cancel>}
          {!isReadOnly && (
            <Button
              variant="contained"
              onClick={handleSaveAndClose}
              disabled={isDisabled || isClean}
            >
              Save
            </Button>
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
        <PatientNotes
          notes={allNotes}
          patientIdentifier={patientIdentifier}
          note={note}
          setNote={setNote}
          isCreating={isCreating}
          handleCancel={handleCancel}
          handleSubmit={handleNewNoteSubmit}
          startCreating={startCreating}
        />
      </PatientsSidebarSection>
    </>
  );
};

const validateBirthday = dob =>
  moment(dob, DATE_FORMAT, true).isBefore(moment());

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
  const formattedPatient = {
    ...patient,
    dob: patient.dob && moment(patient.dob).format(DATE_FORMAT),
  };

  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState(formattedPatient);

  useDeepCompareEffect(() => {
    setFormState(formattedPatient);
  }, [formattedPatient]);

  const isClean = equals(formState, formattedPatient);

  const handleInputChange = useCallback(
    handleChangeEvent({ formState, setFormState }),
    [formState],
  );

  const handleSubmit = useCallback(() => {
    setIsSubmitting(true);

    return updatePatient(formState)(dispatch)
      .then(() => {
        setIsSubmitting(false);
        onPatientEdited();
      })
      .catch(() => {
        setIsSubmitting(false);
      });
  }, [dispatch, formState]);

  const clear = () => {
    setFormState(formattedPatient);
  };

  const errors = {
    dob: (() => {
      if (
        formState.dob &&
        !moment(formState.dob, DATE_FORMAT, true).isValid()
      ) {
        return 'Birthday is invalid';
      }

      if (formState.dob && !validateBirthday(formState.dob)) {
        return 'Birthday should not be set in the future';
      }

      return false;
    })(),
    email:
      Boolean(formState.email && !validateEmail(formState.email)) &&
      'Email is invalid',
    firstName: !formState.firstName && 'First name is required',
    lastName: !formState.lastName && 'Last name is required',
  };

  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <PatientsForm
      {...formState}
      onChange={handleInputChange}
      onSubmit={hasErrors ? undefined : handleSubmit}
      isDisabled={isSubmitting}
      errors={errors}
      isReadOnly={false}
      isClean={isClean}
      cancel={isClean ? undefined : clear}
    />
  );
};

export default PatientEdit;
