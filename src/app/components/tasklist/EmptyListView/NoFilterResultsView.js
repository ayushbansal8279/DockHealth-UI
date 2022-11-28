import React from 'react';
import EmptyListView from 'components/tasklist/EmptyListView/EmptyListView';

const NoFilterResultsView = () => {
  return (
    <EmptyListView
      title="There are no results for your filter criteria."
      description=""
    />
  );
};

export default NoFilterResultsView;
