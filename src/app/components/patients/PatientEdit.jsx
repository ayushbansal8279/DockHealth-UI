import moment from 'moment';
import { identity } from 'ramda';
import React, { useCallback } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useDeepCompareEffect, useEffectOnce } from 'react-use';
import { mixed, object, string } from 'yup';
import { addPatient, updatePatient } from 'actions/patient-actions';
import { onPatientEdited } from 'helpers/ga-event-helper';
import { showAlert } from 'helpers/utility-functions';
import PatientsForm from './PatientsForm';

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
  phoneHome: string(),
  phoneMobile: string(),
};

const validationSchema = object().shape(validationObjectShape);

const PatientEdit = ({ compact = false, patient }) => {
  const formMethods = useForm({
    reValidateMode: 'onSubmit',
    validationSchema,
  });

  useEffectOnce(() => {
    formMethods.register({ name: 'gender' });
    return () => {
      formMethods.unregister({ name: 'gender' });
    };
  });

  const dispatch = useDispatch();

  const onSubmit = useCallback(
    data => {
      const patientAction = patient
        ? updatePatient({ ...patient, ...data })
        : addPatient(data);

      patientAction(dispatch)
        .then(() => {
          onPatientEdited();
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
    },
    [dispatch, patient],
  );

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
      <PatientsForm onSubmit={onSubmit} compact={compact} patient={patient} />
    </FormContext>
  );
};

export default PatientEdit;
