import React, { useCallback, useState, useMemo } from 'react';
import { uniq } from 'ramda';
import TaskViewTypeToolbarSelect from 'components/tasklist/TaskViewTypeToolbarSelect/TaskViewTypeToolbarSelect';
import { Box } from '@material-ui/core';
import TaskStatusToolbarSelect from 'components/tasklist/TaskStatusToolbarSelect/TaskStatusToolbarSelect';
import CompleteTasksVisibilitySwitch from 'components/tasklist/CompleteTasksVisibilitySwitch/CompleteTasksVisibilitySwitch';
import InboxTips from 'components/tasklist/InboxTips/InboxTips';
import { ViewType, getViewTypeFromQueryString } from 'helpers/view-type-helper';
import { useLocation, useHistory } from 'react-router-dom';
import { TaskStatus } from 'helpers/task-helpers';
import { updateUserListViewSetup } from 'actions/task-list-actions';
import CustomizeToolbarButton from 'components/tasklist/CustomizeToolbarButton/CustomizeToolbarButton';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import { userProfileSelector } from 'selectors/user-selectors';
import { useDispatch, useSelector } from 'react-redux';
import {
  currentTaskListSelector,
  currentTaskListTasksStatusSelector,
} from 'selectors/task-list-selectors';
import { ToolbarContainer } from './styled';
import TaskCustomFieldsModal from '../../../modal/customModals/TaskCustomFieldsModal';

const TASKS_VISIBILITY_KEY = 'SHOW_WORKFLOW_COMPLETED_TASKS';

const ListDetailsToolbar = ({ additionalOptions }) => {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const history = useHistory();
  const [customFieldsModalOpened, setCustomFieldsModalOpened] = useState(false);
  const currentUser = useSelector(userProfileSelector);
  const tasksStatus = useSelector(currentTaskListTasksStatusSelector);
  const isOrganizationAdmin = checkIfUserIsOrganizationAdmin(currentUser);
  const taskList = useSelector(currentTaskListSelector);
  const { taskListIdentifier, restrictCustomization } = taskList || {};
  const isListCreator =
    taskList?.creator?.identifier === currentUser.identifier;
  const viewType = getViewTypeFromQueryString(search);
  const restrictCustomizationFeatures = restrictCustomization && !isListCreator;

  const handleChangeViewType = useCallback(
    event => {
      const queryParameters = new URLSearchParams(search);
      const value = event?.target.value ?? ViewType.LIST_VIEW;
      if (value === ViewType.LIST_VIEW) {
        queryParameters.delete('viewType');
      } else {
        queryParameters.set('viewType', value.toLowerCase());
      }
      history.push({ search: queryParameters.toString() });
    },
    [search, history],
  );

  const { displayOptions = [] } = useMemo(
    () =>
      taskList?.listType === 'PUBLIC'
        ? taskList
        : taskList?.listUsers?.find(
            user => user.identifier === currentUser.identifier,
          ) || {},
    [taskList, currentUser],
  );

  const handleChangeTasksStatus = useCallback(
    event => {
      history.push(
        `/core/tasks/${taskListIdentifier}${
          event.target.value === TaskStatus.INCOMPLETE
            ? ''
            : `/${TaskStatus.COMPLETE}`
        }${search}`,
      );
    },
    [history, taskListIdentifier, search],
  );

  const handleTasksVisibilityChange = visible => {
    const newDisplayOptions = visible
      ? uniq([...displayOptions, TASKS_VISIBILITY_KEY])
      : displayOptions.filter(k => k !== TASKS_VISIBILITY_KEY);

    dispatch(
      updateUserListViewSetup(
        taskList.taskListIdentifier,
        newDisplayOptions,
        currentUser.identifier,
      ),
    );
  };

  return (
    <ToolbarContainer>
      <Box display="flex" flex={1} justifyContent="flex-start">
        <TaskStatusToolbarSelect
          value={tasksStatus}
          onChange={handleChangeTasksStatus}
        />
        <Box mx={0.5} />
        <TaskViewTypeToolbarSelect
          value={viewType}
          onChange={handleChangeViewType}
        />
        {viewType === ViewType.LIST_VIEW && (
          <>
            {!restrictCustomizationFeatures && (
              <>
                <Box mx={0.5} />
                <CustomizeToolbarButton
                  openCustomFieldModal={() => setCustomFieldsModalOpened(true)}
                  additionalOptions={additionalOptions}
                />
              </>
            )}
            <Box mx={0.5} />
            <TaskCustomFieldsModal
              opened={customFieldsModalOpened}
              handleClose={() => setCustomFieldsModalOpened(false)}
              taskListIdentifier={taskList?.taskListIdentifier}
              isOrganizationAdmin={isOrganizationAdmin}
              isListCreator={isListCreator}
            />
            {taskList?.listType === 'INBOX' && (
              <>
                <InboxTips />
              </>
            )}
          </>
        )}
      </Box>
      {viewType === ViewType.LIST_VIEW && (
        <Box display="flex" flex={1} justifyContent="flex-end">
          {tasksStatus === TaskStatus.INCOMPLETE && (
            <CompleteTasksVisibilitySwitch
              visible={displayOptions.includes(TASKS_VISIBILITY_KEY)}
              onChange={handleTasksVisibilityChange}
            />
          )}
          <Box mx={0.5} />
        </Box>
      )}
    </ToolbarContainer>
  );
};

export default ListDetailsToolbar;
