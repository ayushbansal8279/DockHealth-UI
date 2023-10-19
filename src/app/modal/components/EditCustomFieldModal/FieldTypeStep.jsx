import React from 'react';
import { useSelector } from 'react-redux';
import { FIELD_TYPES, FieldType } from 'helpers/field-type-helpers';
import { userHasCustomProfilesFeatureSelector } from 'selectors/user-selectors';
import {
  FiledTypesContainer,
  FiledTypeButton,
  FieldTypeImage,
  FiledTypeTitle,
  FiledTypeDescription,
} from './styled';

const FiledTypeStep = ({ onSelect }) => {
  const userHasCustomProfilesAvailable = useSelector(
    userHasCustomProfilesFeatureSelector,
  );
  let fieldTypeOptions = FIELD_TYPES;
  if (!userHasCustomProfilesAvailable) {
    fieldTypeOptions = FIELD_TYPES.filter(
      (ft) => ft.key !== FieldType.RELATIONSHIP,
    );
  }

  return (
    <FiledTypesContainer>
      {fieldTypeOptions.map(({ key, image, title, description }) => (
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
