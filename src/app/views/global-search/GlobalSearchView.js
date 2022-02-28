import React from 'react';
import { isEmpty } from 'ramda';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Box } from '@material-ui/core';
import Spacing from 'components/common/Spacing';
import {
  isLoadingGlobalSearchSelector,
  isLoadingMoreGlobalSearchSelector,
  globalSearchListsSelector,
  searchValueSelector,
  isSearchingCompletedTasksSelector,
} from 'selectors/global-search-selectors';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import EmptyGlobalSearch from 'img/empty-global-search.png';
import EmptyGlobalSearchResults from 'img/empty-global-search-results';
import { userProfileSelector } from 'selectors/user-selectors';
import * as TaskActions from 'actions/task-actions';
import { GlobalSearchSagaActions } from 'sagas/global-search-saga';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import GroupedListSkeletonLoader from 'components/tasklist/GroupedListSkeletonLoader/GroupedListSkeletonLoader';
import TaskDrawer from 'components/task-drawer/TaskDrawer/TaskDrawer';
import HorizontallyScrolledViewLayout from 'components/template/HorizontallyScrolledViewLayout/HorizontallyScrolledViewLayout';
import StickyContainer from 'components/common/HorizontalScroll/StickyContainer';
import {
  GlobalSearchWrapper,
  GlobalSearchStickyHeader,
  ViewSidePadding,
  EmptyGlobalSearchImage,
  EmptyGlobaSearchWrapper,
  EmptySearchText,
  EmptyResultsText,
  VerticalScrollContainer,
} from './styled';
import GlobalSearchHeader from './GlobalSearchHeader/GlobalSearchHeader';
import GlobalSearchList from './GlobalSearchList/GlobalSearchList';

const GlobalSearchView = ({
  isLoadingView,
  isLoadingMore,
  isSearchingCompletedTasks,
  lists,
  searchValue,
  currentUser,
  selectedTask,
  taskActions,
  globalSearchSagaActions,
}) => {
  const { storeAsCurrentTask } = taskActions;
  const {
    toggleTaskStatus,
    setWorkflowStatus,
    updateTask,
    getMoreTasksForTaskList,
  } = globalSearchSagaActions;

  const renderEmptyState = () => {
    return (
      <EmptyGlobaSearchWrapper>
        <Box m={4} />
        {searchValue ? (
          <>
            <EmptyResultsText>
              Sorry, we couldn&apos;t find anything for your search
            </EmptyResultsText>
            <Box m={3} />
            <EmptyGlobalSearchImage
              src={EmptyGlobalSearchResults}
              alt="No results"
            />
          </>
        ) : (
          <>
            <EmptySearchText>
              Search tasks, comments, dates and more!
            </EmptySearchText>
            <Box m={3} />
            <EmptyGlobalSearchImage
              src={EmptyGlobalSearch}
              alt="Empty global search"
            />
          </>
        )}
      </EmptyGlobaSearchWrapper>
    );
  };

  return (
    <>
      <HorizontallyScrolledViewLayout
        header={<BasicLayoutHeader title="Search" />}
      >
        <GlobalSearchWrapper>
          <StickyContainer stickyTop zIndex={13}>
            <GlobalSearchStickyHeader>
              <GlobalSearchHeader />
            </GlobalSearchStickyHeader>
          </StickyContainer>
          <ViewSidePadding>
            {isLoadingView ? (
              <GroupedListSkeletonLoader />
            ) : (
              <VerticalScrollContainer>
                <Spacing vertical={5} />
                {!isEmpty(lists)
                  ? lists?.map(list =>
                      list.tasks?.length > 0 ? (
                        <GlobalSearchList
                          list={list}
                          currentUser={currentUser}
                          selectedTask={selectedTask}
                          storeAsCurrentTask={storeAsCurrentTask}
                          toggleTaskStatus={toggleTaskStatus}
                          onTaskUpdate={updateTask}
                          updateWorkflowStatus={setWorkflowStatus}
                          highlightedValue={searchValue}
                          isCompletedList={isSearchingCompletedTasks}
                          getMoreTasksForTaskList={getMoreTasksForTaskList}
                          isLoadingMore={isLoadingMore}
                        />
                      ) : null,
                    )
                  : renderEmptyState()}
              </VerticalScrollContainer>
            )}
          </ViewSidePadding>
          <TaskDrawer />
        </GlobalSearchWrapper>
      </HorizontallyScrolledViewLayout>
    </>
  );
};

const mapDispatchToProps = dispatch => ({
  taskActions: bindActionCreators(TaskActions, dispatch),
  globalSearchSagaActions: bindActionCreators(
    GlobalSearchSagaActions,
    dispatch,
  ),
});

const mapStateToProps = store => ({
  isLoadingView: isLoadingGlobalSearchSelector(store),
  isLoadingMore: isLoadingMoreGlobalSearchSelector(store),
  isSearchingCompletedTasks: isSearchingCompletedTasksSelector(store),
  lists: globalSearchListsSelector(store),
  searchValue: searchValueSelector(store),
  currentUser: userProfileSelector(store),
  selectedTask: selectedTaskSelector(store),
});

export default connect(mapStateToProps, mapDispatchToProps)(GlobalSearchView);
