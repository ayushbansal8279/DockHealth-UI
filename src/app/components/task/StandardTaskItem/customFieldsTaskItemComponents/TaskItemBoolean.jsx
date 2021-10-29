/* eslint-disable import/extensions */
import React from 'react';
import { CustomFieldWidthConfig, FieldType } from 'helpers/field-type-helpers';
import { Typography } from '@material-ui/core';
import { DecisionBox, StandardTaskItemCell } from './styled';

const TaskItemBoolean = ({ value }) => {
  return (
    <StandardTaskItemCell width={CustomFieldWidthConfig[FieldType.BOOL]}>
      <DecisionBox>
        <Typography>{value}</Typography>
      </DecisionBox>
    </StandardTaskItemCell>
  );
};
export default TaskItemBoolean;
