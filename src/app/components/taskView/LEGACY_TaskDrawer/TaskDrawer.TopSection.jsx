import { Grid, IconButton, List, Popover } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import React, { useCallback, useRef } from 'react';
import { FormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { updateWorkflowStatus } from 'actions/task-actions';
import { onTaskPriorityChanged } from 'helpers/ga-event-helper';
import { PriorityDot } from '../../common/Priority';
import TaskDrawerForm from './TaskDrawer.Form';
import renderStatusSelectOption from './TaskDrawer.RenderStatusSelect';
import {
  AutoSaveContainer,
  AutoSaveLabel,
  FormSection,
  FormSectionDivider,
  StatusSelect,
  TopLabel,
} from './TaskDrawer.Styled';
import PriorityFlag from '../PriorityFlag';

export default ({
  addingTaskOrSubtask,
  autoSaveVisible,
  defaultValues,
  borderless,
  closeDrawer,
  closeStatusPopover,
  handleSubmit,
  isInbox,
  isSubtask,
  isSpecificPatient,
  formMethods,
  parentTask,
  onMarkComplete,
  openStatusPopover,
  priorityActive,
  saveTaskPriority,
  setAutoSaveVisible,
  setPopoversOpen,
  setStatus,
  status,
  statusPopoverOpen,
  statusSelectData,
  storeAsCurrentTask,
  task,
  taskIdentifier,
  togglePriorityActive,
}) => {
  const statusSelectReference = useRef(null);
  const dispatch = useDispatch();
  const saveTaskStatus = useCallback(
    ({ newTaskStatus }) => {
      updateWorkflowStatus(
        task,
        newTaskStatus,
      )(dispatch)
        .then(() => {
          setAutoSaveVisible();
        })
        .catch(() => {
          toggleAlert('Error updating status, please try again later', 'error');
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [taskIdentifier],
  );

  return (
    <FormSection
      borderless={borderless}
      topBorderActive={!addingTaskOrSubtask && !parentTask && autoSaveVisible}
      container
      item
      xs={12}
    >
      {!task && (
        <Grid
          container
          item
          xs={12}
          alignItems="center"
          justify="space-between"
        >
          <TopLabel>Add a task</TopLabel>
          <IconButton
            onClick={() => {
              closeDrawer();
              storeAsCurrentTask(null);
            }}
            color="primary"
            size="small"
          >
            <Close />
          </IconButton>
        </Grid>
      )}
      <FormSectionDivider shown={!task} active={autoSaveVisible}>
        {!parentTask && (
          <AutoSaveContainer visible={autoSaveVisible}>
            <AutoSaveLabel visible={autoSaveVisible}>Saved</AutoSaveLabel>
          </AutoSaveContainer>
        )}
      </FormSectionDivider>
      <Grid container item xs={12} alignItems="center" justify="space-between">
        <PriorityFlag
          active={priorityActive}
          onClick={() => {
            const newTaskPriority = priorityActive ? 'HIGH' : 'LOW';
            togglePriorityActive();
            onTaskPriorityChanged(newTaskPriority);
            if (taskIdentifier) {
              saveTaskPriority({ newTaskPriority });
            }
          }}
        />
        <StatusSelect ref={statusSelectReference} onClick={openStatusPopover}>
          <span>Status:</span>
          <PriorityDot color={status.color} />
          <span>{status.label}</span>
        </StatusSelect>
        {task && !parentTask && (
          <IconButton
            onClick={() => {
              closeDrawer();
              storeAsCurrentTask(null);
            }}
            size="small"
            color="primary"
          >
            <Close />
          </IconButton>
        )}
        <Popover
          anchorEl={statusSelectReference?.current}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          disablePortal
          onClose={closeStatusPopover}
          open={statusPopoverOpen}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <List>
            {statusSelectData.map(
              renderStatusSelectOption({
                closeStatusPopover,
                setStatus,
                saveTaskStatus,
                taskIdentifier,
              }),
            )}
          </List>
        </Popover>
      </Grid>
      <Grid item xs={12}>
        <FormContext {...formMethods}>
          <TaskDrawerForm
            isSubtask={isSubtask}
            defaultValues={defaultValues}
            handleSubmit={handleSubmit}
            onMarkComplete={onMarkComplete}
            setAutoSaveVisible={setAutoSaveVisible}
            setPopoversOpen={setPopoversOpen}
            isInbox={isInbox}
            isSpecificPatient={isSpecificPatient}
          />
        </FormContext>
      </Grid>
    </FormSection>
  );
};
