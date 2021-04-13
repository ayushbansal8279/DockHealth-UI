/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react/jsx-no-duplicate-props */
import { Button, Grid } from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { FormContext } from 'react-hook-form';
import { storeAsCurrentTask } from 'actions/task-actions';
import Loader, { LoaderSizes } from 'components/common/Loader/Loader';
import Spacing from 'components/common/Spacing';
import MentionsEditor from 'components/common/MentionsEditor/MentionsEditor';
import { MontserratTypography } from 'styles/theme-montserrat';
import { isDueDateOverdue, checkIfTemplateTask } from 'helpers/task-helpers';
import { DrawerFieldEnum, TIME_12H_FORMAT } from 'helpers/task-drawer-helpers';
import { convertFromEditorStateToOutput } from 'components/common/MentionsEditor/helpers';
import AttachmentsSection from '../AttachmentsSection/AttachmentsSection';
import CommentSection from '../CommentSection/CommentSection';
import DueDateInput from '../DueDateInput/DueDateInput';
import TimeDropdownInput from '../TimeDropdownInput/TimeDropdownInput';
import initializeTaskDrawerHooks from './hooks';
import existingUserTaskDrawerTourHooks from './existing-user-tour-hooks';
import LabelsSection from '../LabelsSection/LabelsSection';
import PrioritySection from '../PrioritySection/PrioritySection';
import TopSection from '../TopSection/TopSection';
import HistorySection from '../HistorySection/HistorySection';
import StatusSection from '../StatusSection/StatusSection';
import TaskDrawerEmailBodyContainer from '../EmailBody/EmailBody';
import SubtasksSection from '../SubtasksSection/SubtasksSection';
import ReminderSection from '../ReminderSection/ReminderSection';
import PatientSection from '../PatientSection/PatientSection';
import {
  DescriptionLabel,
  HiddenFieldContainer,
  TaskDrawerContainer,
  TaskDrawerBackground,
  styleTaskDrawerContainer,
  styleFullRow,
  styleFullRowThin,
  styleEmailRow,
  styleFirstRow,
  styleLeftColumn,
  styleRightColumn,
  styleLastRow,
  styleCommentRow,
  DescriptionContainer,
  DescriptionError,
  ParentTaskButton,
  ParentTaskDescription,
  ParentTaskDescriptionPlaceholder,
  DescriptionTextContainer,
  TaskDrawerDivider,
} from './styled';
import { getCompletedByLabel } from './helpers';
import AssignedToSection from '../AssignedToSection/AssignedToSection';

const TaskDrawer = ({
  isInbox,
  modalActions,
  onTaskUpdate = () => {},
  onTaskCreation = () => {},
  onTaskDelete = () => {},
  disabledFields = [],
  fromFirstAddTask = false,
  assignToSelf = false,
  hideTour = false,
}) => {
  const {
    taskDrawerOpen,
    taskDrawerFocusField,
    onSubmit,
    formMethods,
    isAddingOrEditingSubtask,
    taskLists,
    closeTaskDrawer,
    isSaving,
    selectedTask,
    selectedParentTask,
    currentUser,
    currentOrganization,
    reFileTask,
    onDelete,
    onDuplicate,
    onAddSubTask,
    handleQuickAddTask,
    handleTaskDescriptionUpdate,
    setAutoSaveVisible,
    emailBodyMembers,
    descriptionState,
    setDescriptionState,
    descriptionReference,
    descriptionErrorState,
    setDescriptionErrorState,
    dispatch,
    parentDescriptionState,
    setParentDescriptionState,
    taskDrawerReference,
    taskListIdentifier,
    handleUpdateTask,
    handleDueTimeSave,
    handleDueDateSave,
    clearDueDate,
  } = initializeTaskDrawerHooks({
    isInbox,
    onTaskUpdate,
    onTaskCreation,
    onTaskDelete,
  });

  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);

  const {
    taskMenuReference,
    dueDateSectionReference,
    statusSectionReference,
    labelsSectionReference,
    commentsSectionReference,
    historySectionReference,
    renderExistingUserTourPopover,
  } = existingUserTaskDrawerTourHooks({
    taskDrawerOpen,
    fromFirstAddTask,
    taskDrawerReference,
    hideTour,
  });

  const { handleSubmit, setValue } = formMethods;

  useEffect(() => {
    if (selectedTask && selectedTask.description === '') {
      setTimeout(() => {
        descriptionReference.current.focus();
      }, 0);
    }
  }, [descriptionReference, isAddingOrEditingSubtask, selectedTask]);

  const parentFormSubmit = handleSubmit(onSubmit);

  const newTaskFlag = !(selectedTask && selectedTask.taskIdentifier != null);

  const isAddingSubtask =
    selectedTask &&
    selectedTask.taskIdentifier === null &&
    selectedTask.parentTaskIdentifier !== null;

  const isSelectedTaskComplete = selectedTask?.status === 'COMPLETE';

  const taskDueTime = useMemo(() => {
    const momentDueTime = moment(selectedTask?.dueDate || null);
    if (momentDueTime.isValid()) {
      return momentDueTime.format(TIME_12H_FORMAT);
    }
    return null;
  }, [selectedTask]);

  const isTemplateTask = checkIfTemplateTask(selectedTask);

  return (
    <>
      <TaskDrawerContainer
        open={taskDrawerOpen}
        onClose={() => closeTaskDrawer()}
        ref={taskDrawerReference}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormContext {...formMethods}>
            <Grid container style={styleTaskDrawerContainer}>
              <Grid
                container
                item
                xs={12}
                alignItems="center"
                justify="space-between"
                style={styleFirstRow}
              >
                <TopSection
                  formMethods={formMethods}
                  taskLists={taskLists}
                  selectedTask={selectedTask}
                  reFileTask={reFileTask}
                  onDelete={onDelete}
                  onDuplicate={onDuplicate}
                  onAddSubTask={onAddSubTask}
                  assignToSelf={assignToSelf}
                  isInbox={isInbox}
                  closeTaskDrawer={closeTaskDrawer}
                  setAutoSaveVisible={setAutoSaveVisible}
                  modalActions={modalActions}
                  setTourTaskMenuReference={element => {
                    taskMenuReference.current = element;
                  }}
                />
              </Grid>
              {selectedTask && <TaskDrawerDivider />}
              <Spacing vertical={2} />
              {selectedTask?.parentTaskIdentifier && (
                <Grid item xs={12} style={styleFullRowThin}>
                  <Spacing vertical={4} />
                  {selectedParentTask ? (
                    <ParentTaskButton
                      onClick={() =>
                        storeAsCurrentTask(selectedParentTask)(dispatch)
                      }
                    >
                      <ParentTaskDescription>
                        <MentionsEditor
                          readOnly
                          isDrawerEditor
                          withEditedLabel={selectedParentTask.edited}
                          state={parentDescriptionState}
                          onChange={setParentDescriptionState}
                          taskListIdentifier={taskListIdentifier}
                          disableMentions={isTemplateTask}
                        />
                      </ParentTaskDescription>
                    </ParentTaskButton>
                  ) : (
                    <ParentTaskDescriptionPlaceholder />
                  )}
                </Grid>
              )}
              <Grid item xs={12} style={styleFullRow}>
                <DescriptionContainer
                  isFocused={isDescriptionFocused}
                  hasError={descriptionErrorState}
                >
                  <Grid container justify="space-between" alignItems="flex-end">
                    <DescriptionLabel>
                      {isAddingOrEditingSubtask ? 'Subtask' : 'Task'}
                      <Spacing horizontal={3} />
                      <span>(required)</span>
                    </DescriptionLabel>
                    {isSelectedTaskComplete &&
                      getCompletedByLabel(
                        selectedTask.completedBy,
                        selectedTask.completedDt,
                      )}
                  </Grid>
                  <DescriptionTextContainer isCrossed={isSelectedTaskComplete}>
                    <MentionsEditor
                      ref={descriptionReference}
                      taskListIdentifier={taskListIdentifier}
                      disableMentions={isTemplateTask}
                      placeholder={
                        isAddingOrEditingSubtask
                          ? 'What is the subtask?'
                          : 'What is the task?'
                      }
                      isDrawerEditor
                      onFocus={() => {
                        setIsDescriptionFocused(true);
                      }}
                      onBlur={() => {
                        handleTaskDescriptionUpdate();
                        setIsDescriptionFocused(false);
                      }}
                      state={descriptionState}
                      onChange={state => {
                        if (descriptionErrorState) {
                          const {
                            tokenizedText,
                          } = convertFromEditorStateToOutput(state);
                          if (tokenizedText) {
                            setDescriptionErrorState(false);
                          }
                        }
                        setDescriptionState(state);
                      }}
                      keyBindingFn={event => {
                        if (event.keyCode === 13) {
                          return 'enter-command';
                        }
                        return undefined;
                      }}
                      handleKeyCommand={command => {
                        if (command === 'enter-command') {
                          parentFormSubmit();
                          return 'handled';
                        }

                        return 'not-handled';
                      }}
                    />
                  </DescriptionTextContainer>
                </DescriptionContainer>
                {descriptionErrorState && (
                  <DescriptionError>
                    Task description is required
                  </DescriptionError>
                )}
              </Grid>
              {selectedTask?.sourceMessage && (
                <Grid item xs={12} style={styleEmailRow}>
                  <TaskDrawerEmailBodyContainer
                    emailBody={selectedTask.sourceMessage}
                    task={selectedTask}
                    members={emailBodyMembers}
                  />
                </Grid>
              )}
              <Grid item xs={6} style={styleLeftColumn}>
                <PatientSection
                  selectedPatient={
                    selectedTask?.patient || selectedParentTask?.patient || null
                  }
                  currentOrganization={currentOrganization}
                  disabled={
                    disabledFields.includes(DrawerFieldEnum.PATIENT) ||
                    isTemplateTask
                  }
                  placeholder={
                    isTemplateTask && 'Not available when creating a template'
                  }
                  autofocus={taskDrawerFocusField === DrawerFieldEnum.PATIENT}
                  onSave={handleUpdateTask}
                />
              </Grid>
              <Grid item xs={6} style={styleRightColumn}>
                <AssignedToSection
                  currentUser={currentUser}
                  assignedToUsers={selectedTask?.assignedToUsers}
                  taskListIdentifier={
                    isTemplateTask ? null : taskListIdentifier
                  }
                  onSave={handleUpdateTask}
                />
              </Grid>
              <Grid item xs={6} style={styleLeftColumn}>
                <div ref={dueDateSectionReference}>
                  <DueDateInput
                    name="dueDate"
                    label="Due date"
                    placeholder={
                      !isTemplateTask
                        ? 'Set a due date?'
                        : 'Not available when creating a template'
                    }
                    disabled={isTemplateTask}
                    savedDate={selectedTask?.dueDate}
                    onSave={handleDueDateSave}
                    onClear={clearDueDate}
                    setAutoSaveVisible={setAutoSaveVisible}
                    onTaskUpdate={onTaskUpdate}
                    error={isDueDateOverdue(selectedTask)}
                  />
                </div>
              </Grid>
              <Grid item xs={6} style={styleRightColumn}>
                <HiddenFieldContainer visible={selectedTask?.dueDate}>
                  <TimeDropdownInput
                    name="dueTime"
                    label="DUE TIME (00:00 am/pm)"
                    savedValue={taskDueTime}
                    onSave={handleDueTimeSave}
                    error={isDueDateOverdue(selectedTask)}
                  />
                </HiddenFieldContainer>
              </Grid>
              {!isTemplateTask && (
                <Grid item xs={12} style={styleFullRowThin}>
                  <ReminderSection
                    selectedTask={selectedTask}
                    isDisabled={!selectedTask?.dueDate}
                    onSave={handleUpdateTask}
                  />
                </Grid>
              )}
              <Grid item xs={6} style={styleLeftColumn}>
                <PrioritySection
                  selectedTask={selectedTask}
                  setAutoSaveVisible={setAutoSaveVisible}
                  onTaskUpdate={onTaskUpdate}
                />
              </Grid>
              <Grid item xs={6} style={styleRightColumn}>
                <div ref={statusSectionReference}>
                  <StatusSection
                    selectedTask={selectedTask}
                    setAutoSaveVisible={setAutoSaveVisible}
                    onTaskUpdate={onTaskUpdate}
                  />
                </div>
              </Grid>
              <Grid item xs={12} style={styleFullRow}>
                <div ref={labelsSectionReference}>
                  <LabelsSection
                    selectedTask={selectedTask}
                    isInbox={isInbox}
                    parentFormSubmit={parentFormSubmit}
                    setAutoSaveVisible={setAutoSaveVisible}
                    setSelectedLabelsValue={setValue}
                    taskDrawerFocusField={taskDrawerFocusField}
                    onTaskUpdate={onTaskUpdate}
                  />
                </div>
              </Grid>
              <Grid item xs={12} style={styleFullRow}>
                <AttachmentsSection selectedTask={selectedTask} />
              </Grid>
              {selectedTask && !selectedTask.parentTaskIdentifier && (
                <Grid item xs={12}>
                  <SubtasksSection
                    subtasks={selectedTask.subtasks}
                    subTasksCount={selectedTask.subTasksCount}
                    currentUser={currentUser}
                    taskListIdentifier={taskListIdentifier}
                    onQuickAddTask={handleQuickAddTask}
                  />
                </Grid>
              )}
              <Grid item xs={12} style={styleCommentRow}>
                <div ref={commentsSectionReference}>
                  <CommentSection
                    parentFormSubmit={parentFormSubmit}
                    taskDrawerFocusField={taskDrawerFocusField}
                    modalActions={modalActions}
                    taskListIdentifier={taskListIdentifier}
                    isTemplateTask={isTemplateTask}
                  />
                </div>
              </Grid>
              {newTaskFlag && (
                <Grid
                  item
                  xs={12}
                  container
                  justify="flex-end"
                  alignItems="center"
                  wrap="nowrap"
                  style={styleFullRow}
                >
                  <Button
                    onClick={closeTaskDrawer}
                    color="secondary"
                    variant="text"
                    size="small"
                    disabled={isSaving}
                  >
                    <MontserratTypography
                      weight="600"
                      textDecoration="underline"
                      color="inherit"
                      variant="h4"
                    >
                      CANCEL
                    </MontserratTypography>
                  </Button>
                  <Spacing horizontal={3} />
                  <Button
                    variant="contained"
                    size="small"
                    type="submit"
                    disableRipple={isSaving}
                    disabled={isSaving}
                  >
                    <MontserratTypography variant="h4" weight="600">
                      {isSaving ? <Loader size={LoaderSizes.medium} /> : 'SAVE'}
                    </MontserratTypography>
                  </Button>
                </Grid>
              )}
            </Grid>
          </FormContext>
        </form>
        <TaskDrawerDivider />
        <Grid container item xs={12} style={styleLastRow}>
          <Spacing vertical={2} />
          <div>
            <Spacing horizontal={5} />
            <span ref={historySectionReference} />
          </div>
          <HistorySection
            formMethods={formMethods}
            taskLists={taskLists}
            selectedTask={selectedTask}
            taskList={selectedTask?.taskList}
            isInbox={isInbox}
            closeTaskDrawer={closeTaskDrawer}
          />
        </Grid>
        {renderExistingUserTourPopover()}
      </TaskDrawerContainer>
      {taskDrawerOpen && !isAddingSubtask && (
        <TaskDrawerBackground onClick={closeTaskDrawer} />
      )}
    </>
  );
};

export default TaskDrawer;
