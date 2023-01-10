import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as PersonDetailsActions from 'actions/person-details-actions';
import * as TaskActions from 'actions/task-actions';
import * as MegaFilterActions from 'actions/mega-filter-actions';
import * as ModalActions from 'modal/actions';
import {
  userProfileSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import { onSearchChanged } from 'helpers/ga-event-helper';
import { TaskListTabName } from 'helpers/tasklist-helpers';
import {
  TaskItemColumn,
  TaskStatus,
  TASK_ITEM_BASE_COLUMN_CONFIG,
  findIncompleteRequiredFields,
} from 'helpers/task-helpers';
import TaskDrawer from 'components/task-drawer/TaskDrawer/TaskDrawer';
import { taskCustomFieldsSelector } from 'selectors/task-drawer-selectors';
import LayoutHeader from 'components/template/LayoutHeader/LayoutHeader';
import { updateCurrentUserPreferences } from 'actions/user-actions';
import HeaderSearch from 'components/template/HeaderSearch/HeaderSearch';
import { TASK_DISAPPEAR_DELAY } from 'helpers/task-update-helper';
import { ColumnsConfigProvider } from 'context-api/columns-config-context';
import HorizontallyScrolledViewLayout from 'components/template/HorizontallyScrolledViewLayout/HorizontallyScrolledViewLayout';
import StickyContainer from 'components/common/HorizontalScroll/StickyContainer';
import OpenedTasksView from './PersonDetailsOpenedTasksContainer/PersonDetailsOpenedTasks';
import CompletedTasksView from './PersonDetailsCompletedTasksContainer/PersonDetailsCompletedTasks';
import PersonInfoPanel from './PersonInfoPanel/PersonInfoPanel';
import UserTasksToolbar from './UserTasksToolbar/UserTasksToolbar';
import UserDetailsFilters from './UserDetailsFilters/UserDetailsFilters';
import { TaskViewContainer } from './styled';

const PERSON_VIEW_COLUMNS_CONFIG = {
  ...TASK_ITEM_BASE_COLUMN_CONFIG,
  [TaskItemColumn.LIST_NAME]: true,
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const PersonDetailsView = () => {
  const { userIdentifier, tabName } = useParams();
  const [searchValue, setSearchValue] = useState('');
  const dispatch = useDispatch();
  const currentUser = useSelector(userProfileSelector);

  const { templates } = useSelector(taskCustomFieldsSelector);
  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const iconColorActiveItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'icon.active.color',
    ) || {};

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
    const incompleteRequiredFields = findIncompleteRequiredFields(
      templates,
      task,
    );
    const isRequiredFieldsAreIncomplete = incompleteRequiredFields.length > 0;

    if (isRequiredFieldsAreIncomplete) {
      const modalProps = {
        incompleteFields: incompleteRequiredFields,
      };
      dispatch(ModalActions.openModal('CompleteAllFields', modalProps));
      return;
    }

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

  const handleOrderChange = useCallback(
    listDisplayColumns => {
      dispatch(
        updateCurrentUserPreferences({
          listDisplayColumns,
        }),
      );
    },
    [dispatch],
  );

  const selectedTab = tabName || TaskListTabName.OPEN;

  return (
    <ColumnsConfigProvider>
      <HorizontallyScrolledViewLayout
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
        <StickyContainer>
          <PersonInfoPanel />
        </StickyContainer>
        <TaskViewContainer>
          <StickyContainer>
            <UserTasksToolbar />
          </StickyContainer>
          {selectedTab === TaskListTabName.COMPLETE ? (
            <CompletedTasksView
              taskItemConfig={PERSON_VIEW_COLUMNS_CONFIG}
              listUniqueKey={userIdentifier}
              searchValue={searchValue}
              toggleCompleteTask={toggleTaskCompletedStatus}
              onTaskUpdate={handleTaskUpdate}
              onOrderChange={handleOrderChange}
              iconColorActive={iconColorActiveItem?.value}
            />
          ) : (
            <OpenedTasksView
              taskItemConfig={PERSON_VIEW_COLUMNS_CONFIG}
              listUniqueKey={userIdentifier}
              searchValue={searchValue}
              toggleCompleteTask={toggleTaskCompletedStatus}
              onTaskUpdate={handleTaskUpdate}
              updateWorkflowStatus={handleUpdateWorkflowStatus}
              onOrderChange={handleOrderChange}
              iconColorActive={iconColorActiveItem?.value}
            />
          )}
        </TaskViewContainer>
      </HorizontallyScrolledViewLayout>
      <TaskDrawer
        onTaskUpdate={refreshTabAfterTaskUpdate}
        onTaskDelete={handleTaskDelete}
        onTaskCreation={refreshTabAfterTaskUpdate}
      />
    </ColumnsConfigProvider>
  );
};

export default PersonDetailsView;
