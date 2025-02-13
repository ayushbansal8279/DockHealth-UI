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
    ProfileTypeFieldApi.searchCustomFiledGroups('PATIENT').then((data) => {
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
    ProfileTypeFieldApi.getAllPatientCustomFields().then((data) => {
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

  const handleDragEnd = (e) => {
    // console.log(e);
    const source = e.source.droppableId;
    const destination = e.destination?.droppableId;

    if (source === DROPTYPE.AddCategory) {
      unsetAddCategoryDrop();
      if (destination === 'add-category-area') {
        setNewCategory(true);
      }
    }

    if (source === DROPTYPE.AddField) {
      unsetAddFieldDrop();
      fieldTypes.map((field) => {
        if (e.draggableId === field.fieldType) {
          const updatedCategories = selectedCategories.map((category) => {
            let updatedCategory = category;

            const tempF = {
              tempId: uuidv4(),
              fieldType: field.fieldType,
              placeholder: field.placeholder,
            };

            if (category.identifier === destination) {
              updatedCategory = {
                ...category,
                fields: [...category.fields, tempF],
              };
            }

            return updatedCategory;
          });

          setSelectedCategories(updatedCategories);
        }
      });
    }
  };

  const handleDragStart = (e) => {
    const source = e.source.droppableId;

    if (source === DROPTYPE.AddCategory) setAddCategoryDrop();
    if (source === DROPTYPE.AddField) setAddFieldDrop();
  };

  return (
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
      <div>
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
              <ProfileBuilderCategories />
            </CategoryWrapper>
          </BuilderContainer>
        </DragDropContext>
      </div>
    </ProfileBuilderContext.Provider>
  );
};

export default ProfileBuilder;
