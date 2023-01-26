import React from 'react';
import { OptionsGroup } from './styled';

const FilterOptionsGroup = (props) => {
  const { children } = props;
  return <OptionsGroup>{children}</OptionsGroup>;
};

export default FilterOptionsGroup;
