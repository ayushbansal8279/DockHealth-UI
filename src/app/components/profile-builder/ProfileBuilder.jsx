import React, { createContext, useEffect, useState } from 'react';
import BasicLayoutHeader from '../template/BasicLayoutHeader/BasicLayoutHeader';
import ProfileBuilderCategories from './categories/Categories.t/ProfileBuilderCategories';
import { BuilderContainer, CategoryWrapper, PlayGroungWrapper } from './styled';
import BuilderPlayground from './builder-playground/BuilderPlayground';
import { DragDropContext } from 'react-beautiful-dnd';
import { useBoolean } from 'hooks/useBoolean';
import { DROPTYPE } from './helper';
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

  const fetchProfileCustomGroups = ({ allCustomFields }) => {
    CustomFieldApi.searchCustomFiledGroups('PATIENT').then((data) => {
      if (!data || data.length === 0) return;

      let data1 = [...data];

      if (data1.length !== 0) {
        data1.forEach((category) => {
          if (!category.fields) return;

          category.fields = category.fields.map((field) => {
            const match = allCustomFields?.find(
              (ele) => ele.identifier === field.fieldReferenceId,
            );

            return match ? { ...field, ...match } : field;
          });
        });
      }
      setSelectedCategories(data1);
    });
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
    if (tabName === 'patients') {
      fetchPatientCustomFields();
    } else {
      fetchUserCustomFields();
    }
  }, []);

  const [isAddCategoryDrop, setAddCategoryDrop, unsetAddCategoryDrop] =
    useBoolean(false);
  const [isAddFieldDrop, setAddFieldDrop, unsetAddFieldDrop] =
    useBoolean(false);

  const handleDragStart = (e) => {
    const source = e.source.droppableId;

    if (source === DROPTYPE.AddCategory) setAddCategoryDrop();
    if (source === DROPTYPE.AddField) setAddFieldDrop();
    if (source === DROPTYPE.ExistingField) setAddFieldDrop();
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
    unsetAddFieldDrop();

    const updatedCategories = selectedCategories.map((category) => {
      if (category.identifier === destination) {
        const savedFields = category.fields
          .filter((field) => field.fieldReferenceId)
          .map((field) => ({ fieldReferenceId: field.fieldReferenceId }));

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
    unsetAddFieldDrop();

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
    <div style={{ height: '100%' }}>
      <ProfileBuilderContext.Provider
        value={{
          selectedCategories,
          setSelectedCategories,
          allCustomFields,
          setAllCustomFields,
          isNewCategory,
          setNewCategory,
          isAddFieldDrop,
          isAddCategoryDrop,
        }}
      >
        <BasicLayoutHeader title={'Profile/ Profile Builder'} />
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
