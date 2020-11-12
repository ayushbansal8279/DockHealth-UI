import React from 'react';
import moment from 'moment';
import { identity } from 'ramda';
import { Button, Divider, Grid, MenuItem, Select } from '@material-ui/core';
import { FormContext, useForm } from 'react-hook-form';
import { useDeepCompareEffect, useEffectOnce } from 'react-use';
import { mixed, object, string } from 'yup';
import { onPatientEdited as onPatientEditedEvent } from 'helpers/ga-event-helper';
import { showAlert } from 'helpers/utility-functions';
import * as PatientApi from 'api/patient-api';
import useBoolean from 'hooks/useBoolean';
import Spacing from 'components/common/Spacing';
import {
  UniversalBirthdayInputComponent,
  UniversalMobileInputComponent,
} from 'components/common/UniversalInput/UniversalInput';
import {
  PanelActionContainer,
  PatientInput,
  SingleFormPanelContainer,
  SmallPatientInput,
} from './styled';

const DATE_FORMAT = 'MM/DD/YYYY';

const REQUIRED_MESSAGE = 'This field is required';

const validationObjectShape = {
  firstName: string().required(REQUIRED_MESSAGE),
  middleName: string(),
  lastName: string().required(REQUIRED_MESSAGE),
  mrn: string(),
  gender: string().nullable(),
  dob: mixed()
    .nullable()
    .transform(newValue => {
      const dobMoment = moment(newValue, DATE_FORMAT);

      if (!newValue) {
        return null;
      }

      if (
        newValue?.replace(/[-/_]/g, '')?.length <
        DATE_FORMAT.replace(/\//g, '').length
      ) {
        return new Error();
      }

      if (dobMoment.isValid()) {
        return newValue;
      }

      return new Error();
    })
    .test(
      'validDate',
      `This field requires date in ${DATE_FORMAT} format`,
      function validDate(value) {
        if (value instanceof Error) {
          this.createError();
          return false;
        }

        return true;
      },
    ),
  email: string()
    .nullable()
    .transform(value => (!value ? null : value))
    .email('This field requires a valid email address'),
  phoneHome: string().nullable(),
  phoneMobile: string().nullable(),
};

const validationSchema = object().shape(validationObjectShape);

const onSubmit = ({
  patient,
  onCancel,
  onPatientCreated,
  onPatientEdited,
}) => data => {
  const patientApiMethod = patient
    ? PatientApi.updatePatient({ ...patient, ...data })
    : PatientApi.addPatient(data);

  patientApiMethod
    .then(response => {
      if (patient && typeof onPatientEdited === 'function') {
        onPatientEdited(response);
        onPatientEditedEvent();
      } else if (typeof onPatientEdited === 'function') {
        onPatientCreated(response);
      }
      onCancel();
    })
    .catch(error => {
      if (!patient) {
        showAlert({
          status: 'error',
          title: 'Potential Duplicate Patient',
          text:
            error?.message ??
            'A patient with this name and MRN already exists!',
          showConfirmButton: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      }
    });
};

const PatientForm = ({
  compact = false,
  patient = null,
  onPatientCreated,
  onPatientEdited,
  onCancel,
}) => {
  const formMethods = useForm({
    reValidateMode: 'onSubmit',
    validationSchema,
  });

  const { handleSubmit, watch, setValue } = formMethods;

  const [
    isGenderSelectOpen,
    setGenderSelectOpen,
    unsetGenderSelectOpen,
  ] = useBoolean(false);

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

  useEffectOnce(() => {
    formMethods.register({ name: 'gender' });
    return () => {
      formMethods.unregister({ name: 'gender' });
    };
  });

  useDeepCompareEffect(() => {
    Object.keys(validationObjectShape).forEach(key => {
      let formatFunction = identity;

      if (key === 'dob') {
        formatFunction = value =>
          value ? moment(value).format('MM/DD/YYYY') : '';
      }

      formMethods.setValue(key, formatFunction(patient?.[key] ?? null));
    });
  }, [patient]);

  return (
    <FormContext {...formMethods}>
      <form
        onSubmit={handleSubmit(
          onSubmit({
            patient,
            onCancel,
            onPatientCreated,
            onPatientEdited,
          }),
        )}
      >
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
      </form>
    </FormContext>
  );
};

export default PatientForm;
