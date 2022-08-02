/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, forwardRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { CUSTOM_FIELDS_SETTINGS_PATH } from 'routing/helpers/paths';
import { userProfileSelector } from 'selectors/user-selectors';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import { compose } from 'ramda';
import { useFormContext } from 'react-hook-form';
import * as CustomFieldsApi from 'api/custom-fields-api';
import LabeledCollapse from 'components/common/LabeledCollapse/LabeledCollapse';
import FormInput from 'components/common/Input/FormInput';
import FormPhoneNumberInput from 'components/common/PhoneNumberInput/FormPhoneNumberInput';
import CustomField from 'components/common/CustomField/CustomField';
import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import { useBoolean } from 'hooks/useBoolean';
import CategoryOptions from 'components/common/CategoryOptions/CategoryOptions';
import { FieldType } from 'helpers/field-type-helpers';
import { scrollToError } from 'helpers/ui-helper';
import { formatMetaDataOutput } from './helpers';
import { HidableContainer } from './styled';

const PersonForm = forwardRef(
  ({ user, onSubmit, edited = true }, reference) => {
    const history = useHistory();
    const { handleSubmit } = useFormContext();
    const [isOpenedPersonal, setIsOpenedPersonal] = useState(true);
    const [isOpenedContact, setIsOpenedContact] = useState(true);
    const [customFields, setCustomFields] = useState(null);
    const userProfile = useSelector(userProfileSelector);
    const { 0: emptyOtherVisible, 3: toggleEmptyOther } = useBoolean(false);
    const isAdmin = checkIfUserIsOrganizationAdmin(userProfile);

    useEffect(() => {
      CustomFieldsApi.getAllProviderCustomFields(
        true,
        user?.userIdentifier || undefined,
      ).then(data => {
        setCustomFields(data);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderCustomField = useCallback(
      (field, index, showEmpty = true) => {
        const providerCustomField = user?.providerMetaData?.find(
          ({ customFieldIdentifier }) =>
            field.identifier === customFieldIdentifier,
        );

        return field.fieldType === FieldType.DROPDOWN_MULTI ? (
          <HidableContainer
            key={field.identifier}
            visible={!showEmpty && !providerCustomField?.values}
          >
            {index !== 0 && <Spacing vertical={3} />}
            <CustomField
              readOnly={!edited}
              field={field}
              initialValue={providerCustomField?.values}
              fieldsGroupKey="providerMetaData"
            />
          </HidableContainer>
        ) : (
          <HidableContainer
            key={field.identifier}
            visible={!showEmpty && !providerCustomField?.value}
          >
            {index !== 0 && <Spacing vertical={3} />}
            <CustomField
              readOnly={!edited}
              field={field}
              initialValue={providerCustomField?.value}
              fieldsGroupKey="providerMetaData"
            />
          </HidableContainer>
        );
      },
      [user, edited],
    );

    const handleAddButtonClick = () =>
      history.push(`${CUSTOM_FIELDS_SETTINGS_PATH}/provider`);

    return (
      <form
        onSubmit={handleSubmit(
          compose(onSubmit, formatMetaDataOutput),
          scrollToError,
        )}
        ref={reference}
      >
        <LabeledCollapse
          name="User Personal Info"
          isOpened={isOpenedPersonal}
          onClick={() => setIsOpenedPersonal(!isOpenedPersonal)}
        >
          <FormInput
            readOnly={!(isAdmin && edited)}
            label="First Name"
            name="firstName"
            required
          />
          <Spacing vertical={3} />
          <FormInput
            readOnly={!(isAdmin && edited)}
            label="Last Name"
            name="lastName"
            required
          />
          <Spacing vertical={3} />
          <FormInput readOnly label="Email" name="email" />
          <Spacing vertical={3} />
          <FormPhoneNumberInput
            readOnly
            label="Mobile Phone"
            name="phoneMobile"
          />
          <Spacing vertical={3} />
          <FormPhoneNumberInput
            readOnly={!(isAdmin && edited)}
            label="Work Phone"
            name="workPhoneNumber"
            type="tel"
          />
          <Spacing vertical={3} />
          <FormInput
            readOnly={!(isAdmin && edited)}
            label="Department"
            name="department"
          />
        </LabeledCollapse>

        {customFields?.length > 0 && (
          <LabeledCollapse
            name="User Other Info"
            isOpened={isOpenedContact}
            onClick={() => setIsOpenedContact(!isOpenedContact)}
          >
            {customFields?.map((field, index) => {
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
              showAddButton={isAdmin}
              onAddButtonClick={handleAddButtonClick}
            />
          </LabeledCollapse>
        )}
        <Box display="flex" justifyContent="space-between">
          {edited && (
            <Button width="auto" type="submit">
              SAVE EDITS
            </Button>
          )}
        </Box>
      </form>
    );
  },
);

export default PersonForm;
