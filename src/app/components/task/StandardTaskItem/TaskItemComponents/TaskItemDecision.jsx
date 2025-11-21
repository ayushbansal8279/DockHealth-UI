import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DecisionBox, DecisionSelect } from '../../styled';
import Tooltip from 'components/common/Tooltip/Tooltip';

const TaskItemDecision = ({
  task,
  templateBundleIdentifier,
  iconColorActive,
  outcomes = [],
  disabled,
  error = false,
  onSelect,
  clearError,
}) => {
  const options = useMemo(
    () =>
      outcomes
        .map((outcome) => ({
          label: outcome.name,
          value: outcome.taskOutcomeIdentifier,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [outcomes],
  );

  const [value, setValue] = useState(
    outcomes.find((outcome) => outcome.isSelected)?.taskOutcomeIdentifier ?? '',
  );

  useEffect(() => {
    const selectedOutcome = outcomes.find((outcome) => outcome.isSelected);
    const newValue = selectedOutcome?.taskOutcomeIdentifier ?? '';
    setValue(newValue);
  }, [outcomes, task?.taskIdentifier]);

  const isValidValue = useMemo(
    () => options.some((option) => option.value === value),
    [options, value],
  );

  const safeValue = isValidValue ? value : '';

  const selectedTask = useMemo(
    () =>
      outcomes.find((outcome) => outcome.taskOutcomeIdentifier === value)
        ?.name ?? null,
    [outcomes, value],
  );

  const handleValueChange = useCallback(
    (event) => {
      clearError();
      const { value: newValue } = event.target;
      onSelect(newValue, task, templateBundleIdentifier, () => {
        setValue(newValue);
      });
    },
    [clearError, onSelect, task, templateBundleIdentifier],
  );

  return (
    <Tooltip placement="top" title={selectedTask} arrow>
      <DecisionBox>
        <DecisionSelect
          name="decision"
          value={safeValue}
          options={options}
          onChange={handleValueChange}
          disabled={disabled}
          error={error}
          iconColorActive={iconColorActive}
        />
      </DecisionBox>
    </Tooltip>
  );
};

export default TaskItemDecision;
