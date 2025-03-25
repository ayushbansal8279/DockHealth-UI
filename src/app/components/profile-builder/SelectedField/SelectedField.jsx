import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { DragIndicator } from '@mui/icons-material';
import TextField from '../TextField';
import TEXT from 'img/profile-builder/ShortText.svg';
import LONG_TEXT from 'img/profile-builder/RichText.svg';
import DATE from 'img/profile-builder/Calender.svg';
import NUMBER from 'img/profile-builder/Hash.svg';
import BOOLEAN from 'img/profile-builder/Boolean.svg';
import HYPERLINK from 'img/profile-builder/Link.svg';
import PICK_LIST from 'img/profile-builder/DropDown.svg';
import RELATIONSHIP from 'img/profile-builder/Profile.svg';
import { FieldType } from '../helper';
import * as CustomFieldApi from 'api/custom-fields-api';
import { useDispatch } from 'react-redux';
import { openModal } from 'modal/actions';
import { ProfileBuilderContext } from '../ProfileBuilder';
import {
  createProfileFieldType,
  editProfileFieldType,
} from '@/app/api/profile-type-field-api';
import { showAlert } from 'helpers/utility-functions';
import { showGlobalAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import { addCustomField } from '@/app/api/custom-fields-api';
import {
  FieldArea,
  FieldIconContainer,
  DeletIcon,
  EditIcon,
  IconWrapper,
} from './styled';

const FieldTypeImages = {
  [FieldType.TEXT]: TEXT,
  [FieldType.LONG_TEXT]: LONG_TEXT,
  [FieldType.DATE]: DATE,
  [FieldType.NUMBER]: NUMBER,
  [FieldType.BOOL]: BOOLEAN,
  [FieldType.HYPERLINK]: HYPERLINK,
  [FieldType.DROPDOWN]: PICK_LIST,
  [FieldType.DROPDOWN_MULTI]: PICK_LIST,
  [FieldType.RELATIONSHIP]: RELATIONSHIP,
};

const SelectedField = ({ field, category }) => {
  const dispatch = useDispatch();
  const { tabName, identifier } = useParams();
  const context = tabName === 'patients' ? 'PATIENT' : 'PROFILE';
  const isDefault = field.contextType === 'DEFAULT';
  const isPredefined = field.contextType === 'PREDEFINED';

  const { setSelectedCategories } = useContext(ProfileBuilderContext);

  const handleEditClick = () => {
    dispatch(
      openModal('EditCustomField', {
        options: {
          type: context,
        },
        fetchUserCustomFields: () => () => {},
        fieldCategoryDisabled: true,
        customField: field,
        onUpdated: (updatedField) => {
          if (updatedField.name !== field.name) {
            updateFieldNameInCategory(updatedField);
            dispatch(showGlobalAlert(AlertMessages.UPDATED));
          }
        },
      }),
    );
  };

  const updateFieldNameInCategory = (updatedField) => {
    const updatedCategory = {
      ...category,
      fields: category?.fields?.map((field) =>
        field.identifier === updatedField.fieldReferenceId
          ? { ...field, name: updatedField.name }
          : field,
      ),
    };
    setSelectedCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.identifier === updatedCategory.identifier
          ? updatedCategory
          : category,
      ),
    );
  };

  const { savedFieldsRefrenceValue, savedFieldsActualValue, unSavedFields } =
    category?.fields?.reduce(
      (acc, item) => {
        if (item.identifier) {
          const refrence = {
            fieldReferenceId: item.identifier,
          };
          acc.savedFieldsActualValue.push(item);
          acc.savedFieldsRefrenceValue.push(refrence);
        } else if (item.tempId) {
          acc.unSavedFields.push(item);
        }
        return acc;
      },
      {
        savedFieldsRefrenceValue: [],
        savedFieldsActualValue: [],
        unSavedFields: [],
      },
    );

  const updateCustomGroupsData = (updatedSavedActualFields) => {
    const updatedCategory = { ...category, fields: updatedSavedActualFields };

    setSelectedCategories((prevCategories) =>
      prevCategories.map((obj) =>
        obj.identifier === updatedCategory.identifier ? updatedCategory : obj,
      ),
    );
  };

  const handleBlur = async (value) => {
    if (field.tempId && value) {
      const patientPayload = {
        fieldCategoryType: 'PATIENT_OTHER',
        fieldType: field.fieldType,
        name: value,
        contextType: 'CUSTOM',
        targetType: context,
      };

      const profilePayload = {
        fieldCategoryType: context,
        fieldType: field.fieldType,
        name: value,
        contextType: 'CUSTOM',
        targetType: context,
        profileType: {
          identifier,
        },
      };

      const remainingUnsavedFields = unSavedFields?.filter(
        (tempField) => tempField.tempId !== field.tempId,
      );

      let newlyAddedField = null;
      try {
        newlyAddedField =
          context === 'PATIENT'
            ? await addCustomField(patientPayload, context)
            : await createProfileFieldType(profilePayload);
      } catch (errorMessage) {
        showAlert({
          status: 'error',
          title: 'Error',
          text: errorMessage ?? 'Error creating field. Please try again.',
        });
        return;
      }

      if (newlyAddedField) {
        const updatedSavedRefrenceFields = [
          ...savedFieldsRefrenceValue,
          { fieldReferenceId: newlyAddedField.identifier },
        ];

        const updatedSavedActualFields = [
          ...savedFieldsActualValue,
          newlyAddedField,
          ...remainingUnsavedFields,
        ];

        CustomFieldApi.updateCustomFiledGroup(category.identifier, {
          fields: updatedSavedRefrenceFields,
        });

        updateCustomGroupsData(updatedSavedActualFields);
      }
    } else if (field.identifier && value) {
      if (context === 'PATIENT') {
        CustomFieldApi.updateCustomField({ ...field, name: value });
        const updatedField = { ...field, name: value };
        updateFieldNameInCategory(updatedField);
      }
      if (context === 'PROFILE') {
        editProfileFieldType(field.identifier, { ...field, name: value });
        const updatedField = { ...field, name: value };
        updateFieldNameInCategory(updatedField);
      }
    }
    dispatch(showGlobalAlert(AlertMessages.UPDATED));
  };

  const handleRemoveFieldFromGroup = async () => {
    if (field.identifier) {
      const updatedSavedRefrenceFields = savedFieldsRefrenceValue.filter(
        (field1) => field1.fieldReferenceId !== field.identifier,
      );

      const updatedSavedActualFields = savedFieldsActualValue.filter(
        (field1) => field1.identifier !== field.identifier,
      );

      CustomFieldApi.updateCustomFiledGroup(category.identifier, {
        fields: updatedSavedRefrenceFields,
      });

      const allRemainingFields = [
        ...updatedSavedActualFields,
        ...unSavedFields,
      ];

      updateCustomGroupsData(allRemainingFields);
    } else if (field.tempId) {
      const updatedSavedActualFields = category.fields.filter(
        (fiels) => fiels.tempId !== field.tempId,
      );

      updateCustomGroupsData(updatedSavedActualFields);
    }
    dispatch(showGlobalAlert(AlertMessages.UPDATED));
  };

  return (
    <FieldArea>
      <DragIndicator />
      <FieldIconContainer>
        <img
          style={{ width: '22px', height: '22px' }}
          src={FieldTypeImages[field?.fieldType]}
          alt={field?.name}
        />
      </FieldIconContainer>
      <TextField
        disabled={isDefault || isPredefined}
        border
        size="small"
        value={field.name}
        placeholder={field?.placeholder}
        onEnter={handleBlur}
      />
      <IconWrapper>
        {!isDefault && !isPredefined ? (
          <EditIcon onClick={handleEditClick} />
        ) : (
          <></>
        )}
      </IconWrapper>
      <IconWrapper>
        {!isDefault ? (
          <DeletIcon onClick={handleRemoveFieldFromGroup} />
        ) : (
          <></>
        )}
      </IconWrapper>
    </FieldArea>
  );
};

export default SelectedField;
