import React, { ChangeEvent, FC, useState } from 'react';
import { Tooltip } from '@mui/material';
import EditPencil from '@/app/img/EditPencil';

import {
  Container,
  EditableInput,
  LabelText,
  StyledEditButton,
} from './styled';

type EditableLabelProps = {
  value?: string;
  onEdit?: (newValue: string) => void;
  width?: string;
  placeholder?: string;
  editIconTitle?: string;
};

export const EditableLabel: FC<EditableLabelProps> = ({
  value = '',
  onEdit,
  width = '250px',
  placeholder = 'Enter value',
  editIconTitle = 'Edit',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleEditClick = () => setIsEditing(true);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setInputValue(e.target.value);

  const handleBlur = () => {
    setIsEditing(false);
    if (inputValue !== value) onEdit?.(inputValue.trim());
  };

  return (
    <Container>
      {isEditing ? (
        <EditableInput
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
          width={width}
          placeholder={placeholder}
        />
      ) : (
        <>
          <Tooltip title={inputValue} placement="top">
            <LabelText width={width}>
              {inputValue}
            </LabelText>
          </Tooltip>
          <Tooltip placement="top" title={editIconTitle}>
            <StyledEditButton onClick={handleEditClick} size="small">
              <EditPencil />
            </StyledEditButton>
          </Tooltip>
        </>
      )}
    </Container>
  );
};