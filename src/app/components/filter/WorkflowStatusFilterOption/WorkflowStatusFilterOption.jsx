import React from 'react';
import FilterOption from 'components/filter/FilterOption/FilterOption';

const WorkflowStatusFilterOption = ({
  id,
  label,
  count,
  selected,
  onClick,
  reference,
}) => (
  <FilterOption
    id={id}
    label={label}
    count={count}
    selected={selected}
    color={reference.color}
    onClick={onClick}
  />
);

export default WorkflowStatusFilterOption;
