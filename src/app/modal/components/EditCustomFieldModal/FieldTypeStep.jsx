import React from 'react';
import { FIELD_TYPES } from 'helpers/field-type-helpers';
import {
  FiledTypesContainer,
  FiledTypeButton,
  FieldTypeImage,
  FiledTypeTitle,
  FiledTypeDescription,
} from './styled';

const FiledTypeStep = ({ onSelect }) => {
  return (
    <FiledTypesContainer>
      {FIELD_TYPES.map(({ key, image, title, description }) => (
        <FiledTypeButton key={key} onClick={() => onSelect(key)}>
          <FieldTypeImage src={image} alt={title} />
          <FiledTypeTitle>{title}</FiledTypeTitle>
          <FiledTypeDescription>{description}</FiledTypeDescription>
        </FiledTypeButton>
      ))}
    </FiledTypesContainer>
  );
};

export default FiledTypeStep;
