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
import {
  createProfileFieldType,
  getAllProfileFieldTypes,
} from '@/app/api/profile-type-field-api';
import {
  getProfileDetailsType,
  getAllProfileTypes,
} from '@/app/api/profile-type-api';
import { showGlobalAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import { userProfileSelector } from '@/app/selectors/user-selectors';
import { getCustomerTypeLabel } from '@/app/helpers/customer-type-helper';
import { TargetType } from '@/app/helpers/custom-fields-helpers';
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
  const { identifier } = useParams();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isNewCategory, setNewCategory] = useState(false);
  const [allCustomFields, setAllCustomFields] = useState([]);
  const [profileName, setProfileName] = useState('');
  const [context, setContext] = useState(null);
  const [profileType, setProfileType] = useState(null);

  const getContextFromProfileType = (profile) => {
    if (!profile) return null;

    const isPredefinedType = profile.contextType === 'PREDEFINED';

    if (isPredefinedType) {
      const name = profile.name?.toLowerCase() || '';
      if (name.includes('patient')) return TargetType.PATIENT;
      if (name.includes('provider') || name.includes('user'))
        return TargetType.PROVIDER;
      if (name.includes('task')) return TargetType.TASK;
      if (name.includes('workflow')) return 'WORKFLOW';
    }

    return 'PROFILETYPE';
  };

  useEffect(() => {
    const fetchAllCustomFields = async () => {
      const allCustomFields = await CustomFieldApi.getAllCustomFields();
      setAllCustomFields(allCustomFields);
    };
    fetchAllCustomFields();
  }, []);

  const initializePredefinedData = async (
    profileContext,
    profileIdentifier,
  ) => {
    try {
      const [customGroups, allCustomFields, defaultFields] = await Promise.all([
        CustomFieldApi.searchCustomFiledGroups(profileContext),
        getAllProfileFieldTypes(profileIdentifier),
        CustomFieldApi.getDefauldFields(profileContext),
      ]);

      const enhancedDefaultFields = convertDefaultFields(defaultFields);
      const customFields = [...enhancedDefaultFields, ...allCustomFields];

      const hasDefaultFields = customGroups.some(
        (group) => group.name === 'Default Group',
      );

      if (!hasDefaultFields) {
        const defaultCategory = {
          context: profileContext,
          name: 'Default Group',
          fields: getDefaultsRefrenceIds(defaultFields, profileContext),
          isDefault: true,
          displayOrder: 0,
        };

        const savedDefault = await CustomFieldApi.saveCustomFiledGroup(
          defaultCategory,
        );
        customGroups.push(savedDefault);
      }
      customGroups.sort((a, b) => {
        if (a.name === 'Default Group') return -1;
        if (b.name === 'Default Group') return 1;
        return a.displayOrder - b.displayOrder;
      });

      const processedGroups = customGroups.map((category) => {
        if (!category.fields) {
          return category;
        }

        const enrichedFields = category.fields.map((field) => {
          const matchingField = customFields?.find(
            (customField) =>
              customField.identifier === field.fieldReferenceId ||
              customField.customFieldIdentifier === field.fieldReferenceId,
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

      const processedGroups = customGroups.map((category) => {
        if (!category.fields) {
          return category;
        }

        const enrichedFields = category.fields.map((field) => {
          const matchingField = allCustomFields?.find(
            (customField) =>
              customField.identifier === field.fieldReferenceId ||
              customField.customFieldIdentifier === field.fieldReferenceId,
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
    const fetchProfileType = async () => {
      if (!identifier) return;

      try {
        const predefinedTypes = await getAllProfileTypes('PREDEFINED');
        const foundPredefined = predefinedTypes.find(
          (pt) => pt.identifier === identifier,
        );

        if (foundPredefined) {
          setProfileType(foundPredefined);
        } else {
          const profileTypeDetails = await getProfileDetailsType(identifier);
          setProfileType(profileTypeDetails);
        }
      } catch (error) {
        dispatch(showGlobalErrorAlert());
      }
    };

    fetchProfileType();
  }, [identifier]);

  useEffect(() => {
    if (!profileType) return;

    const profileContext = getContextFromProfileType(profileType);
    setContext(profileContext);

    const name = profileType.name || '';
    const isPredefinedType = profileType.contextType === 'PREDEFINED';
    if (isPredefinedType) {
      const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
      setProfileName(`${capitalizedName} Object Builder`);
    } else {
      setProfileName(`${name} Object Builder`);
    }
  }, [profileType]);

  useEffect(() => {
    if (!profileType || !context) return;

    const isPredefinedType = profileType.contextType === 'PREDEFINED';
    if (isPredefinedType) {
      initializePredefinedData(context, profileType.identifier);
    } else {
      initializeCustomProfileData();
    }
  }, [profileType, context]);

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

  const handleExistingFieldDrop = async (e, destination) => {
    const draggableId = e?.active?.id.split('#')[0];
    const updatedCategories = await Promise.all(
      selectedCategories.map(async (category) => {
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

        const newProfileField = await createProfileFieldType({
          customFieldIdentifier: draggableId,
          profileType: {
            identifier: identifier,
          },
        });

        const updatedSavedFields = [
          ...savedFields,
          { fieldReferenceId: newProfileField.identifier },
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
    setSelectedCategories(updatedCategories);
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
