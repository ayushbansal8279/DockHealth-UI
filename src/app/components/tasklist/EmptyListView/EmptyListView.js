import React from 'react';
import { EmptyListContainer } from './styled';

const EmptyListView = ({ children }) => (
  <EmptyListContainer>
    <p>{children}</p>
  </EmptyListContainer>
);

export default EmptyListView;
