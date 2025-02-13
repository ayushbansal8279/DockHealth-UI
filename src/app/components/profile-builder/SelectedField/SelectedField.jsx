import { FieldArea, FieldIconContainer, DeletIcon, EditIcon } from './styled';
import { DragIndicator } from '@mui/icons-material';
import React, { useContext } from 'react';
import TextField from '../TextField';
import { addCustomField, updateCustomField } from '@/app/api/custom-fields-api';
import TEXT from 'img/profile-builder/shortText.svg';
import LONG_TEXT from 'img/profile-builder/RichText.svg';
import DATE from 'img/profile-builder/Calender.svg';
import NUMBER from 'img/profile-builder/Hash.svg';
import BOOLEAN from 'img/profile-builder/Boolean.svg';
import HYPERLINK from 'img/profile-builder/Link.svg';
import PICK_LIST from 'img/profile-builder/DropDown.svg';
import RELATIONSHIP from 'img/profile-builder/Profile.svg';
import { FieldType } from '../helper';
import * as ProfileTypeFieldApi from 'api/profile-type-field-api';
import { useDispatch } from 'react-redux';
import { openModal } from 'modal/actions';
import { ProfileBuilderContext } from '../ProfileBuilder';

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

  const { setSelectedCategories } = useContext(ProfileBuilderContext);

  const handleEditClick = () => {
    dispatch(
      openModal('EditCustomField', {
        options: {
          type: 'PATIENT',
        },
        customField: field,
        onUpdated: (updatedField) => {
          // setFieldName(updatedField.name);
        },
      }),
    );
  };

  const { savedFieldsRefrenceValue, savedFieldsActualValue, tempFields } =
    category?.fields?.reduce(
      (acc, item) => {
        if (item.identifier) {
          const aa = {
            fieldReferenceId: item.fieldReferenceId,
          };
          acc.savedFieldsActualValue.push(item);
          acc.savedFieldsRefrenceValue.push(aa);
        } else if (item.tempId) {
          acc.tempFields.push(item);
        }
        return acc;
      },
      {
        savedFieldsRefrenceValue: [],
        savedFieldsActualValue: [],
        tempFields: [],
      },
    );

  const updateCustomGroupsData = (
    updatedSavedRefrenceFields,
    updatedSavedActualFields,
  ) => {
    ProfileTypeFieldApi.updateCustomFiledGroup(category.identifier, {
      fields: updatedSavedRefrenceFields,
    });

    const updatedCategory = { ...category, fields: updatedSavedActualFields };

    setSelectedCategories((prevCategories) =>
      prevCategories.map((obj) =>
        obj.identifier === updatedCategory.identifier ? updatedCategory : obj,
      ),
    );
  };

  const handleBlur = async (value) => {
    if (field.tempId && value) {
      const payload = {
        fieldCategoryType: 'PATIENT_OTHER',
        fieldType: field.fieldType,
        name: value,
        contextType: 'CUSTOM',
      };

      const remainingTemporaryFields = tempFields?.filter(
        (tempField) => tempField.tempId !== field.tempId,
      );

      const newlyAddedField = await addCustomField(payload, 'PATIENT');

      const updatedSavedRefrenceFields = [
        ...savedFieldsRefrenceValue,
        { fieldReferenceId: newlyAddedField.identifier },
      ];

      const updatedSavedActualFields = [
        ...savedFieldsActualValue,
        newlyAddedField,
        ...remainingTemporaryFields,
      ];

      updateCustomGroupsData(
        updatedSavedRefrenceFields,
        updatedSavedActualFields,
      );
    } else if (field.identifier && value) {
      updateCustomField({ ...field, name: value });
    }
  };

  const handleRemoveFieldFromGroup = async () => {
    if (field.identifier) {
      const updatedSavedRefrenceFields = savedFieldsRefrenceValue.filter(
        (field1) => field1.fieldReferenceId !== field.identifier,
      );

      const updatedSavedActualFields = savedFieldsActualValue.filter(
        (field1) => field1.identifier !== field.identifier,
      );

      updateCustomGroupsData(
        updatedSavedRefrenceFields,
        updatedSavedActualFields,
      );
    }
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
        border
        size="small"
        value={field.name}
        placeholder={field?.placeholder}
        onBlur={handleBlur}
      />
      <EditIcon onClick={handleEditClick} />
      <DeletIcon onClick={handleRemoveFieldFromGroup} />
    </FieldArea>
  );
};

export default SelectedField;
