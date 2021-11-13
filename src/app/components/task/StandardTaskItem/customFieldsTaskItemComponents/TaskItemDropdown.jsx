/* eslint-disable import/extensions */
import React, { useMemo } from 'react';
import { CustomFieldWidthConfig, FieldType } from 'helpers/field-type-helpers';
import { Typography } from '@material-ui/core';
import { StandardTaskItemCell } from './styled';

const TaskItemDropdown = ({
  value,
  field: { options: initialOptions },
  onClick,
}) => {
  const options = useMemo(
    () =>
      initialOptions?.map(({ identifier, name }) => ({
        label: name,
        value: identifier,
      })),
    [initialOptions],
  );

  const chosenOptionName = useMemo(() => {
    const chosenOption = options.find(option => option.value === value);
    return chosenOption?.label || '';
  }, [options, value]);

  return (
    <StandardTaskItemCell
      width={CustomFieldWidthConfig[FieldType.DROPDOWN]}
      onClick={onClick}
    >
      <Typography>{chosenOptionName}</Typography>
    </StandardTaskItemCell>
  );
};
export default TaskItemDropdown;
