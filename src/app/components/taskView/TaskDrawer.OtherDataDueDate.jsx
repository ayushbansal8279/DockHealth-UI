import React from 'react';
import styled from 'styled-components';
import palette from 'app/palette';
import DateTimeSelect from '../common/DateTimeSelect';

const DueDateClearButton = styled.div`
  align-items: center;
  color: ${palette.error};
  cursor: pointer;
  display: inline-flex;
  font-size: 1rem;
  height: 100%;
  line-height: 1rem;
  margin-left: 0.5ch;
  transition: filter 0.25s ease-out;
  will-change: filter;

  &:hover {
    filter: brightness(1.25);
  }
`;

export default ({
  newDueDate,
  setNewDueDate,
  saveDueDate,
  taskIdentifier,
  newDueDateMoment,
  clearDueDate,
  SectionButtonContainer,
  SectionButton,
  isOverdue,
}) => (
  <DateTimeSelect
    value={newDueDate}
    onChange={updatedDueDate => {
      setNewDueDate(updatedDueDate);
      if (taskIdentifier) {
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
      <SectionButtonContainer>
        <SectionButton
          color={isOverdue ? palette.error : undefined}
          clickable
          onClick={open}
        >
          {newDueDateMoment.isValid()
            ? newDueDateMoment.format('MMM. D, YYYY')
            : 'Set a due date'}
        </SectionButton>
        {newDueDateMoment.isValid() && (
          <DueDateClearButton onClick={clearDueDate}>×</DueDateClearButton>
        )}
      </SectionButtonContainer>
    )}
  </DateTimeSelect>
);
