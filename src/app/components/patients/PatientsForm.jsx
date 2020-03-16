import { Button, Divider, ThemeProvider, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addPatientNote } from '../../actions/patient-actions';
import { onPatientNoteAdded } from '../../helpers/ga-event-helper';
import { noop } from '../../helpers/utility-functions';
import useBoolean from '../../hooks/useBoolean';
import themeMontserrat from '../../theme-montserrat';
import Spacing from '../common/Spacing';
import {
  BirthdayTextMask,
  PanelActionContainer,
  PhoneNumberTextMask,
  StyledSelect,
  StyledTextField,
} from './PatientEdit.Components';
import PatientNotes from './PatientNotes';
import PatientsSidebarSection from './PatientsSidebar.Section';

const PatientsForm = ({
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
  compact = false,
}) => {
  const [isCreating, startCreating, stopCreating] = useBoolean(false);
  const [note, setNote] = useState('');

  const dispatch = useDispatch();

  const handleCancel = useCallback(() => {
    setNote('');
    stopCreating();
  }, [stopCreating]);

  const handleNewNoteSubmit = useCallback(() => {
    addPatientNote(
      patientIdentifier,
      note,
    )(dispatch)
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

  const { spacing, gridSize } = compact
    ? {
        spacing: 0,
        gridSize: 12,
      }
    : {
        spacing: 2,
        gridSize: 6,
      };

  return (
    <>
      <PatientsSidebarSection
        heading="Patient Details"
        hideCollapse={hideCollapse}
      >
        <Grid container spacing={spacing}>
          <Grid item xs={gridSize} container direction="column">
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
          </Grid>
          <Grid item xs={gridSize} container direction="column">
            <StyledTextField
              name="email"
              value={email || ''}
              onChange={onChange}
              label="Email"
              error={errors?.email}
              type="email"
            />
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
              label="Cell Phone"
              type="tel"
              InputProps={{
                inputComponent: PhoneNumberComponent,
              }}
            />
          </Grid>
        </Grid>
        <PanelActionContainer>
          {cancel && (
            <Button variant="text" size="small" onClick={cancel}>
              Cancel
            </Button>
          )}
          {!isReadOnly && (
            <>
              <Spacing horizontal={3} />
              <Button
                variant="contained"
                size="small"
                onClick={handleSaveAndClose}
                disabled={isDisabled || isClean}
              >
                Save
              </Button>
            </>
          )}
        </PanelActionContainer>
        <Spacing vertical={4} />
        <Divider />
        <Spacing vertical={4} />
        <ThemeProvider theme={themeMontserrat}>
          <Typography color="primary" variant="h4">
            Notes
          </Typography>
        </ThemeProvider>
        <Spacing vertical={4} />
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

export default PatientsForm;
