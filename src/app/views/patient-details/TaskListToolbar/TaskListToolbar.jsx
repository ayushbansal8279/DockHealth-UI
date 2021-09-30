import React, { useRef } from 'react';
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
import { ListsToolbarContainer, ListsTabsContainer, MenuText } from './styled';
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
              <Box display="flex" alignItems="center" p={3}>
                <Checkbox
                  isChecked={completeTasksVisible}
                  onClick={() => {
                    dispatch(togglePatientCompleteTasksVisible());
                  }}
                />
                <Box m={0.5} />
                <MenuText>Show completed tasks</MenuText>
              </Box>
            </Paper>
          </ClickAwayListener>
        )}
      </Popper>
    </ListsToolbarContainer>
  );
};

export default TaskListToolbar;
