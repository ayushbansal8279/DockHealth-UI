import React from 'react';
import { EmptyListContainer } from './styled';

const NoSearchResultsView = () => {
  return (
    <EmptyListContainer>
      <p>No results were found for your search</p>
    </EmptyListContainer>
  );
};

export default NoSearchResultsView;
