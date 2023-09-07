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
import { useHistory } from 'react-router-dom';
import { CUSTOM_FIELDS_SETTINGS_PATH } from 'routing/helpers/paths';
import {
  userProfileSelector,
  userHasPatientCustomFieldsFeatureSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
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
import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import AddButton from 'components/common/AddButton/AddButton';
import { Category, CategoryLabel } from 'helpers/patient-details-helpers';
import moment from 'moment';
import { useBoolean } from 'hooks/useBoolean';
import CategoryOptions from 'components/common/CategoryOptions/CategoryOptions';
import * as patientsApi from 'api/patients-api';
import { FieldType } from 'helpers/field-type-helpers';
import { scrollToError } from 'helpers/ui-helper';
import { formatMetaDataOutput, GENDER_OPTIONS_BIRTH } from './helpers';
import { HidableContainer } from './styled';

const groupByCategory = groupBy(prop('fieldCategoryType'));

const PatientForm = forwardRef(
  (
    {
      patient,
      uniqueIdentifierLabel,
      customerTypeLabel = '',
      onSubmit,
      emrIntegrationEnabled,
      edited = true,
      buttonLabel,
    },
    reference,
  ) => {
    const history = useHistory();
    const {
      handleSubmit,
      formState: { errors },
      setError,
      clearErrors,
    } = useFormContext();
    const [isOpenedPersonal, setIsOpenedPersonal] = useState(true);
    const [isOpenedContact, setIsOpenedContact] = useState(true);
    const [customFields, setCustomFields] = useState(null);
    const userProfile = useSelector(userProfileSelector);
    const { 0: emptyPersonalVisible, 3: toggleEmptyPersonal } =
      useBoolean(false);
    const { 0: emptyContactsVisible, 3: toggleEmptyContacts } =
      useBoolean(false);
    const { 0: emptyOtherVisible, 3: toggleEmptyOther } = useBoolean(false);
    const isAdmin = checkIfUserIsOrganizationAdmin(userProfile);
    const [genderIdentityOptions, setGenderIdentityOptions] = useState([]);
    const currentOrganization = useSelector(selectedUserOrganizationSelector);
    const genderIdentityDisabled =
      currentOrganization?.disabledFeatures?.includes('PATIENT_GENDER') ||
      false;

    const GENDER_OPTIONS_IDENTITY = useMemo(
      () =>
        genderIdentityOptions.map((o) => ({
          value: o.genderIdentityType,
          label: o.description,
        })),
      [genderIdentityOptions],
    );

    const getGenderIdentityOptions = useCallback(async () => {
      const options = await patientsApi.getGenderIdentityOptions();
      setGenderIdentityOptions(options);
    }, []);

    useEffect(() => {
      getGenderIdentityOptions();
    }, [getGenderIdentityOptions]);

    const patientCustomFieldsAvailable = useSelector(
      userHasPatientCustomFieldsFeatureSelector,
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

        return field.fieldType === FieldType.DROPDOWN_MULTI ? (
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

    const handleAddButtonClick = () =>
      history.push(`${CUSTOM_FIELDS_SETTINGS_PATH}/patients`);

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
            readOnly={!edited || emrIntegrationEnabled}
            label="First Name"
            name="firstName"
            required
          />
          <Spacing vertical={3} />
          <FormInput
            readOnly={!edited || emrIntegrationEnabled}
            label="Middle Name"
            name="middleName"
          />
          <Spacing vertical={3} />
          <FormInput
            readOnly={!edited || emrIntegrationEnabled}
            label="Last Name"
            name="lastName"
            required
          />
          <Spacing vertical={3} />
          <FormSelect
            readOnly={!edited || emrIntegrationEnabled}
            label="Sex at birth"
            options={GENDER_OPTIONS_BIRTH}
            name="gender"
          />
          {!genderIdentityDisabled && (
            <>
              <Spacing vertical={3} />
              <FormSelect
                readOnly={!edited || emrIntegrationEnabled}
                label="Gender"
                options={GENDER_OPTIONS_IDENTITY}
                name="genderIdentity"
              />
            </>
          )}
          <Spacing vertical={3} />
          <FormInput
            readOnly={!edited || emrIntegrationEnabled}
            label="Date of Birth"
            placeholder="MM/DD/YYYY"
            inputComponent={DateInput}
            name="dob"
            maxDate={moment().toISOString()}
            setError={setError}
            clearErrors={clearErrors}
          />
          <Spacing vertical={3} />
          <FormInput
            readOnly={!edited || emrIntegrationEnabled}
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
            showAddButton={isAdmin && patientCustomFieldsAvailable}
            onAddButtonClick={handleAddButtonClick}
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
            readOnly={!edited || emrIntegrationEnabled}
            label="Mobile Phone"
            name="phoneMobile"
          />
          <Spacing vertical={3} />
          <FormPhoneNumberInput
            readOnly={!edited || emrIntegrationEnabled}
            label="Home Phone"
            name="phoneHome"
            type="tel"
          />
          <Spacing vertical={3} />
          <FormInput
            readOnly={!edited || emrIntegrationEnabled}
            label="email"
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
            showAddButton={isAdmin && patientCustomFieldsAvailable}
            onAddButtonClick={handleAddButtonClick}
          />
        </LabeledCollapse>
        {customFields?.[Category.OTHER_INFO]?.length > 0 && (
          <LabeledCollapse
            name={`${capitalize(customerTypeLabel)} ${CategoryLabel[
              Category.OTHER_INFO
            ].toLowerCase()}`}
            isOpened={isOpenedContact}
            onClick={() => setIsOpenedContact(!isOpenedContact)}
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
              showAddButton={isAdmin && patientCustomFieldsAvailable}
              onAddButtonClick={handleAddButtonClick}
            />
          </LabeledCollapse>
        )}
        <Box display="flex" justifyContent="space-between">
          <div>
            {isAdmin && patientCustomFieldsAvailable && (
              <AddButton onClick={handleAddButtonClick}>
                Add or edit fields
              </AddButton>
            )}
          </div>
          {edited && (
            <Button
              width="auto"
              type="submit"
              onClick={(event) => {
                if (!isEmpty(errors)) {
                  event.preventDefault();
                  event.stopPropagation();
                  scrollToError(errors);
                }
              }}
            >
              {buttonLabel || `SAVE ${customerTypeLabel}`}
            </Button>
          )}
        </Box>
      </form>
    );
  },
);

export default PatientForm;
