import moment from 'moment';
import { equals, evolve } from 'ramda';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useDeepCompareEffect } from 'react-use';
import { updatePatient } from '../../actions/patient-actions';
import { capitalizeWords } from '../../helpers/capitalize';
import { onPatientEdited } from '../../helpers/ga-event-helper';
import PatientsForm from './PatientsForm';

const DATE_FORMAT = 'MM/DD/YYYY';

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

const PatientEdit = ({ compact = false, patient }) => {
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
      compact={compact}
    />
  );
};

export default PatientEdit;
