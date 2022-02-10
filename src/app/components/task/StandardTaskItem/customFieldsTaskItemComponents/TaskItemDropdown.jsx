/* eslint-disable import/extensions */
import React, { useMemo } from 'react';
import { Typography } from '@material-ui/core';

const TaskItemDropdown = ({ value, field: { options: initialOptions } }) => {
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

  return <Typography>{chosenOptionName}</Typography>;
};
export default TaskItemDropdown;
