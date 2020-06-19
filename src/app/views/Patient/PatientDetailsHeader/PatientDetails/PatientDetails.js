/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Collapse } from '@material-ui/core';
import PatientDetailsInput from './PatientDetailsInput';
import {
  PatientDetailsForm,
  PatientDetailsFormRow,
  PatientDetailsButton,
  PatientDetailsCancelButton,
  PatietnDetailsFormFooter,
} from './styled';

const validator = errors => {
  let newErrors = {};
  Object.keys(errors).forEach(key => {
    if (errors[key]?.type === 'required') {
      newErrors = {
        ...newErrors,
        [key]: 'This field is required',
      };
    }
  });

  return newErrors;
};

const PatientDetails = ({
  firstName,
  middleName,
  lastName,
  email,
  phoneMobile,
  phoneHome,
  dob,
  gender,
  mrn,
  isOpenedDetails,
  updatePatient,
  patientIdentifier,
}) => {
  const defaultValues = {
    firstName,
    middleName,
    lastName,
    email,
    phoneMobile,
    phoneHome,
    dob,
    gender,
    mrn,
  };
  const [isActive, setIsActive] = useState(false);
  const {
    register,
    setValue,
    getValues,
    control,
    handleSubmit,
    errors,
    clearError,
  } = useForm({
    defaultValues,
  });

  const errorMessages = validator(errors);

  const { gender: genderValue } = getValues();

  useEffect(() => {
    setValue('firstName', firstName);
    setValue('middleName', middleName);
    setValue('lastName', lastName);
    setValue('email', email);
    setValue('phoneMobile', phoneMobile);
    setValue('phoneHome', phoneHome);
    setValue('dob', dob);
    setValue('gender', gender);
    setValue('mrn', mrn);
  }, [
    firstName,
    middleName,
    lastName,
    email,
    phoneMobile,
    phoneHome,
    dob,
    gender,
    mrn,
    setValue,
  ]);

  useEffect(() => {
    if (!isOpenedDetails) {
      setIsActive(false);
    }
  }, [isOpenedDetails]);

  useEffect(() => {
    if (!isActive) {
      setValue('firstName', defaultValues.firstName);
      setValue('middleName', defaultValues.middleName);
      setValue('lastName', defaultValues.lastName);
      setValue('email', defaultValues.email);
      setValue('phoneMobile', defaultValues.phoneMobile);
      setValue('phoneHome', defaultValues.phoneHome);
      setValue('dob', defaultValues.dob);
      setValue('gender', defaultValues.gender);
      setValue('mrn', defaultValues.mrn);
      clearError(Object.keys(defaultValues));
    }
  }, [isActive]);

  return (
    <Collapse timeout={150} in={isOpenedDetails}>
      <PatientDetailsForm
        onSubmit={handleSubmit(data => {
          setIsActive(false);
          updatePatient({ patient: { ...data, patientIdentifier } });
        })}
      >
        <PatientDetailsFormRow>
          <PatientDetailsInput
            label="first name"
            isActive={isActive}
            placeholder="- -"
            name="firstName"
            register={register}
            error={errorMessages?.firstName}
          />
          <PatientDetailsInput
            label="middle name"
            isActive={isActive}
            placeholder="- -"
            name="middleName"
            register={register}
            error={errorMessages?.middleName}
          />
          <PatientDetailsInput
            label="last name"
            isActive={isActive}
            placeholder="- -"
            name="lastName"
            register={register}
            error={errorMessages?.lastName}
          />
        </PatientDetailsFormRow>
        <PatientDetailsFormRow>
          <PatientDetailsInput
            label="gender"
            isActive={isActive}
            placeholder="- -"
            options={['male', 'female', 'other']}
            name="gender"
            defaultValue={genderValue}
            control={control}
            error={errorMessages?.gender}
          />
          <PatientDetailsInput
            label="birthday"
            isActive={isActive}
            placeholder="- -"
            mask="99/99/9999"
            name="dob"
            register={register}
            error={errorMessages?.dob}
          />
          <PatientDetailsInput
            label="mrn"
            isActive={isActive}
            placeholder="- -"
            name="mrn"
            register={register}
            error={errorMessages?.mrn}
          />
        </PatientDetailsFormRow>
        <PatientDetailsFormRow>
          <PatientDetailsInput
            label="mobile phone"
            isActive={isActive}
            placeholder="- -"
            name="phoneMobile"
            register={register}
            mask="(999) 999-999"
            error={errorMessages?.phoneMobile}
          />
          <PatientDetailsInput
            label="home phone"
            isActive={isActive}
            placeholder="- -"
            name="phoneHome"
            register={register}
            error={errorMessages?.phoneHome}
          />
          <PatientDetailsInput
            label="email"
            isActive={isActive}
            placeholder="- -"
            name="email"
            register={register}
            error={errorMessages?.email}
          />
        </PatientDetailsFormRow>
        {!isActive && (
          <PatientDetailsButton onClick={() => setIsActive(true)}>
            EDIT
          </PatientDetailsButton>
        )}
        {isActive && (
          <PatietnDetailsFormFooter>
            <PatientDetailsCancelButton
              onClick={() => {
                setIsActive(false);
              }}
            >
              CANCEL
            </PatientDetailsCancelButton>
            <Button type="submit" variant="contained" size="small">
              SAVE
            </Button>
          </PatietnDetailsFormFooter>
        )}
      </PatientDetailsForm>
    </Collapse>
  );
};
export default PatientDetails;
