/* eslint-disable react/no-did-update-set-state */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as PersonDetailsActions from 'actions/person-details-actions';
import * as TaskActions from 'actions/task-actions';
import * as MegaFilterActions from 'actions/mega-filter-actions';
import * as ModalActions from 'modal/actions';
import { userProfileSelector } from 'selectors/user-selectors';
import { onSearchChanged } from 'helpers/ga-event-helper';
import { TaskListTabName } from 'helpers/tasklist-helpers';
import { TaskItemColumn, TaskStatus } from 'helpers/task-helpers';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import TaskDrawer from 'components/task-drawer/TaskDrawer/TaskDrawer';
import LayoutHeader from 'components/template/LayoutHeader/LayoutHeader';
import HeaderSearch from 'components/template/HeaderSearch/HeaderSearch';
import { TASK_DISAPPEAR_DELAY } from 'helpers/task-update-helper';
import OpenedTasksView from './PersonDetailsOpenedTasksContainer/PersonDetailsOpenedTasks';
import CompletedTasksView from './PersonDetailsCompletedTasksContainer/PersonDetailsCompletedTasks';
import PersonInfoPanel from './PersonInfoPanel/PersonInfoPanel';
import { TaskViewContainer, PersonalInfoStickyContainer } from './styled';
import UserTasksToolbar from './UserTasksToolbar/UserTasksToolbar';
import UserDetailsFilters from './UserDetailsFilters/UserDetailsFilters';

const PERSON_VIEW_COLUMNS_CONFIG = {
  [TaskItemColumn.LIST_NAME]: true,
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const PersonDetailsView = () => {
  const { userIdentifier, tabName } = useParams();
  const [searchValue, setSearchValue] = useState('');
  const dispatch = useDispatch();

  const currentUser = useSelector(userProfileSelector);

  useEffect(() => {
    return () => {
      dispatch(PersonDetailsActions.clearUserDetailsState());
      dispatch(MegaFilterActions.clearFiltersForMegaFilter());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(
      PersonDetailsActions.initializeUserDetailsState(
        userIdentifier,
        tabName?.toUpperCase() || TaskStatus.INCOMPLETE,
      ),
    );
  }, [userIdentifier, tabName, dispatch]);

  const refreshTab = () => {
    dispatch(PersonDetailsActions.refreshUserTasks());
  };

  const refreshTabAfterTaskUpdate = () => {
    dispatch(PersonDetailsActions.getUserTaskFilterOptions());
  };

  const handleTaskDelete = () => {
    dispatch(PersonDetailsActions.getUserTaskFilterOptions());
    dispatch(PersonDetailsActions.getUserTaskCounters());
  };

  const handleSearchValueChange = newValue => {
    setSearchValue(newValue);
    onSearchChanged();
  };

  const invokeToggleCompleteAction = task => {
    dispatch(TaskActions.toggleCompleteTask(task, currentUser))
      .then(() => {
        setTimeout(() => {
          dispatch(PersonDetailsActions.getUserTaskCounters(userIdentifier));
        }, TASK_DISAPPEAR_DELAY);
      })
      .catch(() => refreshTab());
  };

  const toggleTaskCompletedStatus = task => {
    const hasIncompletedSubtasks = task.subtasks.find(
      subtask => subtask.status === 'INCOMPLETE',
    );
    if (task.status === 'INCOMPLETE' && hasIncompletedSubtasks) {
      const modalProps = {
        confirm: () => {
          dispatch(ModalActions.closeModal());
          invokeToggleCompleteAction(task);
        },
      };
      dispatch(ModalActions.openModal('CompleteAllTasks', modalProps));
    } else {
      invokeToggleCompleteAction(task);
    }
  };

  const handleTaskUpdate = (taskIdentifier, dataToUpdate) => {
    dispatch(TaskActions.partialUpdateTask(taskIdentifier, dataToUpdate))
      .then(refreshTabAfterTaskUpdate)
      .catch(() => refreshTab());
  };

  const handleUpdateWorkflowStatus = (task, workflowStatus) => {
    dispatch(TaskActions.updateWorkflowStatus(task, workflowStatus))
      .then(refreshTabAfterTaskUpdate)
      .catch(() => refreshTab());
  };

  const selectedTab = tabName || TaskListTabName.OPEN;

  return (
    <>
      <ViewLayout
        header={
          <LayoutHeader>
            <LayoutHeader.Title title="People" />
            <LayoutHeader.Spacer />
            <HeaderSearch
              value={searchValue}
              onChange={handleSearchValueChange}
            />
            <LayoutHeader.Spacer />
            <UserDetailsFilters />
          </LayoutHeader>
        }
      >
        <PersonalInfoStickyContainer>
          <PersonInfoPanel />
        </PersonalInfoStickyContainer>
        <TaskViewContainer>
          <UserTasksToolbar />
          {selectedTab === TaskListTabName.COMPLETE ? (
            <CompletedTasksView
              taskItemConfig={PERSON_VIEW_COLUMNS_CONFIG}
              listUniqueKey={userIdentifier}
              searchValue={searchValue}
              toggleCompleteTask={toggleTaskCompletedStatus}
              onTaskUpdate={handleTaskUpdate}
            />
          ) : (
            <OpenedTasksView
              taskItemConfig={PERSON_VIEW_COLUMNS_CONFIG}
              listUniqueKey={userIdentifier}
              searchValue={searchValue}
              toggleCompleteTask={toggleTaskCompletedStatus}
              onTaskUpdate={handleTaskUpdate}
              updateWorkflowStatus={handleUpdateWorkflowStatus}
            />
          )}
        </TaskViewContainer>
      </ViewLayout>
      <TaskDrawer
        onTaskUpdate={refreshTabAfterTaskUpdate}
        onTaskDelete={handleTaskDelete}
        onTaskCreation={refreshTabAfterTaskUpdate}
      />
    </>
  );
};

export default PersonDetailsView;
