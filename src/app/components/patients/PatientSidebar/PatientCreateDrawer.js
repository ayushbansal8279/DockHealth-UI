/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef } from 'react';
import moment from 'moment';
import { useForm, FormContext } from 'react-hook-form';
// import { Collapse } from '@material-ui/core';
import LabeledCollapse from 'components/common/LabeledCollapse/LabeledCollapse';
import CloseIcon from '@material-ui/icons/Close';
import FormInput from 'components/common/Input/FormInput';
import FormPhoneNumberInput from 'components/common/PhoneNumberInput/FormPhoneNumberInput';
import FormSelect from 'components/common/Select/FormSelect';
import DateInput from 'components/common/DateInput/DateInput';
import { mixed, object, string } from 'yup';
import Button from 'components/common/Button/Button';
import { openModal, closeModal } from 'modal/actions';
import Spacing from 'components/common/Spacing';
import { useDispatch } from 'react-redux';
import * as PatientApi from 'api/patient-api';
import { onPatientAdded as onPatientAddedEvent } from 'helpers/ga-event-helper';
import { showAlert } from 'helpers/utility-functions';
import {
  PatientDetailsForm,
  DrawerWrapper,
  ContentWrapper,
  TitleName,
  StickyHeader,
  MoreActinsWrapper,
  PatietnDetailsFormFooter,
  SubmitButtonWrapper,
} from 'views/patient-details/PatientDetailsHeader/PatientDetails/styled.js';

const DATE_FORMAT = 'MM/DD/YYYY';
const REQUIRED_MESSAGE = 'This field is required';
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
  onCancel,
  onPatientCreated,
  uniqueIdentifierLabel,
}) => data => {
  const patientApiMethod = PatientApi.addPatient(data);

  patientApiMethod
    .then(response => {
      onPatientAddedEvent();
      if (typeof onPatientCreated === 'function') {
        onPatientCreated(response);
      }
      onCancel();
    })
    .catch(error => {
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
    });
};

const PatientCreateDrawer = ({
  isOpenedDetails,
  editingDisabled,
  uniqueIdentifierLabel,
  customerTypeLabel,
  onPatientCreated,
  onCancel,
}) => {
  const dispatch = useDispatch();
  const [isOpenedPersonal, setIsOpenedPersonal] = useState(true);
  const [isOpenedContact, setIsOpenedContact] = useState(true);
  const formMethods = useForm({
    reValidateMode: 'onSubmit',
    validationSchema,
  });

  const { handleSubmit, clearError, getValues, reset } = formMethods;
  const submitButtonReference = useRef(null);
  const { gender: genderValue } = getValues();

  const close = () => {
    reset();
    clearError();
    onCancel();
  };

  const handleClose = () => {
    const values = getValues();
    const inProgress = !Object.values(values).every(p => p === undefined);
    if (inProgress) {
      dispatch(
        openModal('InterruptEdit', {
          isWorkflowModal: true,
          confirm: () => {
            submitButtonReference.current.click();
            dispatch(closeModal());
          },
          onClose: close,
        }),
      );
    } else {
      close();
    }
  };

  return (
    <DrawerWrapper open={isOpenedDetails} anchor="right" onClose={handleClose}>
      <ContentWrapper>
        <StickyHeader>
          <TitleName>Add a {customerTypeLabel}</TitleName>
          <MoreActinsWrapper>
            <button type="button" onClick={handleClose}>
              <CloseIcon />
            </button>
          </MoreActinsWrapper>
        </StickyHeader>
        <FormContext {...formMethods}>
          <PatientDetailsForm
            onSubmit={handleSubmit(
              onSubmit({
                onCancel,
                onPatientCreated,
                uniqueIdentifierLabel,
              }),
            )}
          >
            <LabeledCollapse
              name="Patient personal info"
              isOpened={isOpenedPersonal}
              onClick={() => setIsOpenedPersonal(!isOpenedPersonal)}
            >
              <FormInput label="first name" name="firstName" isRequired />
              <Spacing vertical={3} />
              <FormInput
                label="middle name"
                name="middleName"
                isRequired={false}
              />
              <Spacing vertical={3} />
              <FormInput label="last name" name="lastName" isRequired />
              <Spacing vertical={3} />
              <FormSelect
                label="gender"
                options={GENDER_OPTIONS}
                name="gender"
                defaultValue={genderValue}
                isRequired={false}
              />
              <Spacing vertical={3} />
              <FormInput
                label="birthday"
                placeholder="MM/DD/YYYY"
                inputComponent={DateInput}
                name="dob"
                isRequired={false}
              />
              <Spacing vertical={3} />
              <FormInput
                label={uniqueIdentifierLabel}
                placeholder="- -"
                name="mrn"
                isRequired={false}
              />
              <Spacing vertical={3} />
            </LabeledCollapse>
            <LabeledCollapse
              name="Patient contact info"
              isOpened={isOpenedContact}
              onClick={() => setIsOpenedContact(!isOpenedContact)}
            >
              <FormPhoneNumberInput
                label="mobile phone"
                name="phoneMobile"
                isRequired={false}
              />
              <Spacing vertical={1} />
              <FormPhoneNumberInput
                label="home phone"
                name="phoneHome"
                type="tel"
                isRequired={false}
              />
              <Spacing vertical={1} />
              <FormInput label="email" name="email" isRequired={false} />
              <Spacing vertical={1} />
            </LabeledCollapse>
            {!editingDisabled && (
              <PatietnDetailsFormFooter>
                <SubmitButtonWrapper>
                  <Button
                    style={{ textTransform: 'uppercase' }}
                    width="153px"
                    type="submit"
                    reference={submitButtonReference}
                  >
                    SAVE {customerTypeLabel}
                  </Button>
                </SubmitButtonWrapper>
              </PatietnDetailsFormFooter>
            )}
          </PatientDetailsForm>
        </FormContext>
      </ContentWrapper>
    </DrawerWrapper>
  );
};
export default PatientCreateDrawer;
