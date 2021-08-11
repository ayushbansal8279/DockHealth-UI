import React, { useState, forwardRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { CUSTOM_FIELDS_SETTINGS_PATH } from 'routing/helpers/paths';
import { userProfileSelector } from 'selectors/user-selectors';
import { groupBy, prop, compose } from 'ramda';
import { useFormContext } from 'react-hook-form';
import { capitalize } from 'helpers/capitalize';
import * as CustomFieldsApi from 'api/custom-fields-api';
import LabeledCollapse from 'components/common/LabeledCollapse/LabeledCollapse';
import FormInput from 'components/common/Input/FormInput';
import FormPhoneNumberInput from 'components/common/PhoneNumberInput/FormPhoneNumberInput';
import FormSelect from 'components/common/Select/FormSelect';
import DateInput from 'components/common/DateInput/DateInput';
import CustomField from 'components/patients/CustomField/CustomField';
import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import AddButton from 'components/common/AddButton/AddButton';
import { Category, CategoryLabel } from 'helpers/patient-details-helpers';
import moment from 'moment';
import { formatMetaDataOutput, GENDER_OPTIONS } from './helpers';

const groupByCategory = groupBy(prop('fieldCategoryType'));

const PatientForm = forwardRef(
  (
    {
      patient,
      uniqueIdentifierLabel,
      customerTypeLabel = '',
      onSubmit,
      readOnly = false,
      buttonLabel,
    },
    reference,
  ) => {
    const history = useHistory();
    const { handleSubmit } = useFormContext();
    const [isOpenedPersonal, setIsOpenedPersonal] = useState(true);
    const [isOpenedContact, setIsOpenedContact] = useState(true);
    const [customFields, setCustomFields] = useState(null);
    const userProfile = useSelector(userProfileSelector);
    const { orgUserRole } = userProfile || {};

    const isAdmin = orgUserRole === 'ADMIN' || orgUserRole === 'OWNER';

    useEffect(() => {
      CustomFieldsApi.getAllPatientCustomFields(
        true,
        patient?.patientIdentifier || undefined,
      ).then(data => {
        compose(setCustomFields, groupByCategory)(data);
      });
    }, [patient]);

    const renderCustomField = useCallback(
      (field, index) => {
        const initialFieldValue = patient?.patientMetaData?.find(
          ({ customFieldIdentifier }) =>
            field.identifier === customFieldIdentifier,
        );
        return (
          <div key={field.identifier}>
            {index !== 0 && <Spacing vertical={3} />}
            <CustomField
              readOnly={readOnly}
              field={field}
              initialValue={initialFieldValue}
            />
          </div>
        );
      },
      [patient, readOnly],
    );

    return (
      <form
        onSubmit={handleSubmit(compose(onSubmit, formatMetaDataOutput))}
        ref={reference}
      >
        <LabeledCollapse
          name={`${capitalize(customerTypeLabel)} ${CategoryLabel[
            Category.PERSONAL_INFO
          ].toLowerCase()}`}
          isOpened={isOpenedPersonal}
          onClick={() => setIsOpenedPersonal(!isOpenedPersonal)}
        >
          <FormInput
            readOnly={readOnly}
            label="First Name"
            name="firstName"
            required
          />
          <Spacing vertical={3} />
          <FormInput
            readOnly={readOnly}
            label="Middle Name"
            name="middleName"
          />
          <Spacing readOnly={readOnly} vertical={3} />
          <FormInput
            readOnly={readOnly}
            label="Last Name"
            name="lastName"
            required
          />
          <Spacing vertical={3} />
          <FormSelect
            readOnly={readOnly}
            label="Gender"
            options={GENDER_OPTIONS}
            name="gender"
          />
          <Spacing vertical={3} />
          <FormInput
            readOnly={readOnly}
            label="Date of Birth"
            placeholder="MM/DD/YYYY"
            inputComponent={DateInput}
            name="dob"
            maxDate={moment().toISOString()}
          />
          <Spacing vertical={3} />
          <FormInput
            readOnly={readOnly}
            label={uniqueIdentifierLabel}
            placeholder="- -"
            name="mrn"
          />
          <Spacing vertical={3} />
          {customFields?.[Category.PERSONAL_INFO]?.map(renderCustomField)}
        </LabeledCollapse>
        <LabeledCollapse
          name={`${capitalize(customerTypeLabel)} ${CategoryLabel[
            Category.CONTACT_INFO
          ].toLowerCase()}`}
          isOpened={isOpenedContact}
          onClick={() => setIsOpenedContact(!isOpenedContact)}
        >
          <FormPhoneNumberInput
            readOnly={readOnly}
            label="Mobile Phone"
            name="phoneMobile"
          />
          <Spacing vertical={3} />
          <FormPhoneNumberInput
            readOnly={readOnly}
            label="Home Phone"
            name="phoneHome"
            type="tel"
          />
          <Spacing vertical={3} />
          <FormInput readOnly={readOnly} label="email" name="email" />
          <Spacing vertical={3} />
          {customFields?.[Category.CONTACT_INFO]?.map(renderCustomField)}
        </LabeledCollapse>
        {customFields?.[Category.OTHER_INFO]?.length > 0 && (
          <LabeledCollapse
            name={`${capitalize(customerTypeLabel)} ${CategoryLabel[
              Category.OTHER_INFO
            ].toLowerCase()}`}
            isOpened={isOpenedContact}
            onClick={() => setIsOpenedContact(!isOpenedContact)}
          >
            {customFields?.[Category.OTHER_INFO]?.map(renderCustomField)}
          </LabeledCollapse>
        )}
        <Box display="flex" justifyContent="space-between">
          <div>
            {isAdmin && (
              <AddButton
                onClick={() => history.push(CUSTOM_FIELDS_SETTINGS_PATH)}
              >
                Add or edit fields
              </AddButton>
            )}
          </div>
          {!readOnly && (
            <Button width="auto" type="submit">
              {buttonLabel || `SAVE ${customerTypeLabel}`}
            </Button>
          )}
        </Box>
      </form>
    );
  },
);

export default PatientForm;
