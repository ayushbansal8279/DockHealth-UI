/* eslint-disable import/extensions */
import React, { useState, useCallback, useMemo } from 'react';
import {
  DecisionBox,
  StandardTaskItemCell,
  DecisionSelect,
} from '../../styled';

const TaskItemDecision = ({
  outcomes,
  onSelect,
  dispatch,
  task,
  templateBundleIdentifier,
  disabled,
  error = false,
  clearError,
}) => {
  const initialOptions = useMemo(
    () =>
      outcomes?.map(({ taskOutcomeIdentifier, name }) => ({
        label: name,
        value: taskOutcomeIdentifier,
      })),
    [outcomes],
  );
  const initialValue = useMemo(() => {
    const initialOutcome = outcomes?.filter(({ isSelected }) => isSelected);
    return initialOutcome.length > 0
      ? initialOutcome[0].taskOutcomeIdentifier
      : null;
  }, [outcomes]);
  const [value, setValue] = useState(initialValue);
  const [options] = useState(initialOptions);

  const handleChange = useCallback(
    ({ target }) => {
      clearError();
      setValue(target.value);
      dispatch(onSelect(target.value, task, templateBundleIdentifier));
    },
    [dispatch, onSelect, task, templateBundleIdentifier, clearError],
  );

  return (
    <StandardTaskItemCell width="164px">
      <DecisionBox>
        <DecisionSelect
          name="decision"
          value={value}
          onChange={handleChange}
          error={error}
          options={options}
          disabled={disabled}
        />
      </DecisionBox>
    </StandardTaskItemCell>
  );
};
export default TaskItemDecision;
