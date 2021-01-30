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
import EmptyGlobalSearch from 'img/empty-global-search.png';
import EmptyGlobalSearchResults from 'img/empty-global-search-results';
import { userProfileSelector } from 'selectors/user-selectors';
import * as TaskDrawerActions from 'actions/task-drawer-actions';
import * as TaskActions from 'actions/task-actions';
import * as ModalActions from 'modal/actions';
import { GlobalSearchSagaActions } from 'sagas/global-search-saga';
import ViewLoader from 'components/common/ViewLoader/ViewLoader';
import NewTaskDrawer from 'components/taskView/newTaskDrawer/NewTaskDrawer';
import {
  GlobalSearchWrapper,
  GlobalSearchStickyHeader,
  ViewSidePadding,
  EmptyGlobalSearchImage,
  EmptyGlobaSearchWrapper,
  EmptySearchText,
  EmptyResultsText,
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
  taskDrawerActions,
  taskActions,
  modalActions,
  globalSearchSagaActions,
}) => {
  const { openDrawer } = taskDrawerActions;
  const { storeAsCurrentTask } = taskActions;
  const {
    toggleTaskStatus,
    setDueDate,
    setWorkflowStatus,
    assignTask,
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
    <GlobalSearchWrapper>
      <GlobalSearchStickyHeader>
        <GlobalSearchHeader />
      </GlobalSearchStickyHeader>
      <ViewLoader isFetchingData={isLoadingView}>
        <ViewSidePadding>
          <Spacing vertical={5} />
          {!isEmpty(lists)
            ? lists?.map(list =>
                list.tasks?.length > 0 ? (
                  <GlobalSearchList
                    list={list}
                    currentUser={currentUser}
                    selectedTask={selectedTask}
                    openDrawer={openDrawer}
                    storeAsCurrentTask={storeAsCurrentTask}
                    toggleTaskStatus={toggleTaskStatus}
                    reassignTask={assignTask}
                    updateDueDate={setDueDate}
                    updateWorkflowStatus={setWorkflowStatus}
                    highlightedValue={searchValue}
                    isCompletedList={isSearchingCompletedTasks}
                    getMoreTasksForTaskList={getMoreTasksForTaskList}
                    isLoadingMore={isLoadingMore}
                  />
                ) : null,
              )
            : renderEmptyState()}
        </ViewSidePadding>
      </ViewLoader>
      <NewTaskDrawer modalActions={modalActions} />
    </GlobalSearchWrapper>
  );
};

const mapDispatchToProps = dispatch => ({
  taskDrawerActions: bindActionCreators(TaskDrawerActions, dispatch),
  taskActions: bindActionCreators(TaskActions, dispatch),
  modalActions: bindActionCreators(ModalActions, dispatch),
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
  selectedTask: store.taskState.selectedTask,
});

export default connect(mapStateToProps, mapDispatchToProps)(GlobalSearchView);
