import { Button, Divider, Grid, MenuItem, Select } from '@material-ui/core';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import useBoolean from 'hooks/useBoolean';
import Spacing from '../common/Spacing';
import {
  UniversalBirthdayInputComponent,
  UniversalMobileInputComponent,
} from '../common/UniversalInput/UniversalInput';
import {
  PanelActionContainer,
  PatientInput,
  SingleFormPanelContainer,
  SmallPatientInput,
} from './PatientsForm.Styled';
import PatientsSidebarSection from './PatientsSidebar.Section';

const PatientsForm = ({ onSubmit, compact = false, onCancel }) => {
  const [
    isGenderSelectOpen,
    setGenderSelectOpen,
    unsetGenderSelectOpen,
  ] = useBoolean(false);

  const { handleSubmit, watch, setValue } = useFormContext();

  const genderValue = watch('gender') ?? '';

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
              <NameInput
                name="firstName"
                autoFocus
                required
                label="First Name"
              />
              <NameInput name="middleName" label="Middle Name" />
              <NameInput name="lastName" required label="Last Name" />
              <PatientInput name="mrn" label="MRN" />
              <Select
                onOpen={setGenderSelectOpen}
                onClose={unsetGenderSelectOpen}
                onChange={event => setValue('gender', event?.target?.value)}
                variant="standard"
                value={genderValue}
                input={
                  <PatientInput
                    customShrinkCondition={isGenderSelectOpen || genderValue}
                    name="gender"
                    label="Gender"
                  />
                }
              >
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
              <PatientInput
                name="dob"
                label="Birthday"
                placeholder="MM/DD/YYYY"
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
          <Button variant="text" size="small" onClick={onCancel}>
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
      </PatientsSidebarSection>
    </form>
  );
};

export default PatientsForm;
