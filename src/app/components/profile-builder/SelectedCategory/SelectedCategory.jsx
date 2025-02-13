import React, { useContext } from 'react';
import {
  CategoryHeader,
  FieldDropper,
  MainContainer,
  HeaderWrapper,
  DeletIcon,
} from './styled';
import { DragIndicator } from '@mui/icons-material';
import TextField from '../TextField';
import { Droppable } from 'react-beautiful-dnd';
import SelectedField from '../SelectedField/SelectedField';
import * as CustomFieldApi from 'api/custom-fields-api';
import { ProfileBuilderContext } from '../ProfileBuilder';

const SelectedCategory = ({ category }) => {
  const { isAddFieldDrop, setSelectedCategories } = useContext(
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
  };

  const handleCategoryUpdate = (value) => {
    const payload = {
      name: value,
    };
    ProfileTypeFieldApi.updateCustomFiledGroup(category.identifier, payload);
  };

  return (
    <MainContainer>
      <CategoryHeader>
        <HeaderWrapper>
          <DragIndicator />
          <TextField
            value={category.name}
            fontSize="18px"
            fontWeight="600"
            size="small"
            placeholder="Add Category Name "
            width="50%"
            onEnter={handleCategoryUpdate}
          />
        </HeaderWrapper>
        <DeletIcon onClick={handleDeleteGroup} />
      </CategoryHeader>
      {category?.fields?.map((field) => {
        return <SelectedField category={category} field={field} />;
      })}
      <Droppable droppableId={category.identifier}>
        {(provided) => (
          <FieldDropper
            {...provided.droppableProps}
            ref={provided.innerRef}
            isAddFieldDrop={isAddFieldDrop}
          >
            Drag and drop field items
          </FieldDropper>
        )}
      </Droppable>
    </MainContainer>
  );
};

export default SelectedCategory;
