import React from 'react';
import { Container, Label, OptionsList } from './styled';

const FilterOptionsColumn = props => {
  const { label, children } = props;
  return (
    <Container>
      <Label>{label}</Label>
      <OptionsList>{children}</OptionsList>
    </Container>
  );
};

export default FilterOptionsColumn;
