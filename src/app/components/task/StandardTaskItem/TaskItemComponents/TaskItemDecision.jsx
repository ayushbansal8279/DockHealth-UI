import React, { useEffect, useMemo, useCallback, useState } from 'react';
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

  const [value, setValue] = useState('');

  useEffect(() => {
    setValue('');
  }, [task?.taskIdentifier]);

  const isValidValue = useMemo(
    () => options.some((option) => option.value === value),
    [options, value],
  );

  const safeValue = isValidValue ? value : '';

  const selectedOutcome = useMemo(
    () => outcomes.find((outcome) => outcome.taskOutcomeIdentifier === value),
    [outcomes, value],
  );
  const selectedTask = useMemo(
    () => selectedOutcome?.name ?? null,
    [selectedOutcome],
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

  // Early return for loading state
  if (!outcomes || outcomes.length === 0) {
    return (
      <DecisionBox>
        <DecisionSelect
          name="decision"
          value=""
          options={[]}
          disabled={true}
          error={error}
          iconColorActive={iconColorActive}
        />
      </DecisionBox>
    );
  }

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
