import React from 'react';
import Member from 'components/members/Member';
import HighPriorityLabel from 'img/priority-high-label-icon.svg';
import UnassignedIcon from 'img/unassigned.svg';
import TaskItemStatus from 'views/Task/NewTasksView/TaskItem/TaskItemStatus';
import { StyledFilterRow, StyledUnassignedIcon } from './styled';

const getPriorityConfig = priority => {
  switch (priority) {
    case 'HIGH':
      return {
        label: 'Priority',
        icon: () => <img src={HighPriorityLabel} alt="Priority icon" />,
      };
    case 'LOW':
      return {
        label: 'No Priority',
      };
    default:
      return {};
  }
};

const PeopleFilterRowComponent = ({
  displayValue,
  reference,
  isSelected,
  onClick,
}) => (
  <StyledFilterRow isSelected={isSelected} onClick={onClick}>
    <Member member={reference} size={25} />
    <span>{displayValue}</span>
  </StyledFilterRow>
);

const StatusFilterRowComponent = ({ displayValue, isSelected, onClick }) => (
  <StyledFilterRow isSelected={isSelected} onClick={onClick}>
    <TaskItemStatus workflowStatus={displayValue} />
  </StyledFilterRow>
);

const PriorityFilterRowComponent = ({
  displayValue: priority,
  isSelected,
  onClick,
}) => {
  const { label, icon: IconComponent } = getPriorityConfig(priority);

  return (
    <StyledFilterRow isSelected={isSelected} onClick={onClick}>
      {IconComponent && <IconComponent />}
      <span>{label}</span>
    </StyledFilterRow>
  );
};

const StandardFilterRowComponent = ({ displayValue, isSelected, onClick }) => (
  <StyledFilterRow isSelected={isSelected} onClick={onClick}>
    <span>{displayValue}</span>
  </StyledFilterRow>
);

export const FilterRowUnassigned = ({ hasAvatars, isSelected, onClick }) => (
  <StyledFilterRow isSelected={isSelected} onClick={onClick}>
    {hasAvatars && (
      <StyledUnassignedIcon src={UnassignedIcon} alt="Unassigned" />
    )}
    <span>Unassigned</span>
  </StyledFilterRow>
);

export const getFilterRowComponent = type => {
  switch (type) {
    case 'PEOPLE':
      return PeopleFilterRowComponent;
    case 'PRIORITY':
      return PriorityFilterRowComponent;
    case 'STATUS':
      return StatusFilterRowComponent;
    default:
      return StandardFilterRowComponent;
  }
};
