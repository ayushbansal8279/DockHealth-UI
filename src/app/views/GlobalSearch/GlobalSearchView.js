import React from 'react';
import { isEmpty } from 'ramda';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spacing from 'components/common/Spacing';
import {
  isLoadingGlobalSearchSelector,
  globalSearchListsSelector,
  searchValueSelector,
} from 'selectors/global-search-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import * as TaskDrawerActions from 'actions/task-drawer-actions';
import * as TaskActions from 'actions/task-actions';
import * as ModalActions from 'modal/actions';
import { GlobalSearchSagaActions } from 'sagas/global-search-saga';
import ViewLoader from 'components/common/ViewLoader/ViewLoader';
import NoSearchResultsView from 'components/tasklist/EmptyListView/NoSearchResultsView';
import NewTaskDrawer from 'components/taskView/newTaskDrawer/NewTaskDrawer';
import {
  GlobalSearchWrapper,
  GlobalSearchStickyHeader,
  ViewSidePadding,
} from './styled';
import GlobalSearchHeader from './GlobalSearchHeader/GlobalSearchHeader';
import GlobalSearchList from './GlobalSearchList/GlobalSearchList';

const GlobalSearchView = ({
  isLoadingView,
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
    toggleTaskPriority,
    toggleTaskStatus,
    setDueDate,
    setWorkflowStatus,
    assignTask,
    refreshTasks,
  } = globalSearchSagaActions;

  const renderEmptyState = () => {
    if (searchValue) return <NoSearchResultsView />;

    return null;
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
            ? lists?.map(list => (
                <GlobalSearchList
                  list={list}
                  currentUser={currentUser}
                  selectedTask={selectedTask}
                  openDrawer={openDrawer}
                  storeAsCurrentTask={storeAsCurrentTask}
                  toggleTaskStatus={toggleTaskStatus}
                  toggleTaskPriority={toggleTaskPriority}
                  reassignTask={assignTask}
                  updateDueDate={setDueDate}
                  updateWorkflowStatus={setWorkflowStatus}
                  highlightedValue={searchValue}
                />
              ))
            : renderEmptyState()}
        </ViewSidePadding>
      </ViewLoader>
      <NewTaskDrawer modalActions={modalActions} refreshList={refreshTasks} />
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
  lists: globalSearchListsSelector(store),
  searchValue: searchValueSelector(store),
  currentUser: userProfileSelector(store),
  selectedTask: store.taskState.selectedTask,
});

export default connect(mapStateToProps, mapDispatchToProps)(GlobalSearchView);
