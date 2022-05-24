/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable sonarjs/cognitive-complexity */
import React, { useRef, useCallback, useState } from 'react';
import { Box } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { useBoolean } from 'hooks/useBoolean';
import { onPrint } from 'helpers/ga-event-helper';
import { createPatientDetailsListPath } from 'routing/helpers/paths';
import OutlinedSelect from 'components/common/OutlinedSelect/OutlinedSelect';
import {
  completeTasksVisibilitySelector,
  currentListTasksStatusSelector,
} from 'selectors/patient-details-selectors';
import {
  togglePatientCompleteTasksVisible,
  getCurrentPatientTasks,
  setCurrentListTasksStatus,
} from 'actions/patient-details-actions';
import { updateUserPageViewSetup } from 'actions/task-list-actions';
import { userSetupClientViewSelector } from 'selectors/user-selectors';
import { updateCurrentUserPreferences } from 'actions/user-actions';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import palette from 'styles/palette';
import { TaskStatus } from 'helpers/task-helpers';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron.tsx';
import TaskStatusToolbarSelect from 'components/tasklist/TaskStatusToolbarSelect/TaskStatusToolbarSelect';
import CustomizeToolbarButton from 'components/tasklist/CustomizeToolbarButton/CustomizeToolbarButton';
import ListPopover from 'components/common/ListPopover/ListPopover';
import ToolbarButton from 'components/tasklist/ToolbarButton/ToolbarButton';
import { printTaskPdf } from 'components/task-pdf/TaskPdfDocument';
import {
  ListsToolbarContainer,
  ListsTabsContainer,
  MenuText,
  LabelBox,
  ToolbarLabel,
} from './styled';
import { ListViewType, LIST_TYPE_OPTIONS } from '../helpers';

// to clean up

const TaskListToolbar = props => {
  const { lists, currentList } = props;
  const tasksToPrint = currentList?.tasks ? currentList?.tasks : [];
  const listUsers = currentList?.listUsers ? currentList?.listUsers : [];
  const {
    patientIdentifier,
    taskListIdentifier: taskListIdentifierParameter = ListViewType.ALL_TASKS,
  } = useParams();
  const history = useHistory();
  const menuReference = useRef();
  const { 0: menuOpen, 2: unsetMenuOpen, 3: toggleMenuOpen } = useBoolean(
    false,
  );
  const dispatch = useDispatch();
  const completeTasksVisible = useSelector(completeTasksVisibilitySelector);
  const tasksStatus =
    useSelector(currentListTasksStatusSelector) || TaskStatus.INCOMPLETE;
  const viewSetup = useSelector(userSetupClientViewSelector);
  const moreButtonReference = useRef(null);
  const [
    isMorePopoverOpen,
    openMorePopover,
    closeMorePopover,
    toggleMorePopoverOpen,
  ] = useBoolean(false);
  const [taskStatus, setTaskStatus] = useState();

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

  const isAllTasksView = taskListIdentifierParameter === ListViewType.ALL_TASKS;
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
    // {
    //   name: 'Show completed tasks',
    //   onClick: () => {
    //     dispatch(togglePatientCompleteTasksVisible());
    //   },
    //   key: 'SHOW_COMPLETED_TASKS',
    //   checked: completeTasksVisible,
    // },
  ];

  const onColumnSetupChange = useCallback(
    (newConfig, options) => {
      if (options?.isCustomColumn) {
        dispatch(
          updateCurrentUserPreferences({
            customFieldDisplayColumns: newConfig
              .filter(f => f.isChecked)
              .map(f => f.identifier),
          }),
        );
      } else {
        dispatch(
          updateCurrentUserPreferences({
            displayColumns: Object.entries(newConfig).reduce(
              (accumulator, [key, value]) =>
                value ? [...accumulator, key] : accumulator,
              [],
            ),
          }),
        );
      }
    },
    [dispatch],
  );

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

  const popoverItems = [
    {
      key: 'print',
      label: 'Print',
      onClick: onPrintClick,
    },
  ];

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
        />
        <Box px={2} />
        {taskListIdentifierParameter !== ListViewType.ALL_TASKS && (
          <OutlinedSelect
            name="currentList"
            value={taskListIdentifierParameter}
            onChange={handleListChange}
            options={listOptions}
          />
        )}
      </ListsTabsContainer>
      <Spacing horizontal={4} />
      <TaskStatusToolbarSelect
        value={tasksStatus}
        onChange={handleChangeTasksStatus}
      />
      <Spacing horizontal={4} />
      <CustomizeToolbarButton
        onChange={onColumnSetupChange}
        showCustomColumnCreate={false}
        additionalOptions={OPTIONS}
      />
      <Spacing horizontal={4} />
      <ToolbarButton onClick={onPrintClick}>Print</ToolbarButton>
    </ListsToolbarContainer>
  );
};

export default TaskListToolbar;
