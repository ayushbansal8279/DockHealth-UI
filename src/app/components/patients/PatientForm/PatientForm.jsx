/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useState,
  forwardRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { selectedUserOrganizationSelector } from 'selectors/user-selectors';
import groupBy from 'ramda/src/groupBy';
import prop from 'ramda/src/prop';
import compose from 'ramda/src/compose';
import sortBy from 'ramda/src/sortBy';
import isEmpty from 'ramda/src/isEmpty';
import { useFormContext } from 'react-hook-form';
import { capitalize } from 'helpers/capitalize';
import * as CustomFieldsApi from 'api/custom-fields-api';
import LabeledCollapse from 'components/common/LabeledCollapse/LabeledCollapse';
import FormInput from 'components/common/Input/FormInput';
import FormPhoneNumberInput from 'components/common/PhoneNumberInput/FormPhoneNumberInput';
import FormSelect from 'components/common/Select/FormSelect';
import DateInput from 'components/common/DateInput/DateInput';
import CustomField from 'components/common/CustomField/CustomField';
import Spacing from 'components/common/Spacing';
import { Category, CategoryLabel } from 'helpers/patient-details-helpers';
import moment from 'moment';
import { useBoolean } from 'hooks/useBoolean';
import CategoryOptions from 'components/common/CategoryOptions/CategoryOptions';
import { FieldType } from 'helpers/field-type-helpers';
import { scrollToError } from 'helpers/ui-helper';
import { formatMetaDataOutput } from './helpers';
import {
  GENDER_OPTIONS_BIRTH,
  convertGenderIdentitiesToSelectOptions,
} from '@/app/types/gender';
import { HidableContainer } from './styled';
import { useGenderIdentitiesQuery } from '@/app/react-query/reference/useGenderIdentitiesQuery';
import { ConfirmButton } from '@/app/modal/components/ModalButton/ModalButtons';

const groupByCategory = groupBy(prop('fieldCategoryType'));

const PatientForm = forwardRef(
  (
    {
      patient,
      uniqueIdentifierLabel,
      customerTypeLabel = '',
      onSubmit,
      patientAddEnabled,
      edited = true,
      buttonLabel,
    },
    reference,
  ) => {
    const {
      handleSubmit,
      formState: { errors },
      setError,
      clearErrors,
    } = useFormContext();
    const [isOpenedPersonal, setIsOpenedPersonal] = useState(true);
    const [isOpenedContact, setIsOpenedContact] = useState(true);
    const [isOpenedOther, setIsOpenedOther] = useState(true);
    const [customFields, setCustomFields] = useState(null);

    const { 0: emptyPersonalVisible, 3: toggleEmptyPersonal } =
      useBoolean(false);
    const { 0: emptyContactsVisible, 3: toggleEmptyContacts } =
      useBoolean(false);
    const { 0: emptyOtherVisible, 3: toggleEmptyOther } = useBoolean(false);
    const currentOrganization = useSelector(selectedUserOrganizationSelector);
    const genderIdentityDisabled =
      currentOrganization?.disabledFeatures?.includes('PATIENT_GENDER') ||
      false;
    const genderIdentityOptions = useGenderIdentitiesQuery();

    const GENDER_OPTIONS_IDENTITY = useMemo(
      () =>
        convertGenderIdentitiesToSelectOptions(
          genderIdentityOptions.data ?? [],
        ),
      [genderIdentityOptions.data],
    );
    useEffect(() => {
      CustomFieldsApi.getAllPatientCustomFields(
        true,
        patient?.patientIdentifier || undefined,
      ).then((data) => {
        compose(
          setCustomFields,
          groupByCategory,
          sortBy(prop('sortIndex')),
        )(data);
      });
    }, [patient]);

    const renderCustomField = useCallback(
      (field, index, showEmpty = true) => {
        const patientCustomField = patient?.patientMetaData?.find(
          ({ customFieldIdentifier }) =>
            field.identifier === customFieldIdentifier,
        );

        return field.fieldType === FieldType.DROPDOWN_MULTI ||
          field.fieldType === FieldType.RELATIONSHIP ? (
          <HidableContainer
            key={field.identifier}
            visible={!showEmpty && !patientCustomField?.values}
          >
            {index !== 0 && <Spacing vertical={3} />}
            <CustomField
              readOnly={!edited}
              field={field}
              initialValue={patientCustomField?.values}
              fieldsGroupKey="patientMetaData"
            />
          </HidableContainer>
        ) : (
          <HidableContainer
            key={field.identifier}
            visible={!showEmpty && !patientCustomField?.value}
          >
            {index !== 0 && <Spacing vertical={3} />}
            <CustomField
              readOnly={!edited}
              field={field}
              initialValue={patientCustomField?.value}
              fieldsGroupKey="patientMetaData"
            />
          </HidableContainer>
        );
      },
      [patient, edited],
    );

    return (
      <form
        onSubmit={handleSubmit(
          compose(onSubmit, formatMetaDataOutput),
          scrollToError,
        )}
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
            readOnly={!edited || !patientAddEnabled}
            label="First Name"
            name="firstName"
            required
          />
          <Spacing vertical={3} />
          <FormInput
            readOnly={!edited || !patientAddEnabled}
            label="Middle Name"
            name="middleName"
          />
          <Spacing vertical={3} />
          <FormInput
            readOnly={!edited || !patientAddEnabled}
            label="Last Name"
            name="lastName"
            required
          />
          <Spacing vertical={3} />
          <FormSelect
            readOnly={!edited || !patientAddEnabled}
            label="Sex at Birth"
            options={GENDER_OPTIONS_BIRTH}
            name="gender"
          />
          {!genderIdentityDisabled && (
            <>
              <Spacing vertical={3} />
              <FormSelect
                readOnly={!edited || !patientAddEnabled}
                label="Gender"
                options={GENDER_OPTIONS_IDENTITY}
                name="genderIdentity"
              />
            </>
          )}
          <Spacing vertical={3} />
          <FormInput
            readOnly={!edited || !patientAddEnabled}
            label="Date of Birth"
            placeholder="MM/DD/YYYY"
            inputComponent={DateInput}
            name="dob"
            maxDate={moment().toISOString()}
            // setError={setError}
            clearErrors={clearErrors}
          />
          <Spacing vertical={3} />
          <FormInput
            readOnly={!edited || !patientAddEnabled}
            label={uniqueIdentifierLabel}
            placeholder="- -"
            name="mrn"
          />
          <Spacing vertical={3} />
          {customFields?.[Category.PERSONAL_INFO]?.map((field, index) => {
            return renderCustomField(
              field,
              index,
              emptyPersonalVisible || edited,
            );
          })}
          <Spacing vertical={3} />
          <CategoryOptions
            visibility={emptyPersonalVisible}
            onToggle={toggleEmptyPersonal}
          />
        </LabeledCollapse>
        <LabeledCollapse
          name={`${capitalize(customerTypeLabel)} ${CategoryLabel[
            Category.CONTACT_INFO
          ].toLowerCase()}`}
          isOpened={isOpenedContact}
          onClick={() => setIsOpenedContact(!isOpenedContact)}
        >
          <FormPhoneNumberInput
            readOnly={!edited || !patientAddEnabled}
            label="Mobile Phone"
            name="phoneMobile"
          />
          <Spacing vertical={3} />
          <FormPhoneNumberInput
            readOnly={!edited || !patientAddEnabled}
            label="Home Phone"
            name="phoneHome"
            type="tel"
          />
          <Spacing vertical={3} />
          <FormInput
            readOnly={!edited || !patientAddEnabled}
            label="Email"
            name="email"
          />
          <Spacing vertical={3} />
          {customFields?.[Category.CONTACT_INFO]?.map((field, index) => {
            return renderCustomField(
              field,
              index,
              emptyContactsVisible || edited,
            );
          })}
          <Spacing vertical={3} />
          <CategoryOptions
            visibility={emptyContactsVisible}
            onToggle={toggleEmptyContacts}
          />
        </LabeledCollapse>
        {customFields?.[Category.OTHER_INFO]?.length > 0 && (
          <LabeledCollapse
            name={`${capitalize(customerTypeLabel)} ${CategoryLabel[
              Category.OTHER_INFO
            ].toLowerCase()}`}
            isOpened={isOpenedOther}
            onClick={() => setIsOpenedOther(!isOpenedOther)}
          >
            {customFields?.[Category.OTHER_INFO].map((field, index) => {
              return renderCustomField(
                field,
                index,
                emptyOtherVisible || edited,
              );
            })}
            <Spacing vertical={3} />
            <CategoryOptions
              visibility={emptyOtherVisible}
              onToggle={toggleEmptyOther}
            />
          </LabeledCollapse>
        )}
        <Box display="flex" justifyContent="space-between">
          {edited && (
            <ConfirmButton
              style={{ width: 'auto' }}
              onClick={(event) => {
                if (!isEmpty(errors)) {
                  event.preventDefault();
                  event.stopPropagation();
                  scrollToError(errors);
                }
              }}
            >
              {buttonLabel || `Save Edits`}
            </ConfirmButton>
          )}
        </Box>
      </form>
    );
  },
);

export default PatientForm;
