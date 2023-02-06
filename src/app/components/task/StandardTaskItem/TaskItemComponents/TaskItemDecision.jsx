import React, { useState } from 'react';
import { DecisionBox, DecisionSelect } from '../../styled';

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
  const options = outcomes
    .map(outcome => ({
      label: outcome.name,
      value: outcome.taskOutcomeIdentifier,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const [value, setValue] = useState(
    outcomes.find(outcome => outcome.isSelected)?.taskOutcomeIdentifier ?? null,
  );

  const handleValueChange = event => {
    clearError();
    const { value: newValue } = event.target;
    onSelect(newValue, task, templateBundleIdentifier, () =>
      setValue(newValue),
    );
  };

  return (
    <DecisionBox>
      <DecisionSelect
        name="decision"
        value={value}
        options={options}
        onChange={handleValueChange}
        disabled={disabled}
        error={error}
        iconColorActive={iconColorActive}
      />
    </DecisionBox>
  );
};

export default TaskItemDecision;
