/* eslint-disable import/no-cycle */
/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback } from 'react';
import { Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { onPrint } from 'helpers/ga-event-helper';
import { createPatientDetailsListPath } from 'routing/helpers/paths';
import ToolbarSelect from 'components/tasklist/ToolbarSelect/ToolbarSelect';
import { userPreferenceStatusSelector } from '@/app/selectors/user-preference-selectors';
import { isUserViewOnly } from 'helpers/user-helper';
import { updateUserPageViewSetup } from 'actions/task-list-actions';
import {
  userProfileSelector,
  userSetupClientViewSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import Spacing from 'components/common/Spacing';
import ViewTypeIcon from 'img/view-type-icon.svg';
import TaskStatusToolbarSelect from '@/app/components/tasklist/list-toolbar-buttons/TaskStatusToolbarSelect/TaskStatusToolbarSelect';
import CustomizeToolbarButton from '@/app/components/tasklist/list-toolbar-buttons/CustomizeToolbarButton/CustomizeToolbarButton';
import ToolbarButton from '@/app/components/tasklist/list-toolbar-buttons/ToolbarButton/ToolbarButton';
import {
  ListsToolbarContainer,
  ListsTabsContainer,
  ListSelectionImg,
} from './styled';
import { ListViewType } from '../helpers';
import * as UserPreferenceActions from '@/app/actions/user-preference-actions';
import { UserPreferenceContextType } from '@/app/helpers/user-prefrence-helper';
import { getTasksForProfile } from '@/app/actions/task-actions';

const TaskListToolbar = (props) => {
  const { lists } = props;
  const {
    profileIdentifier,
    taskListIdentifier: taskListIdentifierParameter = ListViewType.ALL_TASKS,
  } = useParams();

  const history = useHistory();
  const dispatch = useDispatch();
  const tasksStatus = useSelector(userPreferenceStatusSelector);
  const viewSetup = useSelector(userSetupClientViewSelector);
  // const [closeMorePopover] = useBoolean(false);
  const isAllTasksView = taskListIdentifierParameter === ListViewType.ALL_TASKS;

  const listOptions = lists?.map(
    ({ taskListIdentifier, listName, tasks = [] }) => {
      const tasksCount =
        (tasks.length > 0 &&
          tasks?.reduce((counter, task) => {
            if (task?.itemType === 'BUNDLE') {
              const bundledTaskCount = task?.tasks?.reduce(
                (bundleTaskCounter, bundleTask) => {
                  return (
                    bundleTaskCounter + (bundleTask?.subTasksCount || 0) + 1
                  );
                },
                0,
              );
              return counter + bundledTaskCount;
            }
            return counter + (task?.subTasksCount || 0) + 1;
          }, 0)) ||
        0;

      return {
        secondaryLabel: tasksCount,
        value: taskListIdentifier,
        label: listName,
      };
    },
  );

  const currentUser = useSelector(userProfileSelector);
  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const iconColorFilterActiveItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'icon.active.filter',
    ) || {};
  const iconColorActiveItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'icon.active.color',
    ) || {};
  const viewOnlyArchivedTasksEnabledItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'role.viewOnly.patient.view.archivedTasks.enabled',
    ) || {};
  const viewOnlyCustomizeEnabledItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'role.viewOnly.patient.view.customize.enabled',
    ) || {};
  const viewOnlyArchivedTasksEnabled = !(
    isUserViewOnly(currentUser) &&
    viewOnlyArchivedTasksEnabledItem?.value === 'false'
  );
  const viewOnlyCustomizeEnabled = !(
    isUserViewOnly(currentUser) &&
    viewOnlyCustomizeEnabledItem?.value === 'false'
  );

  const handleListChange = (event) => {
    history.push(
      createPatientDetailsListPath(
        profileIdentifier,
        event.target?.value || lists[0].taskListIdentifier,
      ),
    );
  };

  const handleListViewTypeChange = (event) => {
    history.push(
      createPatientDetailsListPath(
        profileIdentifier,
        event.target?.value === ListViewType.ALL_TASKS
          ? ListViewType.ALL_TASKS
          : lists[0].taskListIdentifier,
      ),
    );
  };

  const OPTIONS = [
    {
      name: 'Show Workflow Details',
      onClick: () =>
        dispatch(
          updateUserPageViewSetup({
            SHOW_WORKFLOW_DETAILS: !viewSetup.SHOW_WORKFLOW_DETAILS,
          }),
        ),
      key: 'SHOW_WORKFLOW_DETAILS',
      checked: viewSetup.SHOW_WORKFLOW_DETAILS,
    },
    {
      name: 'Show Workflow Completed Tasks',
      onClick: () =>
        dispatch(
          updateUserPageViewSetup({
            SHOW_WORKFLOW_COMPLETED_TASKS:
              !viewSetup.SHOW_WORKFLOW_COMPLETED_TASKS,
          }),
        ),
      key: 'SHOW_COMPLETED_OR_UNCOMPLETED_WORKFLOW_DETAILS',
      checked: viewSetup.SHOW_WORKFLOW_COMPLETED_TASKS,
    },
  ];

  const handleChangeTasksStatus = useCallback(
    (status) => {
      dispatch(
        UserPreferenceActions.updateTaskListStatus(
          UserPreferenceContextType.CUSTOM_OBJECT_LIST,
          profileIdentifier,
          status,
        ),
      );
      dispatch(getTasksForProfile(profileIdentifier));
    },
    [dispatch, profileIdentifier],
  );

  const onPrintClick = useCallback(() => {
    onPrint();
    window.print();
  }, []);

  return (
    <ListsToolbarContainer>
      <ListsTabsContainer>
        {taskListIdentifierParameter !== ListViewType.ALL_TASKS && (
          <ToolbarSelect
            options={listOptions}
            value={taskListIdentifierParameter}
            name="currentList"
            onChange={handleListChange}
            icon={
              <ListSelectionImg
                src={ViewTypeIcon}
                alt="list type icon"
                iconColorFilterActive={iconColorFilterActiveItem?.value}
              />
            }
            iconColorActive={iconColorActiveItem?.value}
          />
        )}
      </ListsTabsContainer>
      {viewOnlyArchivedTasksEnabled && (
        <>
          <Spacing horizontal={4} />
          <TaskStatusToolbarSelect
            value={tasksStatus}
            onChange={handleChangeTasksStatus}
            iconColorFilterActive={iconColorFilterActiveItem?.value}
            iconColorActive={iconColorActiveItem?.value}
          />
        </>
      )}
      {viewOnlyCustomizeEnabled && (
        <>
          <Spacing horizontal={4} />
          <CustomizeToolbarButton
            showCustomColumnCreate={false}
            additionalOptions={OPTIONS}
            iconColorFilterActive={iconColorFilterActiveItem?.value}
          />
          <Spacing horizontal={4} />
          <ToolbarButton onClick={onPrintClick}>Print</ToolbarButton>
        </>
      )}
    </ListsToolbarContainer>
  );
};

export default TaskListToolbar;
