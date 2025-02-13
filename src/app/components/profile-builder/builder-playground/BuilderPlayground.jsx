import React, { useContext } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import {
  CategoryDropper,
  NewCategoryContainer,
  NewCategoryWrapper,
  CloseIcon,
} from './styled';
import SelectedCategory from '../SelectedCategory/SelectedCategory';
import TextField from '../TextField';
import { DragIndicator } from '@mui/icons-material';
import * as ProfileTypeFieldApi from 'api/profile-type-field-api';
import { ProfileBuilderContext } from '../ProfileBuilder';

const BuilderPlayground = () => {
  const {
    selectedCategories,
    setSelectedCategories,
    setNewCategory,
    isNewCategory,
    isAddCategoryDrop,
  } = useContext(ProfileBuilderContext);

  const onNewCategoryAdd = (value) => {
    const newCategory = {
      context: 'PATIENT',
      name: value,
      fields: [],
      isDefault: true,
    };

    if (value) {
      setNewCategory(false);

      ProfileTypeFieldApi.saveCustomFiledGroup(newCategory).then((data) => {
        setSelectedCategories((prev) => [...prev, data]);
      });
    }
  };

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
          <CloseIcon onClick={() => setNewCategory(false)} />
        </NewCategoryContainer>
      </>
    );
  };

  return (
    <>
      {selectedCategories.map((category) => {
        return <SelectedCategory category={category} />;
      })}
      {isNewCategory ? (
        <AddCategory></AddCategory>
      ) : (
        <Droppable droppableId="add-category-area">
          {(provided) => (
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
