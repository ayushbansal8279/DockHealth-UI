import React from 'react';
import { Grid, IconButton, ListItem, Divider } from '@material-ui/core';
import { Close, MoreHoriz, CheckCircleOutline } from '@material-ui/icons';
import Spacing from 'components/common/Spacing';
import InputPopover from './NewTaskDrawer.InputPopover';
import {
  FiledInSelect,
  StyledList,
  HorizontalLabel,
  FormSectionDivider,
  AutoSaveContainer,
  AutoSaveChip,
  styleFullRowThin,
} from './NewTaskDrawer.Styled';
import SmallSwitchChevronDown from '../../../img/small-switch-chevron-down';

import initializeTaskDrawerTopSectionHooks from './NewTaskDrawer.TopSection.Hooks';
import palette from '../../../styles/palette';

const renderTaskList = ({
  closePopover,
  onFiledInInputChange,
  setValue,
  reFileTask,
  closeTaskDrawer,
  selectedTaskIdentifier,
}) => taskList => {
  const { taskListIdentifier, listName } = taskList;

  return (
    <ListItem
      key={taskListIdentifier}
      onClick={() => {
        setValue('newTaskListId', taskListIdentifier);
        onFiledInInputChange(listName);
        closePopover();
        if (selectedTaskIdentifier) {
          reFileTask({ newTaskList: taskList });
          closeTaskDrawer();
        }
      }}
      button
    >
      {listName}
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
  isInbox,
  closeTaskDrawer,
  autoSaveVisible,
}) => {
  const { setValue, register } = formMethods;
  const selectedTaskIdentifier = selectedTask?.taskIdentifier;

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
  } = initializeTaskDrawerTopSectionHooks();

  return (
    <>
      <AutoSaveContainer visible={autoSaveVisible}>
        <AutoSaveChip
          variant="outlined"
          icon={<CheckCircleOutline style={{ color: palette.white }} />}
          label="SAVED"
        />
      </AutoSaveContainer>
      <Grid
        container
        item
        xs={12}
        alignItems="center"
        justify="space-between"
        style={styleFullRowThin}
      >
        <Grid
          container
          item
          xs={6}
          alignItems="flex-start"
          justify="flex-start"
        >
          {selectedTask && !selectedTask.parentTaskIdentifier && (
            <>
              <input type="hidden" name="newTaskListId" ref={register} />
              <HorizontalLabel>FILED IN:</HorizontalLabel>
              <div ref={filedInInputReference} onClick={openFiledInPopover}>
                <FiledInSelect>
                  {selectedTask ? (
                    <span>
                      {isInbox
                        ? 'Inbox'
                        : filedInInputValue || taskList?.listName}
                    </span>
                  ) : (
                    <span>{isInbox ? 'Inbox' : taskList?.listName}</span>
                  )}
                </FiledInSelect>
                <SmallSwitchChevronDown color={palette.orangeJulius} />
              </div>
              <InputPopover
                anchorElement={filedInInputReference}
                isPopoverOpen={isFiledInPopoverOpen}
                closePopover={closeFiledInPopover}
              >
                <StyledList>
                  {(taskLists ?? []).map(
                    renderTaskList({
                      closePopover: closeFiledInPopover,
                      onFiledInInputChange,
                      setValue,
                      reFileTask,
                      closeTaskDrawer,
                      selectedTaskIdentifier,
                    }),
                  )}
                </StyledList>
              </InputPopover>
            </>
          )}
        </Grid>
        <Grid container item xs={6} alignItems="flex-end" justify="flex-end">
          {selectedTask && (
            <IconButton
              ref={taskMenuReference}
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
            <StyledList>
              <ListItem
                key="action_duplicate"
                onClick={onDuplicate({
                  afterDuplicate: () => {
                    // storeAsCurrentTask(newTask);
                    closeTaskDrawer();
                  },
                  selectedTask,
                })}
                button
              >
                Duplicate
              </ListItem>
              {selectedTask &&
                selectedTask.taskIdentifier != null &&
                selectedTask.status !== 'COMPLETE' && (
                  <ListItem
                    key="action_delete"
                    onClick={onDelete({
                      afterDelete: () => {
                        closeTaskDrawer();
                      },
                      selectedTask,
                    })}
                    button
                  >
                    Delete
                  </ListItem>
                )}
            </StyledList>
          </InputPopover>
        </Grid>
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
