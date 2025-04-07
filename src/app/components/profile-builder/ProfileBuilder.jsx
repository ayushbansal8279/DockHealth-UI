import React, { createContext, useEffect, useState } from 'react';
import BasicLayoutHeader from '../template/BasicLayoutHeader/BasicLayoutHeader';
import ProfileBuilderCategories from './categories/Categories.t/ProfileBuilderCategories';
import {
  ProfileBuilderContainer,
  HeaderContainer,
  BuilderContainer,
  CategoryWrapper,
  PlayGroungWrapper,
} from './styled';
import BuilderPlayground from './builder-playground/BuilderPlayground';
import { DragDropContext } from 'react-beautiful-dnd';
import { useBoolean } from 'hooks/useBoolean';
import {
  convertDefaultFields,
  DROPTYPE,
  getDefaultsRefrenceIds,
} from './helper';
import { fieldTypes } from './helper';
import { useParams } from 'react-router-dom';
import { showGlobalErrorAlert } from 'alert/actions';
import * as CustomFieldApi from 'api/custom-fields-api';
import { useDispatch } from 'react-redux';
import uuidv4 from '@/app/views/chat/channel-settings/uuid';
import { getAllProfileFieldTypes } from '@/app/api/profile-type-field-api';
import { getProfileDetailsType } from '@/app/api/profile-type-api';
import { showGlobalAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';

export const ProfileBuilderContext = createContext({});

const ProfileBuilder = () => {
  const dispatch = useDispatch();
  const { tabName, identifier } = useParams();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isNewCategory, setNewCategory] = useState(false);
  const [allCustomFields, setAllCustomFields] = useState([]);
  const [profileName, setProfileName] = useState('');

  const context = tabName === 'patients' ? 'PATIENT' : 'PROFILETYPE';

  const initializePatientData = async () => {
    try {
      const [customGroups, allCustomFields, defaultFields] = await Promise.all([
        CustomFieldApi.searchCustomFiledGroups(context),
        CustomFieldApi.getAllPatientCustomFields(),
        CustomFieldApi.getDefauldFields(context),
      ]);

      setAllCustomFields(allCustomFields);
      const enhancedDefaultFields = convertDefaultFields(defaultFields);
      const customFields = [...enhancedDefaultFields, ...allCustomFields];

      const hasDefaultFields = customGroups.some(
        (group) => group.name === 'Default Group',
      );

      if (!hasDefaultFields) {
        const defaultCategory = {
          context,
          name: 'Default Group',
          fields: getDefaultsRefrenceIds(defaultFields),
          isDefault: true,
          displayOrder: 0,
        };

        const savedDefault = await CustomFieldApi.saveCustomFiledGroup(
          defaultCategory,
        );
        setSelectedCategories((prev) => [...prev, savedDefault]);
      }

      const processedGroups = customGroups.map((category) => {
        if (!category.fields) {
          return category;
        }

        const enrichedFields = category.fields.map((field) => {
          const matchingField = customFields?.find(
            (customField) => customField.identifier === field.fieldReferenceId,
          );

          return matchingField ? { ...field, ...matchingField } : field;
        });

        return { ...category, fields: enrichedFields };
      });
      setSelectedCategories(processedGroups);
    } catch (error) {
      dispatch(showGlobalErrorAlert());
    }
  };

  const initializeCustomProfileData = async () => {
    try {
      const [customGroups, allCustomFields] = await Promise.all([
        CustomFieldApi.searchCustomFiledGroups(context, identifier),
        getAllProfileFieldTypes(identifier),
      ]);

      setAllCustomFields(allCustomFields);

      const processedGroups = customGroups.map((category) => {
        if (!category.fields) {
          return category;
        }

        const enrichedFields = category.fields.map((field) => {
          const matchingField = allCustomFields?.find(
            (customField) => customField.identifier === field.fieldReferenceId,
          );

          return matchingField ? { ...field, ...matchingField } : field;
        });

        return { ...category, fields: enrichedFields };
      });
      setSelectedCategories(processedGroups);
    } catch (error) {
      dispatch(showGlobalErrorAlert());
    }
  };

  useEffect(() => {
    if (context === 'PATIENT') {
      setProfileName('Patient Profile Builder');
      initializePatientData();
    } else if (context === 'PROFILETYPE') {
      getProfileDetailsType(identifier).then((profileTypeDetails) => {
        const profileName = `${profileTypeDetails?.name} Profile Builder`;
        setProfileName(profileName);
      });
      initializeCustomProfileData();
    }
  }, []);

  const [isAddCategoryDrop, setAddCategoryDrop, unsetAddCategoryDrop] =
    useBoolean(false);

  const handleDragStart = (e) => {
    const source = e.source.droppableId;

    if (source === DROPTYPE.AddCategory) setAddCategoryDrop();
  };

  const handleDragEnd = (e) => {
    const source = e.source.droppableId;
    const destination = e.destination?.droppableId;

    switch (source) {
      case DROPTYPE.AddCategory:
        handleAddCategoryDrop(destination);
        break;
      case DROPTYPE.ExistingField:
        handleExistingFieldDrop(e, destination);
        break;
      case DROPTYPE.AddField:
        handleAddFieldDrop(e, destination);
        break;
      default:
        console.warn('Unhandled source type:', source);
    }
  };

  const handleAddCategoryDrop = (destination) => {
    unsetAddCategoryDrop();
    if (destination === 'add-category-area') {
      setNewCategory(true);
    }
  };

  const handleExistingFieldDrop = (e, destination) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.map((category) => {
        if (category.identifier !== destination) return category;

        const fieldExists = category.fields.some(
          (field) => field.identifier === e.draggableId,
        );
        if (fieldExists) {
          dispatch(showGlobalErrorAlert('Field already exists in group'));
          return category;
        }

        const savedFields = category.fields
          .filter((field) => field.identifier)
          .map((field) => ({ fieldReferenceId: field.identifier }));

        const updatedSavedFields = [
          ...savedFields,
          { fieldReferenceId: e.draggableId },
        ];

        CustomFieldApi.updateCustomFiledGroup(category.identifier, {
          fields: updatedSavedFields,
        });

        const newField = allCustomFields.find(
          (item) => item.identifier === e.draggableId,
        );
        dispatch(showGlobalAlert(AlertMessages.UPDATED));

        return {
          ...category,
          fields: [...category.fields, newField],
        };
      }),
    );
  };

  const handleAddFieldDrop = (e, destination) => {
    fieldTypes.forEach((fieldType) => {
      if (e.draggableId === fieldType.fieldType) {
        const updatedCategories = selectedCategories.map((category) => {
          if (category.identifier === destination) {
            const tempF = {
              tempId: uuidv4(),
              fieldType: fieldType.fieldType,
              placeholder: fieldType.placeholder,
            };

            return {
              ...category,
              fields: [...category.fields, tempF],
            };
          }
          return category;
        });

        setSelectedCategories(updatedCategories);
      }
    });
  };

  return (
    <ProfileBuilderContainer>
      <ProfileBuilderContext.Provider
        value={{
          selectedCategories,
          setSelectedCategories,
          allCustomFields,
          setAllCustomFields,
          isNewCategory,
          setNewCategory,
          isAddCategoryDrop,
        }}
      >
        <HeaderContainer>
          <BasicLayoutHeader title={profileName} />
        </HeaderContainer>
        <DragDropContext
          onDragStart={(e) => handleDragStart(e)}
          onDragEnd={(e) => handleDragEnd(e)}
        >
          <BuilderContainer>
            <PlayGroungWrapper>
              <BuilderPlayground context={context} identifier={identifier} />
            </PlayGroungWrapper>
            <CategoryWrapper>
              <ProfileBuilderCategories allCustomFields={allCustomFields} />
            </CategoryWrapper>
          </BuilderContainer>
        </DragDropContext>
      </ProfileBuilderContext.Provider>
    </ProfileBuilderContainer>
  );
};

export default ProfileBuilder;
