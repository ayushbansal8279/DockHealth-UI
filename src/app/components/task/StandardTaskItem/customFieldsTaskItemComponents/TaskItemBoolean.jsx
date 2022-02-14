/* eslint-disable import/extensions */
import React from 'react';
import { CustomFieldWidthConfig, FieldType } from 'helpers/field-type-helpers';
import { Typography } from '@material-ui/core';
import { capitalize } from 'helpers/capitalize';
import { DecisionBox, StandardTaskItemCell } from './styled';

const TaskItemBoolean = ({ value, onClick }) => {
  return (
    <StandardTaskItemCell
      width={CustomFieldWidthConfig[FieldType.BOOL]}
      onClick={onClick}
    >
      <DecisionBox>
        <Typography>{value ? capitalize(value) : ''}</Typography>
      </DecisionBox>
    </StandardTaskItemCell>
  );
};
export default TaskItemBoolean;
