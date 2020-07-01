import React from 'react';
import { connect } from 'react-redux';
import { isLoadingGlobalSearchSelector } from 'selectors/global-search-selectors';
import ViewLoader from 'components/common/ViewLoader/ViewLoader';
import { GlobalSearchWrapper } from './styled';
import GlobalSearchHeader from './GlobalSearchHeader/GlobalSearchHeader';

const GlobalSearchView = ({ isLoadingView }) => {
  return (
    <GlobalSearchWrapper>
      <GlobalSearchHeader />
      <ViewLoader isFetchingData={isLoadingView}>
        <div>Global search list</div>
      </ViewLoader>
    </GlobalSearchWrapper>
  );
};

const mapStateToProps = store => ({
  isLoadingView: isLoadingGlobalSearchSelector(store),
});

export default connect(mapStateToProps)(GlobalSearchView);
