import React from 'react';
import PriorityFlag from 'img/priority-flag';
import { onTaskDrawerTaskPriorityChanged } from 'helpers/ga-event-helper';
import FormSelect from 'components/common/Select/FormSelect';
import initializePrioritySectionHooks, { PRIORITIES } from './hooks';
import { PriorityFieldContainer, PriorityFlagContainer } from './styled';

const priorityOptions = PRIORITIES.map(({ value, label, color }) => ({
  key: value,
  value,
  label,
  OptionIcon: <PriorityFlag color={color} />,
}));

const PRIORITY_FIELD_NAME = 'priority';

const PrioritySection = ({ setAutoSaveVisible, onTaskUpdate }) => {
  const {
    currentPriorityFlagColor,
    saveTaskPriority,
    setValue,
  } = initializePrioritySectionHooks({ setAutoSaveVisible, onTaskUpdate });

  const selectOption = value => {
    if (value === 'NONE') {
      setValue(PRIORITY_FIELD_NAME, null); // default to null since we just clear the selection
    } else {
      setValue(PRIORITY_FIELD_NAME, value);
    }

    onTaskDrawerTaskPriorityChanged(value);
    saveTaskPriority({ newTaskPriority: value });
  };

  return (
    <PriorityFieldContainer>
      <PriorityFlagContainer>
        <PriorityFlag color={currentPriorityFlagColor} />
      </PriorityFlagContainer>
      <FormSelect
        label="Priority"
        options={priorityOptions}
        name={PRIORITY_FIELD_NAME}
        required={false}
        onChange={selectOption}
      />
    </PriorityFieldContainer>
  );
};

export default PrioritySection;
