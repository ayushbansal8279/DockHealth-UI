import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  CategoryHeader,
  FieldDropper,
  MainContainer,
  HeaderWrapper,
  DeletIcon,
  PlaceholderDiv,
} from './styled';
import { DragIndicator } from '@mui/icons-material';
import TextField from '../TextField';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import SelectedField from '../SelectedField/SelectedField';
import * as CustomFieldApi from 'api/custom-fields-api';
import { ProfileBuilderContext } from '../ProfileBuilder';
import { showGlobalAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';

const SelectedCategory = ({ category }) => {
  const dispatch = useDispatch();
  const { selectedCategories, setSelectedCategories } = useContext(
    ProfileBuilderContext,
  );

  const handleDeleteGroup = () => {
    CustomFieldApi.deleteCustomFiledGroup(category.identifier).then(() => {
      setSelectedCategories((prevCategories) =>
        prevCategories.filter(
          (category1) => category1.identifier !== category.identifier,
        ),
      );
    });
    dispatch(showGlobalAlert(AlertMessages.DELETED));
  };

  const handleCategoryUpdate = (value) => {
    const payload = {
      name: value,
    };
    CustomFieldApi.updateCustomFiledGroup(category.identifier, payload);
    dispatch(showGlobalAlert(AlertMessages.UPDATED));
  };


  const handleDragEnd = (e) => {
    if (!e.destination) return;

    const sourceIndex = e.source.index;
    const destinationIndex = e.destination.index;

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
      <DragDropContext
        onDragEnd={(e) => handleDragEnd(e)}
      >
        <Droppable droppableId={category.identifier}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {category?.fields?.map((field, key) => {
                const id = `${field.identifier || field.tempId}-${key}`;
                return (
                  <Draggable key={id} draggableId={id} index={key}>
                    {(provided1) => (
                      <div
                        ref={provided1.innerRef}
                        {...provided1.draggableProps}
                        {...provided1.dragHandleProps}
                      >
                        <>
                          <SelectedField
                            category={category}
                            field={field}
                            index={key}
                            key={key}
                          />
                          {provided1.placeholder}
                        </>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Droppable droppableId={category.identifier}>
        {(provided) => (
          <FieldDropper {...provided.droppableProps} ref={provided.innerRef}>
            Drag and drop field items
          </FieldDropper>
        )}
      </Droppable>
    </MainContainer>
  );
};

export default SelectedCategory;
