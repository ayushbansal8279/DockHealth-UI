import React from 'react';
import styled from 'styled-components';

import DateTimeSelect from '../common/DateTimeSelect';

const DueDateClearButton = styled.div`
  align-items: center;
  color: #e40909;
  cursor: pointer;
  display: inline-flex;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1rem;
  margin-left: 0.5ch;
`;

export default ({
  newDueDate,
  setNewDueDate,
  saveDueDate,
  taskId,
  newDueDateMoment,
  clearDueDate,
  SectionButtonContainer,
  SectionButton,
}) => (
  <DateTimeSelect
    value={newDueDate}
    onChange={updatedDueDate => {
      setNewDueDate(updatedDueDate);
      if (taskId) {
        saveDueDate({ updatedDueDate });
      }
    }}
    label="Set a due date"
    showTimeSelect={false}
    anchorOrigin={{
      vertical: 'center',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'center',
      horizontal: 'center',
    }}
  >
    {({ open }) => (
      <>
        <SectionButtonContainer>
          <SectionButton clickable onClick={open}>
            {newDueDateMoment.isValid()
              ? newDueDateMoment.format('MMM. D, YYYY')
              : 'Set a due date'}
          </SectionButton>
          {newDueDateMoment.isValid() && (
            <DueDateClearButton onClick={clearDueDate}>×</DueDateClearButton>
          )}
        </SectionButtonContainer>
      </>
    )}
  </DateTimeSelect>
);
