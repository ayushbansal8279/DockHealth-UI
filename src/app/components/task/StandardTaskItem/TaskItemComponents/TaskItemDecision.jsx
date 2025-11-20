import React, { useState } from 'react';
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
  const options = outcomes
    .map((outcome) => ({
      label: outcome.name,
      value: outcome.taskOutcomeIdentifier,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const [value, setValue] = useState(
    outcomes.find((outcome) => outcome.isSelected)?.taskOutcomeIdentifier ?? '',
  );

  const selectedTask =
    outcomes.find((outcome) => outcome.isSelected)?.name ?? null;

  const handleValueChange = (event) => {
    clearError();
    const { value: newValue } = event.target;
    onSelect(newValue, task, templateBundleIdentifier, () =>
      setValue(newValue),
    );
  };

  return (
    <Tooltip placement="top" title={selectedTask} arrow>
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
    </Tooltip>
  );
};

export default TaskItemDecision;
