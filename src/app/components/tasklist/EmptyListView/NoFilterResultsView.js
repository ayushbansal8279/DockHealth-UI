import React from 'react';
import { EmptyFilteredListContainer } from './styled';

const NoFilterResultsView = () => {
  return (
    <EmptyFilteredListContainer>
      <p>No results for your filter criteria.</p>
    </EmptyFilteredListContainer>
  );
};

export default NoFilterResultsView;
