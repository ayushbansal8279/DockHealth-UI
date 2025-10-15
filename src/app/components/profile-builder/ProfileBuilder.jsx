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
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { getAllProfileFieldTypes } from '@/app/api/profile-type-field-api';
import { getProfileDetailsType } from '@/app/api/profile-type-api';
import { showGlobalAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import { userProfileSelector } from '@/app/selectors/user-selectors';
import { getCustomerTypeLabel } from '@/app/helpers/customer-type-helper';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import AddCategory from './categories/Categories.t/AddCategory';
import AddExistingFieldsCategory from './categories/Categories.t/AddExistingFieldsCategory';
import AddNewFieldsCategory from './categories/Categories.t/AddNewFieldsCategory';

export const ProfileBuilderContext = createContext({});

const ProfileBuilder = () => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(KeyboardSensor),
    useSensor(TouchSensor),
  );
  const dispatch = useDispatch();
  const { tabName, identifier } = useParams();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isNewCategory, setNewCategory] = useState(false);
  const [allCustomFields, setAllCustomFields] = useState([]);
  const [profileName, setProfileName] = useState('');
  const currentUser = useSelector(userProfileSelector);
  const customerTypeLabel = getCustomerTypeLabel(currentUser);

  const context =
    tabName === `${customerTypeLabel}s` ? 'PATIENT' : 'PROFILETYPE';

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
      setProfileName(
        `${
          customerTypeLabel?.charAt(0)?.toUpperCase() +
          customerTypeLabel?.slice(1)
        } Object Builder`,
      );
      initializePatientData();
    } else if (context === 'PROFILETYPE') {
      getProfileDetailsType(identifier).then((profileTypeDetails) => {
        const profileName = `${profileTypeDetails?.name} Object Builder`;
        setProfileName(profileName);
      });
      initializeCustomProfileData();
    }
  }, []);

  const [isAddCategoryDrop, setAddCategoryDrop, unsetAddCategoryDrop] =
    useBoolean(false);

  const [activeDragItem, setActiveDragItem] = useState(null);
  const [dragOverlayWidth, setDragOverlayWidth] = useState(null);
  const handleDragStart = (e) => {
    const source = e?.active?.id;
    if (source === DROPTYPE.AddCategory) setAddCategoryDrop();
    const node = document.querySelector(`[data-drag-id="${e?.active.id}"]`);

    if (node) {
      const rect = node?.getBoundingClientRect();
      setDragOverlayWidth(rect?.width);
    }
    setActiveDragItem(e);
  };

  const handleDragEnd = (e) => {
    setActiveDragItem(null);
    setDragOverlayWidth(null);

    const { active, over } = e;

    if (!over?.data?.current) return;
    const source = active?.data?.current?.type;
    const destination = over?.data?.current?.type;

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
    const draggableId = e?.active?.id.split('#')[0];
    setSelectedCategories((prevCategories) =>
      prevCategories.map((category) => {
        if (category?.identifier !== destination) return category;

        const fieldExists = category.fields.some(
          (field) => field.identifier === draggableId,
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
          { fieldReferenceId: draggableId },
        ];

        CustomFieldApi.updateCustomFiledGroup(category.identifier, {
          fields: updatedSavedFields,
        });

        const newField = allCustomFields.find(
          (item) => item.identifier === draggableId,
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
      if (e?.active?.id === fieldType.fieldType) {
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
          activeDragItem,
        }}
      >
        <HeaderContainer>
          <BasicLayoutHeader title={profileName} />
        </HeaderContainer>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          autoScroll={{
            layoutShiftCompensation: true,
            scrollableAncestors: true,
          }}
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
          <DragOverlay adjustScale={false} zIndex={9999}>
            {activeDragItem?.active?.data?.current?.type ===
              DROPTYPE.AddCategory && <AddCategory />}
            {activeDragItem?.active?.data?.current?.type ===
              DROPTYPE.AddField && (
              <AddNewFieldsCategory
                item={activeDragItem?.active?.data?.current?.item}
                fieldTypeImages={
                  activeDragItem?.active?.data?.current?.fieldTypeImages
                }
                overlayWidth={dragOverlayWidth}
              />
            )}
            {activeDragItem?.active?.data?.current?.type ===
              DROPTYPE.ExistingField && (
              <AddExistingFieldsCategory
                item={activeDragItem?.active?.data?.current?.item}
                fieldTypeImages={
                  activeDragItem?.active?.data?.current?.fieldTypeImages
                }
                index={activeDragItem?.active?.data?.current?.index}
                overlayWidth={dragOverlayWidth}
              />
            )}
          </DragOverlay>
        </DndContext>
      </ProfileBuilderContext.Provider>
    </ProfileBuilderContainer>
  );
};

export default ProfileBuilder;
