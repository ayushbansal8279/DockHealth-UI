import React from 'react';
import {
  CategoryContainer,
  AddCategory,
  CategoryTitle,
  CategoryLabel,
  SingleFieldWrapper,
  SingleField,
} from './styled';
import { Box } from '@mui/material';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { dummyFields } from '../../helper';

const ProfileBuilderCategories = () => {

  return (
    <CategoryContainer>
      <Box>
        <CategoryTitle>Add Category</CategoryTitle>
        <Droppable isDropDisabled droppableId="add-category-area-source">
          {(provided) => {
            // console.log(provided);
            return (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <Draggable draggableId="add-category" index={0}>
                  {(provided) => (
                    // @ts-ignore
                    <AddCategory
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      Add Category
                    </AddCategory>
                  )}
                </Draggable>
                {provided.placeholder}
              </div>
            );
          }}
        </Droppable>
      </Box>
      <Box mt={4}>
        <CategoryTitle>Fields</CategoryTitle>
        <Droppable isDropDisabled droppableId="add-fields-area-source">
          {(provided) => (
            // @ts-ignore
            <SingleFieldWrapper
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {dummyFields.map((item) => (
                <Draggable draggableId={item.dragId} index={item.index}>
                  {(provided) => (
                    // @ts-ignore
                    <SingleField
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div>
                        <img
                          style={{ width: 20, marginBottom: 10 }}
                          src={item.img}
                          alt={item.name}
                        />
                      </div>
                      <CategoryLabel>{item.name}</CategoryLabel>
                    </SingleField>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </SingleFieldWrapper>
          )}
        </Droppable>
      </Box>
    </CategoryContainer>
  );
};

export default ProfileBuilderCategories;
