import React, { cloneElement } from 'react';
import { Box } from '@material-ui/core';
import { isUserGroup } from 'helpers/user-helper';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import GroupAvatar from 'components/user/GroupAvatar/GroupAvatar';
import FilterOption from 'components/filter/FilterOption/FilterOption';
import HighPriorityLabel from 'img/priority-high-label-icon.svg';
import UnassignedIcon from 'img/unassigned.svg';
import DueDateRangePicker from './DueDateRangePicker';
import { StyledUnassignedIcon } from './styled';

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
  count,
  reference,
  isSelected,
  onClick,
}) => (
  <FilterOption
    label={displayValue}
    count={count}
    selected={isSelected}
    onClick={onClick}
    startAdornment={
      isUserGroup(reference) ? (
        <GroupAvatar group={reference} size={25} />
      ) : (
        <UserAvatar user={reference} size={25} />
      )
    }
  />
);

const StatusFilterRowComponent = ({
  reference: workflowStatus,
  count,
  isSelected,
  onClick,
}) => {
  const { name, color } = workflowStatus || {};

  return (
    <FilterOption
      selected={isSelected}
      count={count}
      onClick={onClick}
      label={name}
      color={color}
    />
  );
};

const PriorityFilterRowComponent = ({
  itemKey: priority,
  count,
  isSelected,
  onClick,
}) => {
  const { label, icon: IconComponent } = getPriorityConfig(priority);

  return (
    <FilterOption
      selected={isSelected}
      onClick={onClick}
      startAdornment={IconComponent ? <IconComponent /> : <Box width="12px" />}
      label={label}
      count={count}
    />
  );
};

const StandardFilterRowComponent = ({
  displayValue,
  count,
  isSelected,
  onClick,
}) => (
  <FilterOption
    selected={isSelected}
    onClick={onClick}
    label={displayValue}
    count={count}
  />
);

const DateFilterRowComponent = ({
  isSelected,
  displayValue,
  count,
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
    <FilterOption
      selected={isSelected}
      onClick={onClick}
      label={displayValue}
      count={count}
    />
  );

export const FilterRowUnassigned = ({
  hasAvatars,
  isSelected,
  count,
  onClick,
}) => (
  <FilterOption
    selected={isSelected}
    onClick={onClick}
    startAdornment={
      hasAvatars && (
        <StyledUnassignedIcon src={UnassignedIcon} alt="Unassigned" />
      )
    }
    label="Unassigned"
    count={count}
  />
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
