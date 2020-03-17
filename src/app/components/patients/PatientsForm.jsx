import { Button, Divider, ThemeProvider, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { addPatientNote } from '../../actions/patient-actions';
import { onPatientNoteAdded } from '../../helpers/ga-event-helper';
import useBoolean from '../../hooks/useBoolean';
import themeMontserrat from '../../theme-montserrat';
import Spacing from '../common/Spacing';
import {
  UniversalBirthdayInputComponent,
  UniversalMobileInputComponent,
} from '../userProfileView/UniversalStyledInput';
import PatientNotes from './PatientNotes';
import {
  PanelActionContainer,
  PatientInput,
  SingleFormPanelContainer,
  SmallPatientInput,
} from './PatientsForm.Styled';
import PatientsSidebarSection from './PatientsSidebar.Section';

const PatientsForm = ({ onSubmit, patient, resetPatient, compact = false }) => {
  const [isCreating, startCreating, stopCreating] = useBoolean(false);
  const [note, setNote] = useState('');

  const dispatch = useDispatch();

  const { handleSubmit, watch } = useFormContext();

  const patientIdentifier = watch('patientIdentifier');

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

  useEffect(() => {
    handleCancel();
  }, [handleCancel, patientIdentifier]);

  const { spacing, gridSize, NameInput } = compact
    ? {
        spacing: 1,
        gridSize: 12,
        NameInput: PatientInput,
      }
    : {
        spacing: 2,
        gridSize: 6,
        NameInput: SmallPatientInput,
      };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PatientsSidebarSection heading="Patient Details">
        <Grid container spacing={spacing}>
          <Grid item xs={gridSize}>
            <SingleFormPanelContainer>
              <NameInput name="firstName" required label="First Name" />
              <NameInput name="middleName" label="Middle Name" />
              <NameInput name="lastName" required label="Last Name" />
              <PatientInput name="mrn" label="MRN" />
              <PatientInput
                name="gender"
                label="Gender"
                CustomComponent="select"
              >
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </PatientInput>
              <PatientInput
                name="dob"
                label="Birthday"
                CustomComponent={UniversalBirthdayInputComponent}
              />
            </SingleFormPanelContainer>
          </Grid>
          <Grid item xs={gridSize}>
            <SingleFormPanelContainer>
              <PatientInput name="email" label="Email" />
              <PatientInput
                name="phoneHome"
                label="Home Phone"
                type="tel"
                CustomComponent={UniversalMobileInputComponent}
              />
              <PatientInput
                name="phoneMobile"
                label="Cell Phone"
                type="tel"
                CustomComponent={UniversalMobileInputComponent}
              />
            </SingleFormPanelContainer>
          </Grid>
        </Grid>
        <PanelActionContainer>
          <Button variant="text" size="small" onClick={resetPatient}>
            Cancel
          </Button>
          <Spacing horizontal={3} />
          <Button variant="contained" size="small" type="submit">
            Save
          </Button>
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
          notes={patient?.allNotes ?? []}
          patientIdentifier={patientIdentifier}
          note={note}
          setNote={setNote}
          isCreating={isCreating}
          handleCancel={handleCancel}
          handleSubmit={handleNewNoteSubmit}
          startCreating={startCreating}
        />
      </PatientsSidebarSection>
    </form>
  );
};

export default PatientsForm;
