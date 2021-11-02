import React from 'react';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { CustomFieldWidthConfig, FieldType } from 'helpers/field-type-helpers';
import { trunc } from 'helpers/utility-functions';
import { Typography } from '@material-ui/core';
import { StandardTaskItemCell } from './styled';

const TaskItemText = ({ value = '' }) => {
  return (
    <StandardTaskItemCell
      paddingLeft="tiny"
      paddingRight="tiny"
      width={CustomFieldWidthConfig[FieldType.TEXT]}
      justify="center"
      onContextMenu={event => {
        event.stopPropagation();
      }}
    >
      <Tooltip placement="top" title={value}>
        <Typography>{trunc(value, 15)}</Typography>
      </Tooltip>
    </StandardTaskItemCell>
  );
};

export default TaskItemText;
