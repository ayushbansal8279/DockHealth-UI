import React, { useState, forwardRef } from 'react';
import moment from 'moment';
import { FormContext } from 'react-hook-form';
import { capitalize } from 'helpers/capitalize';
import LabeledCollapse from 'components/common/LabeledCollapse/LabeledCollapse';
import FormInput from 'components/common/Input/FormInput';
import FormPhoneNumberInput from 'components/common/PhoneNumberInput/FormPhoneNumberInput';
import FormSelect from 'components/common/Select/FormSelect';
import DateInput from 'components/common/DateInput/DateInput';
import { mixed, string } from 'yup';
import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import {
  PatientDetailsForm,
  PatientDetailsFormFooter,
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

export const validationObjectShape = {
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

const PatientForm = forwardRef(
  (
    {
      formMethods,
      uniqueIdentifierLabel,
      editingDisabled,
      customerTypeLabel = '',
      onSubmit,
      readOnly = false,
      buttonLabel,
    },
    reference,
  ) => {
    const { getValues } = formMethods;
    const [isOpenedPersonal, setIsOpenedPersonal] = useState(true);
    const [isOpenedContact, setIsOpenedContact] = useState(true);
    const { gender: genderValue } = getValues();

    return (
      <FormContext {...formMethods}>
        <PatientDetailsForm onSubmit={onSubmit} ref={reference}>
          <LabeledCollapse
            name={`${capitalize(customerTypeLabel)} personal info`}
            isOpened={isOpenedPersonal}
            onClick={() => setIsOpenedPersonal(!isOpenedPersonal)}
          >
            <FormInput
              readOnly={readOnly}
              label="first name"
              name="firstName"
              isRequired
            />
            <Spacing vertical={3} />
            <FormInput
              readOnly={readOnly}
              label="middle name"
              name="middleName"
              isRequired={false}
            />
            <Spacing readOnly={readOnly} vertical={3} />
            <FormInput
              readOnly={readOnly}
              label="last name"
              name="lastName"
              isRequired
            />
            <Spacing vertical={3} />
            <FormSelect
              readOnly={readOnly}
              label="gender"
              options={GENDER_OPTIONS}
              name="gender"
              defaultValue={genderValue}
              isRequired={false}
            />
            <Spacing vertical={3} />
            <FormInput
              readOnly={readOnly}
              label="birthday"
              placeholder="MM/DD/YYYY"
              inputComponent={DateInput}
              name="dob"
              isRequired={false}
            />
            <Spacing vertical={3} />
            <FormInput
              readOnly={readOnly}
              label={uniqueIdentifierLabel}
              placeholder="- -"
              name="mrn"
              isRequired={false}
            />
            <Spacing vertical={3} />
          </LabeledCollapse>
          <LabeledCollapse
            name={`${capitalize(customerTypeLabel)} contact info`}
            isOpened={isOpenedContact}
            onClick={() => setIsOpenedContact(!isOpenedContact)}
          >
            <FormPhoneNumberInput
              readOnly={readOnly}
              label="mobile phone"
              name="phoneMobile"
              isRequired={false}
            />
            <Spacing vertical={1} />
            <FormPhoneNumberInput
              readOnly={readOnly}
              label="home phone"
              name="phoneHome"
              type="tel"
              isRequired={false}
            />
            <Spacing vertical={1} />
            <FormInput
              readOnly={readOnly}
              label="email"
              name="email"
              isRequired={false}
            />
            <Spacing vertical={1} />
          </LabeledCollapse>
          {!editingDisabled && !readOnly && (
            <PatientDetailsFormFooter>
              <SubmitButtonWrapper>
                <Button
                  style={{ textTransform: 'uppercase' }}
                  width="153px"
                  type="submit"
                >
                  {buttonLabel || `SAVE ${customerTypeLabel}`}
                </Button>
              </SubmitButtonWrapper>
            </PatientDetailsFormFooter>
          )}
        </PatientDetailsForm>
      </FormContext>
    );
  },
);

export default PatientForm;
