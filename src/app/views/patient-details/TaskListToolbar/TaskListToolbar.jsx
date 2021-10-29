/* eslint-disable sonarjs/cognitive-complexity */
import React, { useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { useBoolean } from 'hooks/useBoolean';
import {
  IconButton,
  Popper,
  ClickAwayListener,
  Paper,
  Box,
} from '@material-ui/core';
import { createPatientDetailsListPath } from 'routing/helpers/paths';
import zIndex from 'styles/z-index';
import { MoreVert } from '@material-ui/icons';
import OutlinedSelect from 'components/common/OutlinedSelect/OutlinedSelect';
import Checkbox from 'components/common/Checkbox/Checkbox';
import { completeTasksVisibilitySelector } from 'selectors/patient-details-selectors';
import { togglePatientCompleteTasksVisible } from 'actions/patient-details-actions';
import { updateUserPageViewSetup } from 'actions/task-list-actions';
import { userSetupClientViewSelector } from 'selectors/user-selectors';
import ColumnDisplaySettings from 'components/common/ColumnDisplaySettings/ColumnDisplaySettings';
import { updateCurrentUserPreferences } from 'actions/user-actions';
import Spacing from 'components/common/Spacing';
import {
  ListsToolbarContainer,
  ListsTabsContainer,
  MenuText,
  LabelBox,
} from './styled';
import { ListViewType, LIST_TYPE_OPTIONS } from '../helpers';

const TaskListToolbar = props => {
  const { lists } = props;
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
  const viewSetup = useSelector(userSetupClientViewSelector);

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
      disabled: !viewSetup.SHOW_WORKFLOW_DETAILS,
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
    {
      name: 'Show completed tasks',
      onClick: () => {
        dispatch(togglePatientCompleteTasksVisible());
      },
      key: 'SHOW_COMPLETED_TASKS',
      checked: completeTasksVisible,
    },
  ];

  const onClickCheckbox = useCallback(
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
      <ColumnDisplaySettings onChange={onClickCheckbox} />
      <IconButton ref={menuReference} onClick={toggleMenuOpen}>
        <MoreVert />
      </IconButton>
      <Popper
        anchorEl={menuReference?.current}
        placement="bottom-end"
        disablePortal
        open={menuOpen}
        style={{
          zIndex: zIndex.optionsMenu,
        }}
      >
        {menuOpen && (
          <ClickAwayListener onClickAway={unsetMenuOpen}>
            <Paper>
              {OPTIONS.map(option => (
                <LabelBox
                  onClick={() => {
                    if (
                      typeof option.onClick === 'function' &&
                      !option.disabled
                    )
                      option.onClick(option.key);
                  }}
                  display="flex"
                  alignItems="center"
                  p={2}
                  py={1}
                >
                  <Checkbox
                    isDisabled={option.disabled}
                    isChecked={option.checked}
                  />
                  <Box m={0.5} />
                  <MenuText isDisabled={option.disabled}>
                    {option.name}
                  </MenuText>
                </LabelBox>
              ))}
            </Paper>
          </ClickAwayListener>
        )}
      </Popper>
    </ListsToolbarContainer>
  );
};

export default TaskListToolbar;
