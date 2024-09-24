import { Checkbox, Switch } from '@mui/material';
import { FieldArea, FieldIconContainer } from './styled';
import { DragIndicator, MoreVert } from '@mui/icons-material';
import React from 'react';
import TextField from '../TextField';
import { Field } from '../helper';

interface Prop {
  field: Field;
}

const SelectedField = ({ field }: Prop) => {
  return (
    <FieldArea>
      <DragIndicator />
      <Checkbox size="small" />
      <FieldIconContainer>
        <img
          style={{ width: '22px', height: '22px' }}
          src={field?.img}
          alt={field?.name}
        />
      </FieldIconContainer>
      <TextField border size="small" placeholder={field?.name} />
      <Switch defaultChecked />
      <MoreVert />
    </FieldArea>
  );
};

export default SelectedField;
