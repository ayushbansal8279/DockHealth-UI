import React, { cloneElement } from 'react';
import Member from 'components/members/Member';
import HighPriorityLabel from 'img/priority-high-label-icon.svg';
import UnassignedIcon from 'img/unassigned.svg';
import TaskItemStatus from 'components/common/TaskItem/StandardTaskItem/TaskItemStatus';
import DueDateRangePicker from './DueDateRangePicker';
import {
  StyledFilterRow,
  StyledUnassignedIcon,
  MemberOptionLabel,
  OptionLabel,
  OptionCount,
} from './styled';

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
  taskCount,
  reference,
  isSelected,
  onClick,
}) => (
  <StyledFilterRow isSelected={isSelected} onClick={onClick}>
    <Member member={reference} size={25} />
    <MemberOptionLabel>{displayValue}</MemberOptionLabel>
    <OptionCount>{taskCount || '0'}</OptionCount>
  </StyledFilterRow>
);

const StatusFilterRowComponent = ({
  itemKey,
  taskCount,
  isSelected,
  onClick,
}) => {
  return (
    <StyledFilterRow isSelected={isSelected} onClick={onClick}>
      <TaskItemStatus workflowStatus={itemKey} labelWidth="180px" />
      <OptionCount>{taskCount || '0'}</OptionCount>
    </StyledFilterRow>
  );
};

const PriorityFilterRowComponent = ({
  itemKey: priority,
  taskCount,
  isSelected,
  onClick,
}) => {
  const { label, icon: IconComponent } = getPriorityConfig(priority);

  return (
    <StyledFilterRow isSelected={isSelected} onClick={onClick}>
      {IconComponent && <IconComponent />}
      <OptionLabel>{label}</OptionLabel>
      <OptionCount>{taskCount || '0'}</OptionCount>
    </StyledFilterRow>
  );
};

const StandardFilterRowComponent = ({
  displayValue,
  taskCount,
  isSelected,
  onClick,
}) => (
  <StyledFilterRow isSelected={isSelected} onClick={onClick}>
    <OptionLabel>{displayValue}</OptionLabel>
    <OptionCount>{taskCount || '0'}</OptionCount>
  </StyledFilterRow>
);

const DateFilterRowComponent = ({
  isSelected,
  displayValue,
  taskCount,
  onClick,
  itemKey,
  dueDateChange,
  customDueDateStart,
  customDueDateEnd,
}) =>
  itemKey.includes('RANGE') ? (
    <DueDateRangePicker
      label={displayValue}
      dueDateChange={dueDateChange}
      customDueDateStart={customDueDateStart}
      customDueDateEnd={customDueDateEnd}
    />
  ) : (
    <StyledFilterRow isSelected={isSelected} onClick={onClick}>
      <OptionLabel>{displayValue}</OptionLabel>
      <OptionCount>{taskCount || '0'}</OptionCount>
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

export const AssignedOrUnassignedRow = ({
  children,
  isUnassigned,
  ...rest
}) => {
  if (isUnassigned) return <FilterRowUnassigned {...rest} />;

  return cloneElement(children, { ...rest });
};

export const getFilterRowComponent = type => {
  switch (type) {
    case 'PEOPLE':
      return PeopleFilterRowComponent;
    case 'PRIORITY':
      return PriorityFilterRowComponent;
    case 'STATUS':
      return StatusFilterRowComponent;
    case 'DATE':
      return DateFilterRowComponent;
    default:
      return StandardFilterRowComponent;
  }
};
