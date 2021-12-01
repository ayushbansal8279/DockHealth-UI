import React from 'react';
import DateFilterOption from 'components/filter/DateFilterOption/DateFilterOption';
import UserFilterOption from 'components/filter/UserFilterOption/UserFilterOption';
import WorkflowStatusFilterOption from 'components/filter/WorkflowStatusFilterOption/WorkflowStatusFilterOption';
import PriorityFilterOption from 'components/filter/PriorityFilterOption/PriorityFilterOption';
import FilterOption from 'components/filter/FilterOption/FilterOption';

const FilterOptionByCategory = props => {
  const {
    categoryId,
    id,
    selected,
    displayValue,
    count,
    reference,
    onSelect,
  } = props;

  switch (categoryId) {
    case 'dueDateOptions':
      return (
        <DateFilterOption
          id={id}
          selected={selected}
          label={displayValue}
          count={count}
          onClick={option => onSelect(categoryId, option)}
        />
      );

    case 'assignedTo':
    case 'assignedBy':
      return (
        <UserFilterOption
          id={id}
          reference={reference}
          selected={selected}
          label={displayValue}
          count={count}
          onClick={option => onSelect(categoryId, option)}
        />
      );

    case 'workflowStatusOptions':
      return (
        <WorkflowStatusFilterOption
          id={id}
          reference={reference}
          selected={selected}
          label={displayValue}
          count={count}
          onClick={option => onSelect(categoryId, option)}
        />
      );

    case 'priorityOptions':
      return (
        <PriorityFilterOption
          id={id}
          selected={selected}
          label={displayValue}
          count={count}
          onClick={option => onSelect(categoryId, option)}
        />
      );

    default:
      return (
        <FilterOption
          id={id}
          selected={selected}
          label={displayValue}
          count={count}
          onClick={option => onSelect(categoryId, option)}
        />
      );
  }
};

export default FilterOptionByCategory;
