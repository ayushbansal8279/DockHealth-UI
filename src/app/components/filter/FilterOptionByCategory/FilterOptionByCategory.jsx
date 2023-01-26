import React from 'react';
import UserFilterOption from 'components/filter/UserFilterOption/UserFilterOption';
import WorkflowStatusFilterOption from 'components/filter/WorkflowStatusFilterOption/WorkflowStatusFilterOption';
import PriorityFilterOption from 'components/filter/PriorityFilterOption/PriorityFilterOption';
import FilterOption from 'components/filter/FilterOption/FilterOption';
import { FilterOptionsCategory } from 'helpers/filter-options-helpers';

const FilterOptionByCategory = (props) => {
  const { categoryId, id, selected, displayValue, count, reference, onClick } =
    props;

  switch (categoryId) {
    case FilterOptionsCategory.ASSIGNED_TO:
    case FilterOptionsCategory.ASSIGNED_BY:
      return (
        <UserFilterOption
          id={id}
          reference={reference}
          selected={selected}
          label={displayValue}
          count={count}
          onClick={onClick}
        />
      );

    case FilterOptionsCategory.WORKFLOW_STATUS:
      return (
        <WorkflowStatusFilterOption
          id={id}
          reference={reference}
          selected={selected}
          label={displayValue}
          count={count}
          onClick={onClick}
        />
      );

    case FilterOptionsCategory.PRIORITY:
      return (
        <PriorityFilterOption
          id={id}
          selected={selected}
          label={displayValue}
          count={count}
          onClick={onClick}
        />
      );

    default:
      return (
        <FilterOption
          id={id}
          selected={selected}
          label={displayValue}
          count={count}
          onClick={onClick}
        />
      );
  }
};

export default FilterOptionByCategory;
