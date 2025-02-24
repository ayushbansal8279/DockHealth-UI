import React, { useContext, useState } from 'react';
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

const SelectedCategory = ({ category }) => {
  const { selectedCategories, setSelectedCategories } = useContext(
    ProfileBuilderContext,
  );
  const [isDragging, setDragging] = useState(false);

  const handleDeleteGroup = () => {
    CustomFieldApi.deleteCustomFiledGroup(category.identifier).then(() => {
      setSelectedCategories((prevCategories) =>
        prevCategories.filter(
          (category1) => category1.identifier !== category.identifier,
        ),
      );
    });
  };

  const handleCategoryUpdate = (value) => {
    const payload = {
      name: value,
    };
    CustomFieldApi.updateCustomFiledGroup(category.identifier, payload);
  };

  const handleDragStart = () => {
    setDragging(true);
  };

  const handleDragEnd = (e) => {
    setDragging(false);
    const sourceIndex = e.source.index;
    const destinationIndex = e.destination.index;

    if (sourceIndex !== destinationIndex) {
      let fields = [...category?.fields];
      const [removed] = fields.splice(sourceIndex, 1);

      fields.splice(destinationIndex, 0, removed);

      const aa = fields
        .filter((item) => item.identifier)
        .map((item) => {
          return {
            fieldReferenceId: item.identifier,
          };
        });

      CustomFieldApi.updateCustomFiledGroup(category.identifier, {
        fields: aa,
      });

      const updatedCategories = selectedCategories.map((item) => {
        if (item.identifier === category.identifier) {
          return {
            ...category,
            fields: fields,
          };
        }
        return category;
      });

      setSelectedCategories(updatedCategories);
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
            onBlur={handleCategoryUpdate}
          />
        </HeaderWrapper>
        {category.name !== 'Default Group' && (
          <DeletIcon onClick={handleDeleteGroup} />
        )}
      </CategoryHeader>
      <DragDropContext
        onDragStart={(e) => handleDragStart(e)}
        onDragEnd={(e) => handleDragEnd(e)}
      >
        <Droppable droppableId={category.identifier}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {isDragging && <PlaceholderDiv />}
              {category?.fields?.map((field, key) => {
                const id = field.identifier || field.tempId;
                return (
                  <Draggable draggableId={id} index={key}>
                    {(provided1) => (
                      <div
                        ref={provided1.innerRef}
                        {...provided1.draggableProps}
                        {...provided1.dragHandleProps}
                      >
                        <SelectedField
                          category={category}
                          field={field}
                          index={key}
                        />
                        {provided1.placeholder}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {isDragging && <PlaceholderDiv />}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {/* {category?.fields?.map((field) => {
        return <SelectedField category={category} field={field} />;
      })} */}
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
