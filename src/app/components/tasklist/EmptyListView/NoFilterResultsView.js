import React from 'react';
import { EmptyListContainer } from './styled';

const NoFilterResultsView = () => {
  return (
    <EmptyListContainer>
      <p>No results were found for your filters</p>
    </EmptyListContainer>
  );
};

export default NoFilterResultsView;
