/* eslint-disable import/no-cycle */
/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback } from 'react';
import { Box } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { useBoolean } from 'hooks/useBoolean';
import { onPrint } from 'helpers/ga-event-helper';
import { createPatientDetailsListPath } from 'routing/helpers/paths';
import OutlinedSelect from 'components/common/OutlinedSelect/OutlinedSelect';
import { currentListTasksStatusSelector } from 'selectors/patient-details-selectors';
import { isUserViewOnly } from 'helpers/user-helper';
import {
  getCurrentPatientTasks,
  setCurrentListTasksStatus,
} from 'actions/patient-details-actions';
import { updateUserPageViewSetup } from 'actions/task-list-actions';
import {
  userProfileSelector,
  userSetupClientViewSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import Spacing from 'components/common/Spacing';
import { TaskStatus } from 'helpers/task-helpers';
import TaskStatusToolbarSelect from 'components/tasklist/TaskStatusToolbarSelect/TaskStatusToolbarSelect';
import CustomizeToolbarButton from 'components/tasklist/CustomizeToolbarButton/CustomizeToolbarButton';
import ToolbarButton from 'components/tasklist/ToolbarButton/ToolbarButton';
import { printTaskPdf } from 'components/task-pdf/TaskPdfDocument';
import { ListsToolbarContainer, ListsTabsContainer } from './styled';
import { ListViewType, LIST_TYPE_OPTIONS } from '../helpers';

const TaskListToolbar = props => {
  const { lists, currentList } = props;
  const tasksToPrint = currentList?.tasks ? currentList?.tasks : [];
  const listUsers = currentList?.listUsers ? currentList?.listUsers : [];
  const {
    patientIdentifier,
    taskListIdentifier: taskListIdentifierParameter = ListViewType.ALL_TASKS,
  } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const tasksStatus =
    useSelector(currentListTasksStatusSelector) || TaskStatus.INCOMPLETE;
  const viewSetup = useSelector(userSetupClientViewSelector);
  const [closeMorePopover] = useBoolean(false);
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
  const viewOnlyArchivedTasksEnabled =
    isUserViewOnly(currentUser) &&
    viewOnlyArchivedTasksEnabledItem?.value === 'false'
      ? // eslint-disable-next-line no-unneeded-ternary
        false
      : true;
  const viewOnlyCustomizeEnabled =
    isUserViewOnly(currentUser) &&
    viewOnlyCustomizeEnabledItem?.value === 'false'
      ? // eslint-disable-next-line no-unneeded-ternary
        false
      : true;

  const handleListChange = event => {
    history.push(
      createPatientDetailsListPath(
        patientIdentifier,
        event.target?.value || lists[0].taskListIdentifier,
      ),
    );
  };

  const handleListViewTypeChange = event => {
    history.push(
      createPatientDetailsListPath(
        patientIdentifier,
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
            SHOW_WORKFLOW_COMPLETED_TASKS: !viewSetup.SHOW_WORKFLOW_COMPLETED_TASKS,
          }),
        ),
      key: 'SHOW_COMPLETED_OR_UNCOMPLETED_WORKFLOW_DETAILS',
      checked: viewSetup.SHOW_WORKFLOW_COMPLETED_TASKS,
    },
  ];

  const handleChangeTasksStatus = useCallback(
    event => {
      const selectedTaskStatus =
        event.target.value === TaskStatus.INCOMPLETE
          ? TaskStatus.INCOMPLETE
          : TaskStatus.COMPLETE;
      dispatch(setCurrentListTasksStatus(selectedTaskStatus));
      dispatch(getCurrentPatientTasks(selectedTaskStatus));
    },
    [dispatch],
  );

  const onPrintClick = useCallback(() => {
    closeMorePopover();
    onPrint();
    const title = isAllTasksView
      ? 'All Tasks'
      : listOptions.find(
          element => element.value === taskListIdentifierParameter,
        )?.label;

    return printTaskPdf({
      title,
      tasks: tasksToPrint,
      taskListMembers: listUsers,
    });
  }, [
    closeMorePopover,
    isAllTasksView,
    listOptions,
    taskListIdentifierParameter,
    listUsers,
    tasksToPrint,
  ]);

  return (
    <ListsToolbarContainer>
      <ListsTabsContainer>
        <OutlinedSelect
          width={170}
          name="listType"
          value={
            isAllTasksView ? ListViewType.ALL_TASKS : ListViewType.LIST_VIEW
          }
          onChange={handleListViewTypeChange}
          options={LIST_TYPE_OPTIONS}
          iconColorActive={iconColorActiveItem?.value}
        />
        <Box px={2} />
        {taskListIdentifierParameter !== ListViewType.ALL_TASKS && (
          <OutlinedSelect
            name="currentList"
            value={taskListIdentifierParameter}
            onChange={handleListChange}
            options={listOptions}
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
