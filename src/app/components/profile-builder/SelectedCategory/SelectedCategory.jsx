import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import {
  CategoryHeader,
  FieldDropper,
  MainContainer,
  HeaderWrapper,
  DeletIcon,
} from './styled';
import { DragIndicator } from '@mui/icons-material';
import TextField from '../TextField';
import SelectedField from '../SelectedField/SelectedField';
import * as CustomFieldApi from 'api/custom-fields-api';
import { ProfileBuilderContext } from '../ProfileBuilder';
import { showGlobalAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import { SortableContext } from '@dnd-kit/sortable';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

const SelectedCategory = ({ category }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(KeyboardSensor),
    useSensor(TouchSensor),
  );
  const dispatch = useDispatch();
  const {
    selectedCategories,
    setSelectedCategories,
    removeCustomGroup,
    setCustomGroups,
    isPredefinedProfile,
  } = useContext(ProfileBuilderContext);
  const { setNodeRef } = useDroppable({
    id: category?.identifier,
    data: { type: category.identifier },
  });

  const handleDeleteGroup = () => {
    CustomFieldApi.deleteCustomFiledGroup(category.identifier).then(() => {
      setSelectedCategories((prevCategories) =>
        prevCategories.filter(
          (category1) => category1.identifier !== category.identifier,
        ),
      );
      removeCustomGroup?.(category.identifier);
    });
    dispatch(showGlobalAlert(AlertMessages.DELETED));
  };

  const handleCategoryUpdate = (value) => {
    const payload = {
      name: value,
    };
    CustomFieldApi.updateCustomFiledGroup(category.identifier, payload).then(
      (updatedGroup) => {
        setCustomGroups((prev) =>
          prev.map((cg) =>
            cg.identifier === category.identifier ? updatedGroup : cg,
          ),
        );
      },
    );
    dispatch(showGlobalAlert(AlertMessages.UPDATED));
  };

  const handleDragEnd = (e) => {
    const { active, over } = e;

    if (!over) return;

    const sourceIndex = active?.data?.current?.sortable?.index;
    const destinationIndex = over?.data?.current?.sortable?.index;

    const draggedField = category?.fields?.[sourceIndex];
    const isDefaultField = draggedField?.contextType === 'DEFAULT';

    if (isPredefinedProfile && isDefaultField) {
      return;
    }

    if (isPredefinedProfile && !isDefaultField) {
      const destinationField = category?.fields?.[destinationIndex];
      const isDestinationDefault = destinationField?.contextType === 'DEFAULT';

      if (isDestinationDefault) {
        return;
      }
    }

    if (sourceIndex !== destinationIndex) {
      let fields = [...category?.fields];
      const [removed] = fields.splice(sourceIndex, 1);
      fields.splice(destinationIndex, 0, removed);

      const updatedFiled = fields
        .filter((item) => item.identifier)
        .map((item) => ({
          fieldReferenceId: item.identifier,
        }));

      CustomFieldApi.updateCustomFiledGroup(category.identifier, {
        fields: updatedFiled,
      }).then((updatedGroup) => {
        setCustomGroups((prev) =>
          prev.map((cg) =>
            cg.identifier === category.identifier ? updatedGroup : cg,
          ),
        );
      });

      const updatedCategories = selectedCategories.map((item) =>
        item.identifier === category.identifier ? { ...item, fields } : item,
      );

      setSelectedCategories(updatedCategories);
      dispatch(showGlobalAlert(AlertMessages.UPDATED));
    }
  };

  return (
    <MainContainer>
      <CategoryHeader>
        <HeaderWrapper>
          <DragIndicator />
          <TextField
            disabled={category.name === 'Default Group'}
            value={category.name}
            fontSize="18px"
            fontWeight="600"
            size="small"
            placeholder="Add Category Name"
            width="50%"
            onEnter={handleCategoryUpdate}
          />
        </HeaderWrapper>
        {category.name !== 'Default Group' && (
          <DeletIcon onClick={handleDeleteGroup} />
        )}
      </CategoryHeader>
      <DndContext sensors={sensors} onDragEnd={(e) => handleDragEnd(e)}>
        <SortableContext
          items={(category?.fields ?? [])?.map(
            (field) => field?.identifier || field?.tempId,
          )}
        >
          {category?.fields?.map((field, key) => {
            const id = `${field.identifier || field.tempId}-${key}`;
            return (
              <SelectedField
                category={category}
                field={field}
                index={key}
                key={key}
                id={field.identifier || field.tempId}
              />
            );
          })}
        </SortableContext>
      </DndContext>
      <FieldDropper ref={setNodeRef}>Drag and drop field items</FieldDropper>
    </MainContainer>
  );
};

export default SelectedCategory;
