/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import { Collapse } from '@material-ui/core';
import Button from 'components/common/Button/Button';
import { getCustomerUniqueIDLabel } from 'helpers/customer-type-helper';
import PatientDetailsInput from './PatientDetailsInput';
import {
  PatientDetailsForm,
  PatientDetailsFormRow,
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
  archivePatient,
  editingDisabled,
  currentUser,
}) => {
  const formattedDob = dob ? moment(dob).format('MM/DD/YYYY') : null;
  const defaultValues = {
    firstName,
    middleName,
    lastName,
    email,
    phoneMobile,
    phoneHome,
    dob: formattedDob,
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
    setValue('dob', formattedDob);
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

  const uniqueIdentifierLabel = getCustomerUniqueIDLabel(currentUser);

  return (
    <Collapse timeout={150} in={isOpenedDetails}>
      <PatientDetailsForm
        onSubmit={handleSubmit(data => {
          setIsActive(false);
          updatePatient({ ...data, patientIdentifier });
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
            isRequired
          />
          <PatientDetailsInput
            label="middle name"
            isActive={isActive}
            placeholder="- -"
            name="middleName"
            register={register}
            error={errorMessages?.middleName}
            isRequired={false}
          />
          <PatientDetailsInput
            label="last name"
            isActive={isActive}
            placeholder="- -"
            name="lastName"
            register={register}
            error={errorMessages?.lastName}
            isRequired
          />
        </PatientDetailsFormRow>
        <PatientDetailsFormRow>
          <PatientDetailsInput
            label="gender"
            isActive={isActive}
            placeholder="- -"
            options={['male', 'female', 'non binary']}
            name="gender"
            defaultValue={genderValue}
            control={control}
            error={errorMessages?.gender || (editingDisabled && !genderValue)}
            isRequired={false}
          />
          <PatientDetailsInput
            label="birthday"
            isActive={isActive}
            placeholder="- -"
            mask={isActive && '99/99/9999'}
            name="dob"
            register={register}
            error={errorMessages?.dob || (editingDisabled && !dob)}
            isRequired={false}
            defaultValue={dob ? moment(dob).format('MM/DD/YYYY') : null}
          />
          <PatientDetailsInput
            label={uniqueIdentifierLabel}
            isActive={isActive}
            placeholder="- -"
            name="mrn"
            register={register}
            error={errorMessages?.mrn || (editingDisabled && !mrn)}
            isRequired={false}
          />
        </PatientDetailsFormRow>
        <PatientDetailsFormRow>
          <PatientDetailsInput
            label="mobile phone"
            isActive={isActive}
            name="phoneMobile"
            type="tel"
            register={register}
            control={control}
            setValue={setValue}
            error={errorMessages?.phoneMobile}
            isRequired={false}
            defaultValue={phoneMobile}
          />
          <PatientDetailsInput
            label="home phone"
            isActive={isActive}
            name="phoneHome"
            type="tel"
            register={register}
            control={control}
            setValue={setValue}
            error={errorMessages?.phoneHome}
            isRequired={false}
            defaultValue={phoneHome}
          />
          <PatientDetailsInput
            label="email"
            isActive={isActive}
            placeholder="- -"
            name="email"
            register={register}
            error={errorMessages?.email}
            isRequired={false}
          />
        </PatientDetailsFormRow>
        {!editingDisabled && (
          <>
            <PatietnDetailsFormFooter>
              {!isActive && (
                <Button onClick={() => setIsActive(true)}>EDIT</Button>
              )}
              {!isActive && (
                <Button variant="text" onClick={archivePatient}>
                  ARCHIVE
                </Button>
              )}
            </PatietnDetailsFormFooter>
            {isActive && (
              <PatietnDetailsFormFooter>
                <Button
                  variant="text"
                  onClick={() => {
                    setIsActive(false);
                  }}
                >
                  CANCEL
                </Button>
                <Button type="submit">SAVE</Button>
              </PatietnDetailsFormFooter>
            )}
          </>
        )}
      </PatientDetailsForm>
    </Collapse>
  );
};
export default PatientDetails;
