/* eslint-disable unicorn/no-nested-ternary */
import { ColumnsConfigProvider } from 'context-api/ColumnsConfigContext';
import React from 'react';
import ListDetailsView from './ListDetailsView';

const ListDetailsViewContainer = props => {
  return (
    <ColumnsConfigProvider>
      <ListDetailsView {...props} />
    </ColumnsConfigProvider>
  );
};

export default ListDetailsViewContainer;
