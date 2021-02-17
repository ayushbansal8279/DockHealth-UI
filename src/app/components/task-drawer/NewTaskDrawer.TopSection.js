/* eslint-disable sonarjs/cognitive-complexity */
import React, { useEffect, useRef } from 'react';
import { openModal } from 'modal/actions';
import { Grid, IconButton, ListItem, Divider } from '@material-ui/core';
import { Close, MoreHoriz } from '@material-ui/icons';
import Spacing from 'components/common/Spacing';
import palette from 'styles/palette';
import { RobotoTypography } from 'styles/theme';
import SmallSwitchChevronDown from 'img/small-switch-chevron-down';
import InputPopover from './InputPopover/InputPopover';
import {
  FiledInSelect,
  StyledList,
  HorizontalLabel,
  CondensedH4,
  styleFirstRow,
  ActionButtonsContainer,
  ListNameContainer,
  ListNameSelectContainer,
} from './NewTaskDrawer.Styled';

import initializeTaskDrawerTopSectionHooks from './NewTaskDrawer.TopSection.Hooks';

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
      <CondensedH4
        style={{
          color: selectedTaskListName === listName ? palette.blueOcean : '',
        }}
      >
        {listName}
      </CondensedH4>
    </ListItem>
  );
};

const TopSection = ({
  formMethods,
  taskLists,
  selectedTask,
  taskList,
  reFileTask,
  onDelete,
  onDuplicate,
  onAddSubTask,
  isInbox,
  closeTaskDrawer,
  modalActions,
  setTourTaskMenuReference,
  assignToSelf,
}) => {
  const { setValue, register } = formMethods;
  const selectedTaskIdentifier = selectedTask?.taskIdentifier;
  const selectedTaskStatus = selectedTask?.status;
  const isCompleted = selectedTaskStatus === 'COMPLETE';
  const hasSubtasks = selectedTask?.subTasksCount !== 0;

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
    dispatch,
  } = initializeTaskDrawerTopSectionHooks({
    modalActions,
    onDelete,
    onDuplicate,
    closeTaskDrawer,
    selectedTask,
  });

  const moreTaskListsAvailable = !!(taskLists && taskLists.length > 1);

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
      <Grid
        container
        item
        xs={12}
        alignItems="center"
        justify="space-between"
        style={styleFirstRow}
      >
        <ListNameContainer>
          {selectedTask && !selectedTask.parentTaskIdentifier && (
            <>
              <input type="hidden" name="newTaskListId" ref={register} />
              <HorizontalLabel>FILED IN: </HorizontalLabel>
              <Spacing horizontal={3} />
              <ListNameSelectContainer
                ref={filedInInputReference}
                onClick={
                  moreTaskListsAvailable ? openFiledInPopover : undefined
                }
              >
                <FiledInSelect enableDropDown={moreTaskListsAvailable}>
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
                {moreTaskListsAvailable && (
                  <>
                    <Spacing horizontal={3} />
                    <SmallSwitchChevronDown color={palette.orangeJulius} />
                  </>
                )}
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
                  {(taskLists ?? []).map(
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
                  )}
                </StyledList>
              </InputPopover>
            </>
          )}
        </ListNameContainer>
        <Spacing horizontal={5} />
        <ActionButtonsContainer>
          {selectedTask && (
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
              // storeAsCurrentTask(null);
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
                    onClick={onAddSubTask({
                      afterAddSubTask: () => {
                        closeTaskMenuPopover();
                      },
                      selectedTask,
                      assignToSelf,
                    })}
                    button
                    style={{
                      borderBottom: `1px solid ${palette.coolGrey3}`,
                    }}
                  >
                    <CondensedH4>Add Subtask</CondensedH4>
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
                <CondensedH4>Duplicate</CondensedH4>
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
                    <CondensedH4>Delete</CondensedH4>
                  </ListItem>
                )}
            </StyledList>
          </InputPopover>
        </ActionButtonsContainer>
      </Grid>
      {selectedTask && (
        <Divider
          style={{
            width: '100%',
            backgroundColor: palette.blueOcean,
            opacity: '0.3',
          }}
        />
      )}
    </>
  );
};

export default TopSection;
