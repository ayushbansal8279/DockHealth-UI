import React, { useState, Dispatch, SetStateAction } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import {
  CategoryDropper,
  NewCategoryContainer,
  NewCategoryWrapper,
} from './styled';
import { Category } from '../helper';
import SelectedCategory from '../SelectedCategory/SelectedCategory';
import TextField from '../TextField';
import { DragIndicator, Close } from '@mui/icons-material';

interface Prop {
  isAddCategoryDrop: boolean;
  isAddFieldDrop: boolean;
  setSelectedCategories: Dispatch<SetStateAction<Category[]>>;
  selectedCategories: Category[];
  isNewCategory: boolean;
  setNewCategory: Dispatch<SetStateAction<boolean>>;
}

const BuilderPlayground = ({
  isAddCategoryDrop,
  isAddFieldDrop,
  setSelectedCategories,
  selectedCategories,
  isNewCategory,
  setNewCategory,
}: Prop) => {
  const onNewCategoryAdd = (value: string) => {
    setNewCategory(false);

    const categoryName = value;
    const newCategory: Category = {
      name: categoryName,
      fieldDropId: categoryName,
      index: 1,
      fields: [],
    };

    setSelectedCategories((prev) => [...prev, newCategory]);
  };
  console.log(selectedCategories);
  

  const AddCategory = () => {
    return (
      <>
        <NewCategoryContainer>
          <NewCategoryWrapper>
            <DragIndicator />
            <TextField
              border
              fontSize="18px"
              fontWeight="600"
              size="small"
              placeholder="Add Category Name "
              width="50%"
              onEnter={onNewCategoryAdd}
            />
          </NewCategoryWrapper>
          <Close />
        </NewCategoryContainer>
      </>
    );
  };

  return (
    <>
      {selectedCategories.map((category) => {
        return (
          <SelectedCategory
            category={category}
            isAddFieldDrop={isAddFieldDrop}
          />
        );
      })}
      {isNewCategory ? (
        <AddCategory></AddCategory>
      ) : (
        <Droppable droppableId="add-category-area">
          {(provided) => (
            // @ts-ignore
            <CategoryDropper
              isAddCategoryDrop={isAddCategoryDrop}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              Drag and drop a new Category
            </CategoryDropper>
          )}
        </Droppable>
      )}
    </>
  );
};

export default BuilderPlayground;
