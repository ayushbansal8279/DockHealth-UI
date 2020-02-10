import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Popover from '@material-ui/core/Popover';
import React, { useCallback, useRef } from 'react';
import { FormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { updateWorkflowStatus } from '../../actions/task-actions';
import { PriorityDot } from '../common/Priority';
import NewTaskDrawerForm from './NewTaskDrawer.Form';
import renderStatusSelectOption from './NewTaskDrawer.RenderStatusSelect';
import {
  AutoSaveContainer,
  AutoSaveLabel,
  CloseTaskButtonContainer,
  FormSection,
  FormSectionDivider,
  StatusSelect,
  TopLabel,
} from './NewTaskDrawer.Styled';
import PriorityFlag from './PriorityFlag';
import { CloseTaskButton } from './TaskDrawerButtons';
import { onTaskPriorityChanged } from '../../helpers/ga-event-helper';

export default ({
  addingTaskOrSubtask,
  autoSaveVisible,
  defaultValues,
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
      updateWorkflowStatus(task, newTaskStatus)(dispatch)
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
          <CloseTaskButtonContainer>
            <CloseTaskButton
              onClick={() => {
                closeDrawer();
                storeAsCurrentTask(null);
              }}
            />
          </CloseTaskButtonContainer>
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
          <CloseTaskButtonContainer>
            <CloseTaskButton
              onClick={() => {
                closeDrawer();
                storeAsCurrentTask(null);
              }}
              paddedSmall
            />
          </CloseTaskButtonContainer>
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
          <NewTaskDrawerForm
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
