/* eslint-disable sonarjs/cognitive-complexity */
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { openModal } from 'modal/actions';
import { IconButton, ListItem } from '@material-ui/core';
import { Close, MoreHoriz } from '@material-ui/icons';
import { openTaskDrawerToAddTask } from 'actions/task-drawer-actions';
import { checkIfTemplateTask } from 'helpers/task-helpers';
import { userProfileSelector } from 'selectors/user-selectors';
import Spacing from 'components/common/Spacing';
import palette from 'styles/palette';
import { RobotoTypography } from 'styles/theme';
import SmallSwitchChevronDown from 'img/small-switch-chevron-down';
import { getTaskListForUser } from 'actions/task-list-actions';
import InputPopover from 'components/common/InputPopover/InputPopover';
import Circle from 'img/circle.svg';
import CircleCompleted from 'img/circle-completed.svg';
import { HorizontalLabel } from '../styled';
import {
  FiledInSelect,
  StyledList,
  ActionButtonsContainer,
  ListNameContainer,
  ListNameSelectContainer,
} from './styled';
import {
  CircleIcon,
} from 'components/task/styled';

import initializeTaskDrawerTopSectionHooks from './hooks';

function useOutsideAction(reference, onClickOutside) {
  useEffect(() => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    function handleClickOutside(event) {
      if (reference.current && !reference.current.contains(event.target)) {
        onClickOutside();
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [reference, onClickOutside]);
}

const renderTaskList = ({
  closePopover,
  onFiledInInputChange,
  setValue,
  reFileTask,
  closeTaskDrawer,
  selectedTaskIdentifier,
  selectedTaskListName,
  hasSubtasks,
  dispatch,
}) => taskList => {
  const { taskListIdentifier, listName } = taskList;

  const changeFiledInList = () => {
    setValue('newTaskListId', taskListIdentifier);
    onFiledInInputChange(listName);

    if (!hasSubtasks) closePopover();

    if (selectedTaskIdentifier) {
      reFileTask({ newTaskList: taskList });
      closeTaskDrawer();
    }
  };

  const openMoveModal = () => {
    closePopover();
    dispatch(
      openModal('MoveTasksWithSubtasks', {
        confirm: changeFiledInList,
      }),
    );
  };

  return (
    <ListItem
      key={taskListIdentifier}
      onClick={hasSubtasks ? openMoveModal : changeFiledInList}
      button
    >
      <RobotoTypography
        condensed
        variant="h4"
        style={{
          color: selectedTaskListName === listName ? palette.blueOcean : '',
        }}
      >
        {listName}
      </RobotoTypography>
    </ListItem>
  );
};

const TopSection = ({
  formMethods,
  selectedTask,
  templateBundleIdentifier,
  reFileTask,
  onDelete,
  onDuplicate,
  isInbox,
  closeTaskDrawer,
  setTourTaskMenuReference,
}) => {
  const currentUser = useSelector(userProfileSelector);

  const { setValue, register } = formMethods;
  const selectedTaskIdentifier = selectedTask?.taskIdentifier;
  const selectedTaskStatus = selectedTask?.status;
  const taskList = selectedTask?.taskList;
  const isCompleted = selectedTaskStatus === 'COMPLETE';
  const hasSubtasks = selectedTask?.subTasksCount !== 0;

  const isTemplateTask = checkIfTemplateTask(selectedTask);
  const parentTaskIdentifier = selectedTask?.parentTaskIdentifier
  const isSubtask = !!parentTaskIdentifier;
  const isDecisionTask = selectedTask?.intentType === 'DECISION';
  const isDecisionSelected = selectedTask?.taskOutcomes?.reduce(
    (accumulator, currentValue) => accumulator || currentValue.isSelected,
    false,
  );
  const isTaskStatusTogglingDisabled =
    isTemplateTask ||
    (isDecisionTask && !isDecisionSelected);

  const dependencyTasksCount = selectedTask?.dependencyTasksCount;
  const dependencyTasksCompletedCount = selectedTask?.dependencyTasksCompletedCount;
  const isDependencyEmptyOrCompleted =
    dependencyTasksCount === dependencyTasksCompletedCount;


  const {
    filedInInputReference,
    isFiledInPopoverOpen,
    openFiledInPopover,
    closeFiledInPopover,
    filedInInputValue,
    onFiledInInputChange,
    taskMenuReference,
    isTaskMenuPopoverOpen,
    openTaskMenuPopover,
    closeTaskMenuPopover,
    openDeleteConfirmationModal,
    openDuplicateConfirmationModal,
    duplicateTaskWithoutConfirmation,
    onCompleteToggle,
    dispatch,
    taskLists,
  } = initializeTaskDrawerTopSectionHooks({
    onDelete,
    onDuplicate,
    closeTaskDrawer,
    selectedTask,
    currentUser,
    templateBundleIdentifier,
    isTaskStatusTogglingDisabled,
    isDependencyEmptyOrCompleted,
  });

  const hasAttachments = !!(
    selectedTask &&
    selectedTask.attachments &&
    selectedTask.attachments.length > 0
  );

  const taskListsContainerReference = useRef(null);
  useOutsideAction(taskListsContainerReference, closeFiledInPopover);

  const optionsContainerReference = useRef(null);
  useOutsideAction(optionsContainerReference, closeTaskMenuPopover);

  return (
    <>
      <ListNameContainer>
        {selectedTask &&
          !selectedTask.parentTaskIdentifier &&
          !checkIfTemplateTask(selectedTask) && (
            <>
              <input type="hidden" name="newTaskListId" ref={register} />
              <HorizontalLabel>Mark Complete : </HorizontalLabel>
              <Spacing horizontal={3} />
              <CircleIcon
                src={isCompleted ? CircleCompleted : Circle}
                isClickable={
                  !isTaskStatusTogglingDisabled && isDependencyEmptyOrCompleted
                }
                isCompleted={isCompleted}
                onClick={onCompleteToggle}
              />
              <Spacing horizontal={3} />
              <HorizontalLabel>FILED IN: </HorizontalLabel>
              <Spacing horizontal={3} />
              <ListNameSelectContainer
                ref={filedInInputReference}
                onClick={() => {
                  if (selectedTask?.taskIdentifier) {
                    dispatch(getTaskListForUser());
                    openFiledInPopover();
                  }
                }}
              >
                <FiledInSelect>
                  {selectedTask ? (
                    <RobotoTypography condensed color="inherit">
                      {isInbox
                        ? 'Inbox'
                        : filedInInputValue || taskList?.listName}
                    </RobotoTypography>
                  ) : (
                    <RobotoTypography condensed color="inherit">
                      {isInbox ? 'Inbox' : taskList?.listName}
                    </RobotoTypography>
                  )}
                </FiledInSelect>
                <Spacing horizontal={3} />
                <SmallSwitchChevronDown color={palette.orangeJulius} />
              </ListNameSelectContainer>
              <InputPopover
                anchorElement={filedInInputReference}
                isPopoverOpen={isFiledInPopoverOpen}
                closePopover={closeFiledInPopover}
                popupStyle={{
                  width: '550px',
                }}
              >
                <StyledList ref={taskListsContainerReference}>
                  {taskLists ? (
                    taskLists.map(
                      renderTaskList({
                        closePopover: closeFiledInPopover,
                        onFiledInInputChange,
                        setValue,
                        reFileTask,
                        closeTaskDrawer,
                        selectedTaskIdentifier,
                        selectedTaskListName: taskList?.listName,
                        hasSubtasks,
                        dispatch,
                      }),
                    )
                  ) : (
                    <ListItem>Loading ...</ListItem>
                  )}
                </StyledList>
              </InputPopover>
            </>
          )}
      </ListNameContainer>
      <Spacing horizontal={5} />
      <ActionButtonsContainer>
        {selectedTask && selectedTask.taskIdentifier && (
          <IconButton
            ref={element => {
              taskMenuReference.current = element;
              setTourTaskMenuReference(element);
            }}
            onClick={() => {
              openTaskMenuPopover();
            }}
            size="small"
            color="secondary"
          >
            <MoreHoriz />
          </IconButton>
        )}
        <Spacing horizontal={4} />
        <IconButton
          onClick={() => {
            closeTaskDrawer();
          }}
          size="small"
          color="secondary"
        >
          <Close />
        </IconButton>
        <InputPopover
          anchorElement={taskMenuReference}
          isPopoverOpen={isTaskMenuPopoverOpen}
          closePopover={closeTaskMenuPopover}
          popupStyle={{
            width: '200px',
            marginLeft: '-60px',
            marginTop: '-20px',
          }}
        >
          <StyledList
            style={{
              paddingTop: '0',
              paddingBottom: '0',
            }}
            ref={optionsContainerReference}
          >
            {!isCompleted &&
              selectedTask &&
              !selectedTask.parentTaskIdentifier && (
                <ListItem
                  key="action_add_subtask"
                  onClick={() => {
                    dispatch(
                      openTaskDrawerToAddTask({
                        taskIdentifier: null,
                        parentTaskIdentifier: selectedTask.identifier,
                        parentTask: selectedTask,
                      }),
                    );
                    closeTaskMenuPopover();
                  }}
                  button
                  style={{
                    borderBottom: `1px solid ${palette.coolGrey3}`,
                  }}
                >
                  <RobotoTypography condensed variant="h4">
                    Add Subtask
                  </RobotoTypography>
                </ListItem>
              )}
            <ListItem
              key="action_duplicate"
              onClick={event => {
                closeTaskMenuPopover();
                if (hasAttachments) {
                  openDuplicateConfirmationModal();
                } else {
                  duplicateTaskWithoutConfirmation(event);
                }
              }}
              button
              style={{
                borderBottom: `1px solid ${palette.coolGrey3}`,
              }}
            >
              <RobotoTypography condensed variant="h4">
                Duplicate
              </RobotoTypography>
            </ListItem>
            {selectedTask &&
              selectedTask.taskIdentifier != null &&
              selectedTask.status !== 'COMPLETE' && (
                <ListItem
                  key="action_delete"
                  onClick={() => {
                    closeTaskMenuPopover();
                    openDeleteConfirmationModal();
                  }}
                  button
                  style={{
                    borderBottom: `none`,
                  }}
                >
                  <RobotoTypography condensed variant="h4">
                    Delete
                  </RobotoTypography>
                </ListItem>
              )}
          </StyledList>
        </InputPopover>
      </ActionButtonsContainer>
    </>
  );
};

export default TopSection;
