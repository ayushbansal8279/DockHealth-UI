import React from 'react';
import EmptyListView from 'components/tasklist/EmptyListView/EmptyListView';
import EmplyFilterResultsPorcupine from 'img/animals/porcupine';

const NoFilterResultsView = () => {
  return (
    <EmptyListView
      title="There are no results for your filter criteria."
      description=""
      image={EmplyFilterResultsPorcupine}
      imageStyle={{ height: '200px' }}
    />
  );
};

export default NoFilterResultsView;
