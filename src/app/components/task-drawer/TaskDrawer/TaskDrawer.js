/* eslint-disable import/extensions */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react/jsx-no-duplicate-props */
import React from 'react';
import { FormContext } from 'react-hook-form';
import { Grid } from '@material-ui/core';

import Loader, { LoaderSizes } from 'components/common/Loader/Loader';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import TextEditor from 'components/common/TextEditor/TextEditor';
import { MontserratTypography } from 'styles/theme-montserrat';
import { DrawerFieldEnum } from 'helpers/task-drawer-helpers';
import AttachmentsSection from '../AttachmentsSection/AttachmentsSection';
import CommentSection from '../CommentSection/CommentSection';
import LabelsSection from '../LabelsSection/LabelsSection';
import PrioritySection from '../PrioritySection/PrioritySection';
import TopSection from '../TopSection/TopSection';
import HistorySection from '../HistorySection/HistorySection';
import StatusSection from '../StatusSection/StatusSection';
import TaskDrawerEmailBodyContainer from '../EmailBody/EmailBody';
import SubtasksSection from '../SubtasksSection/SubtasksSection';
import ReminderSection from '../ReminderSection/ReminderSection';
import PatientSection from '../PatientSection/PatientSection';
import initializeTaskDrawerHooks from './hooks';
import existingUserTaskDrawerTourHooks from './existing-user-tour-hooks';
import {
  DescriptionLabel,
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
import DueDateSection from '../DueDateSection/DueDateSection';

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
    closeTaskDrawer,
    descriptionErrorState,
    descriptionReference,
    descriptionState,
    formMethods,
    handleDueDateSave,
    handleQuickAddSubtask,
    handleUpdateTask,
    isSubtask,
    isAddingOrEditingSubtask,
    isAddingSubtask,
    isDescriptionFocused,
    isSaving,
    isSelectedTaskComplete,
    isTemplateTask,
    newTaskFlag,
    onAddSubTask,
    onBlurMentionsEditor,
    onChangeMentionsEditor,
    onClickParentTask,
    onDelete,
    onDuplicate,
    onFocusMentionsEditor,
    onSubmit,
    parentDescriptionState,
    reFileTask,
    selectedParentTask,
    selectedTask,
    selectedTaskSourceMessage,
    setAutoSaveVisible,
    setParentDescriptionState,
    taskDrawerFocusField,
    taskDrawerOpen,
    taskDrawerReference,
    taskListIdentifier,
    templateBundleIdentifier,
  } = initializeTaskDrawerHooks({
    isInbox,
    onTaskUpdate,
    onTaskCreation,
    onTaskDelete,
    fromFirstAddTask,
    hideTour,
  });

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
  const parentFormSubmit = handleSubmit(onSubmit);

  return (
    <>
      <TaskDrawerContainer
        open={taskDrawerOpen}
        onClose={closeTaskDrawer}
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
              {isSubtask && (
                <Grid item xs={12} style={styleFullRowThin}>
                  <Spacing vertical={4} />
                  {selectedParentTask ? (
                    <ParentTaskButton onClick={onClickParentTask}>
                      <ParentTaskDescription>
                        <TextEditor
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
                    <TextEditor
                      ref={descriptionReference}
                      taskListIdentifier={taskListIdentifier}
                      disableMentions={isTemplateTask}
                      placeholder={
                        isAddingOrEditingSubtask
                          ? 'What is the subtask?'
                          : 'What is the task?'
                      }
                      isDrawerEditor
                      onFocus={onFocusMentionsEditor}
                      onBlur={onBlurMentionsEditor}
                      state={descriptionState}
                      onChange={onChangeMentionsEditor}
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
              {selectedTaskSourceMessage && (
                <Grid item xs={12} style={styleEmailRow}>
                  <TaskDrawerEmailBodyContainer
                    emailBody={selectedTask.sourceMessage}
                    selectedTaskSourceMessage={selectedTaskSourceMessage}
                    taskListIdentifier={taskListIdentifier}
                  />
                </Grid>
              )}
              <Grid item xs={6} style={styleLeftColumn}>
                <PatientSection
                  selectedPatient={
                    selectedTask?.patient || selectedParentTask?.patient || null
                  }
                  disabled={
                    disabledFields.includes(DrawerFieldEnum.PATIENT) ||
                    isTemplateTask
                  }
                  placeholder={
                    isTemplateTask && 'Not available when creating a template'
                  }
                  autofocus={taskDrawerFocusField === DrawerFieldEnum.PATIENT}
                  onSave={handleUpdateTask}
                  templateBundleIdentifier={templateBundleIdentifier}
                />
              </Grid>
              <Grid item xs={6} style={styleRightColumn}>
                <AssignedToSection
                  assignedToUsers={selectedTask?.assignedToUsers}
                  taskListIdentifier={
                    isTemplateTask ? null : taskListIdentifier
                  }
                  onSave={handleUpdateTask}
                />
              </Grid>
              <Grid item xs={6} style={styleLeftColumn}>
                <div ref={dueDateSectionReference}>
                  <DueDateSection
                    selectedTask={selectedTask}
                    onDueDateChange={handleDueDateSave}
                  />
                </div>
              </Grid>
              {!isTemplateTask && (
                <Grid item xs={6} style={styleRightColumn}>
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
              {selectedTask && !isSubtask && (
                <Grid item xs={12}>
                  <SubtasksSection
                    subtasks={selectedTask.subtasks}
                    subTasksCount={selectedTask.subTasksCount}
                    taskListIdentifier={taskListIdentifier}
                    onQuickAddSubtask={handleQuickAddSubtask}
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
                    variant="secondary"
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
            selectedTask={selectedTask}
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

export default React.memo(TaskDrawer);
