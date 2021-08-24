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
      setValue(target.value);
      dispatch(onSelect(target.value, task, templateBundleIdentifier));
    },
    [dispatch, onSelect, task, templateBundleIdentifier],
  );

  return (
    <StandardTaskItemCell width="164px">
      <DecisionBox>
        <DecisionSelect
          value={value}
          onChange={handleChange}
          error={false}
          options={options}
          disabled={task.isSelected}
        />
      </DecisionBox>
    </StandardTaskItemCell>
  );
};
export default TaskItemDecision;
