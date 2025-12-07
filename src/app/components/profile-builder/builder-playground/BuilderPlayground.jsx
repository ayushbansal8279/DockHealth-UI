import React, { useContext } from 'react';
import {
  BuilderContainer,
  CategoryDropper,
  NewCategoryContainer,
  NewCategoryWrapper,
  CloseIcon,
} from './styled';
import SelectedCategory from '../SelectedCategory/SelectedCategory';
import TextField from '../TextField';
import { DragIndicator } from '@mui/icons-material';
import * as CustomFieldApi from 'api/custom-fields-api';
import { ProfileBuilderContext } from '../ProfileBuilder';
import { showGlobalAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import { useDispatch } from 'react-redux';
import { useDroppable } from '@dnd-kit/core';

const BuilderPlayground = ({ context, identifier }) => {
  const dispatch = useDispatch();
  const {
    selectedCategories,
    setSelectedCategories,
    setNewCategory,
    isNewCategory,
    isAddCategoryDrop,
    setCustomGroups,
  } = useContext(ProfileBuilderContext);
  const { setNodeRef, isOver, active, over } = useDroppable({
    id: 'add-category-area',
    data: {
      type: 'add-category-area',
    },
  });

  const onNewCategoryAdd = (value) => {
    const newCategory = {
      context,
      name: value,
      fields: [],
      isDefault: false,
    };
    if (context === 'PROFILETYPE') {
      newCategory.profileTypeIdentifier = identifier;
    }

    if (value) {
      setNewCategory(false);

      CustomFieldApi.saveCustomFiledGroup(newCategory).then((data) => {
        setSelectedCategories((prev) => [...prev, data]);
        setCustomGroups((prev) => [...prev, data]);
      });
    }
    dispatch(showGlobalAlert(AlertMessages.CREATED));
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
              placeholder="Add category name (Press Enter to save)"
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
    <BuilderContainer>
      {selectedCategories?.map((category) => {
        return <SelectedCategory category={category} />;
      })}
      {isNewCategory ? (
        <AddCategory></AddCategory>
      ) : (
        <CategoryDropper isAddCategoryDrop={isAddCategoryDrop} ref={setNodeRef}>
          Drag and drop a new category
        </CategoryDropper>
      )}
    </BuilderContainer>
  );
};

export default BuilderPlayground;
