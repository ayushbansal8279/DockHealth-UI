import React from 'react';
import { isEmpty } from 'ramda';
import { connect } from 'react-redux';
import {
  isLoadingGlobalSearchSelector,
  globalSearchTasksSelector,
  searchValueSelector,
} from 'selectors/global-search-selectors';
import ViewLoader from 'components/common/ViewLoader/ViewLoader';
import NoSearchResultsView from 'components/tasklist/EmptyListView/NoSearchResultsView';
import { GlobalSearchWrapper } from './styled';
import GlobalSearchHeader from './GlobalSearchHeader/GlobalSearchHeader';

const GlobalSearchView = ({ isLoadingView, tasks, searchValue }) => {
  const renderEmptyState = () => {
    if (searchValue) return <NoSearchResultsView />;

    return null;
  };

  return (
    <GlobalSearchWrapper>
      <GlobalSearchHeader />
      <ViewLoader isFetchingData={isLoadingView}>
        {!isEmpty(tasks) ? <div>Global search list</div> : renderEmptyState()}
      </ViewLoader>
    </GlobalSearchWrapper>
  );
};

const mapStateToProps = store => ({
  isLoadingView: isLoadingGlobalSearchSelector(store),
  tasks: globalSearchTasksSelector(store),
  searchValue: searchValueSelector(store),
});

export default connect(mapStateToProps)(GlobalSearchView);
