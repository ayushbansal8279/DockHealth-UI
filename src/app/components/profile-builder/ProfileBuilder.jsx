import React, { createContext, useEffect, useState } from 'react';
import BasicLayoutHeader from '../template/BasicLayoutHeader/BasicLayoutHeader';
import ProfileBuilderCategories from './categories/Categories.t/ProfileBuilderCategories';
import { BuilderContainer, CategoryWrapper, PlayGroungWrapper } from './styled';
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
import * as ProfileTypeFieldApi from 'api/profile-type-field-api';
import * as CustomFieldApi from 'api/custom-fields-api';
import { useDispatch } from 'react-redux';
import uuidv4 from '@/app/views/chat/channel-settings/uuid';

export const ProfileBuilderContext = createContext({});

const ProfileBuilder = () => {
  const dispatch = useDispatch();
  const { tabName, identifier } = useParams();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isNewCategory, setNewCategory] = useState(false);
  const [allCustomFields, setAllCustomFields] = useState([]);
  const [defaultFields, setDefaultFields] = useState([]);

  const Context = tabName === 'patients' ? 'PATIENT' : 'PROFILE';

  const fetchProfileCustomGroups = async ({ allCustomFields }) => {
    try {
      const customGroups = await CustomFieldApi.searchCustomFiledGroups(
        Context,
      );
      const defaultFields = await CustomFieldApi.getDefauldFields(Context);

      const enhancedDefaultFields = convertDefaultFields(defaultFields);
      setDefaultFields(defaultFields);

      const customFields = [...enhancedDefaultFields, ...allCustomFields];

      const hasDefaultFields = customGroups.some(
        (group) => group.name === 'Default Group',
      );

      if (Context === 'PATIENT' && !hasDefaultFields) {
        const defaultCategory = {
          context: Context,
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
      console.error('Error fetching custom field groups:', error);
    }
  };

  const fetchPatientCustomFields = () => {
    CustomFieldApi.getAllPatientCustomFields().then((data) => {
      setAllCustomFields(data);
      fetchProfileCustomGroups({ allCustomFields: data });
    });
  };

  const fetchUserCustomFields = () => {
    // searchCustomFiledGroups()
    ProfileTypeFieldApi.getAllProfileFieldTypes(identifier)
      .then((data) => {
        // setCustomFields(data);
        // setIsFetching(false);
      })
      .catch(() => {
        dispatch(showGlobalErrorAlert());
      });
  };

  useEffect(() => {
    if (Context === 'PATIENT') {
      fetchPatientCustomFields();
    } else {
      fetchUserCustomFields();
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
    const updatedCategories = selectedCategories.map((category) => {
      if (category.identifier === destination) {
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

        const field = allCustomFields.find(
          (item) => item.identifier === e.draggableId,
        );

        return {
          ...category,
          fields: [...category.fields, field],
        };
      }
      return category;
    });

    setSelectedCategories(updatedCategories);
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
    <div style={{ minHeight: '110dvh' }}>
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
        <BasicLayoutHeader title={'Patient Profile Builder'} />
        <DragDropContext
          onDragStart={(e) => handleDragStart(e)}
          onDragEnd={(e) => handleDragEnd(e)}
        >
          <BuilderContainer>
            <PlayGroungWrapper>
              <BuilderPlayground />
            </PlayGroungWrapper>
            <CategoryWrapper>
              <ProfileBuilderCategories allCustomFields={allCustomFields} />
            </CategoryWrapper>
          </BuilderContainer>
        </DragDropContext>
      </ProfileBuilderContext.Provider>
    </div>
  );
};

export default ProfileBuilder;
