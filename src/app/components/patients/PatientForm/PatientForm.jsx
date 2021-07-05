import React from 'react';
import moment from 'moment';
import { identity } from 'ramda';
import { Grid } from '@material-ui/core';
import { FormContext, useForm } from 'react-hook-form';
import { useDeepCompareEffect } from 'react-use';
import { mixed, object, string } from 'yup';
import {
  onPatientAdded as onPatientAddedEvent,
  onPatientEdited as onPatientEditedEvent,
} from 'helpers/ga-event-helper';
import { showAlert } from 'helpers/utility-functions';
import * as PatientApi from 'api/patient-api';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import FormInput from 'components/common/Input/FormInput';
import FormPhoneNumberInput from 'components/common/PhoneNumberInput/FormPhoneNumberInput';
import DateInput from 'components/common/DateInput/DateInput';
import FormSelect from 'components/common/Select/FormSelect';

const DATE_FORMAT = 'MM/DD/YYYY';

const REQUIRED_MESSAGE = 'This field is required';

const validationObjectShape = {
  firstName: string().required(REQUIRED_MESSAGE),
  middleName: string().nullable(),
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
        newValue?.replace(/[/_-]/g, '')?.length <
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
  uniqueIdentifierLabel,
}) => data => {
  const patientApiMethod = patient
    ? PatientApi.updatePatient({ ...patient, ...data })
    : PatientApi.addPatient(data);

  patientApiMethod
    .then(response => {
      if (patient) {
        onPatientEditedEvent();
        if (typeof onPatientEdited === 'function') {
          onPatientEdited(response);
        }
      } else {
        onPatientAddedEvent();
        if (typeof onPatientCreated === 'function') {
          onPatientCreated(response);
        }
      }
      onCancel();
    })
    .catch(error => {
      if (!patient) {
        showAlert({
          status: 'error',
          title: 'Potential Duplicate',
          text:
            error?.message ??
            `A patient with this name and ${uniqueIdentifierLabel} already exists!`,
          showConfirmButton: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      }
    });
};

const GENDER_OPTIONS = [
  {
    value: 'female',
    label: 'Female',
  },
  {
    value: 'male',
    label: 'Male',
  },
  {
    value: 'other',
    label: 'Other',
  },
];

const PatientForm = ({
  patient = null,
  onPatientCreated,
  onPatientEdited,
  onCancel,
  uniqueIdentifierLabel,
}) => {
  const formMethods = useForm({
    reValidateMode: 'onSubmit',
    validationSchema,
  });

  const { handleSubmit } = formMethods;

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
            uniqueIdentifierLabel,
          }),
        )}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormInput name="firstName" autoFocus required label="First Name" />
          </Grid>
          <Grid item xs={12}>
            <FormInput name="middleName" label="Middle Name" />
          </Grid>
          <Grid item xs={12}>
            <FormInput name="lastName" required label="Last Name" />
          </Grid>
          <Grid item xs={12}>
            <FormInput name="mrn" label={uniqueIdentifierLabel} />
          </Grid>
          <Grid item xs={12}>
            <FormSelect name="gender" label="Gender" options={GENDER_OPTIONS} />
          </Grid>
          <Grid item xs={12}>
            <FormInput
              name="dob"
              label="Birthday"
              placeholder="MM/DD/YYYY"
              inputComponent={DateInput}
            />
          </Grid>
          <Grid item xs={12}>
            <FormInput name="email" label="Email" />
          </Grid>
          <Grid item xs={12}>
            <FormPhoneNumberInput
              name="phoneHome"
              label="Home Phone"
              type="tel"
            />
          </Grid>
          <Grid item xs={12}>
            <FormPhoneNumberInput
              name="phoneMobile"
              label="Mobile Phone"
              type="tel"
            />
          </Grid>
        </Grid>
        <Spacing vertical={4} />
        <Grid container item xs={12}>
          <Grid item xs={6}>
            <Button variant="text" onClick={onCancel}>
              Cancel
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button type="submit">Save</Button>
          </Grid>
        </Grid>
        <Spacing vertical={4} />
      </form>
    </FormContext>
  );
};

export default PatientForm;
