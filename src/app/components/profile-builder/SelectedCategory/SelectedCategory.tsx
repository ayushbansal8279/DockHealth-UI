import React from 'react';
import { CategoryHeader, FieldDropper, MainContainer } from './styled';
import { DragIndicator } from '@mui/icons-material';
import TextField from '../TextField';
import { Droppable } from 'react-beautiful-dnd';
import { Category } from '../helper';
import SelectedField from '../SelectedField/SelectedField';

interface Prop {
  isAddFieldDrop: boolean;
  category: Category;
}

const SelectedCategory = ({ isAddFieldDrop, category }: Prop) => {
  return (
    <MainContainer>
      <CategoryHeader>
        <DragIndicator />
        <TextField
          value={category.name}
          fontSize="18px"
          fontWeight="600"
          size="small"
          placeholder="Add Category Name "
          width="50%"
        />
      </CategoryHeader>
      {category.fields.map((field) => {
        return <SelectedField field={field} />;
      })}
      <Droppable droppableId={category.fieldDropId}>
        {(provided) => (
          // @ts-ignore
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
