import React, { cloneElement } from 'react';
import { isUserGroup } from 'helpers/user-helper';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import GroupAvatar from 'components/user/GroupAvatar/GroupAvatar';
import HighPriorityLabel from 'img/priority-high-label-icon.svg';
import UnassignedIcon from 'img/unassigned.svg';
import DueDateRangePicker from './DueDateRangePicker';
import {
  MemberAvatarWrapper,
  StyledFilterRow,
  StyledUnassignedIcon,
  MemberOptionLabel,
  OptionLabel,
  OptionCount,
  StatusBar,
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
  <StyledFilterRow
    isSelected={isSelected}
    isDisabled={taskCount === 0}
    onClick={taskCount !== 0 && onClick}
  >
    <MemberAvatarWrapper>
      {isUserGroup(reference) ? (
        <GroupAvatar group={reference} size={25} />
      ) : (
        <UserAvatar user={reference} size={25} />
      )}
    </MemberAvatarWrapper>
    <MemberOptionLabel>{displayValue}</MemberOptionLabel>
    <OptionCount>{taskCount}</OptionCount>
  </StyledFilterRow>
);

const StatusFilterRowComponent = ({
  reference: workflowStatus,
  taskCount,
  isSelected,
  onClick,
}) => {
  const { name, color } = workflowStatus || {};

  return (
    <StyledFilterRow
      isSelected={isSelected}
      isDisabled={taskCount === 0}
      onClick={taskCount !== 0 && onClick}
    >
      <StatusBar color={color} />
      <OptionLabel>{name}</OptionLabel>
      <OptionCount>{taskCount}</OptionCount>
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
    <StyledFilterRow
      isSelected={isSelected}
      isDisabled={taskCount === 0}
      onClick={taskCount !== 0 && onClick}
    >
      {IconComponent && <IconComponent />}
      <OptionLabel>{label}</OptionLabel>
      <OptionCount>{taskCount}</OptionCount>
    </StyledFilterRow>
  );
};

const StandardFilterRowComponent = ({
  displayValue,
  taskCount,
  isSelected,
  onClick,
}) => (
  <StyledFilterRow
    isSelected={isSelected}
    isDisabled={taskCount === 0}
    onClick={taskCount !== 0 && onClick}
  >
    <OptionLabel>{displayValue}</OptionLabel>
    <OptionCount>{taskCount}</OptionCount>
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
    <StyledFilterRow
      isSelected={isSelected}
      isDisabled={taskCount === 0}
      onClick={taskCount !== 0 && onClick}
    >
      <OptionLabel>{displayValue}</OptionLabel>
      <OptionCount>{taskCount}</OptionCount>
    </StyledFilterRow>
  );

export const FilterRowUnassigned = ({
  hasAvatars,
  isSelected,
  taskCount,
  onClick,
}) => (
  <StyledFilterRow
    isSelected={isSelected}
    isDisabled={taskCount === 0}
    onClick={taskCount !== 0 && onClick}
  >
    {hasAvatars && (
      <StyledUnassignedIcon src={UnassignedIcon} alt="Unassigned" />
    )}
    <OptionLabel>Unassigned</OptionLabel>
    <OptionCount>{taskCount}</OptionCount>
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
