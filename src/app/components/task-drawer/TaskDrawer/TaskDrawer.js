/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useMemo } from 'react';
import { FormContext } from 'react-hook-form';
import { Grid } from '@material-ui/core';
import { checkIfBundleTask } from 'helpers/task-helpers';
import Spacing from 'components/common/Spacing';
import TextEditor from 'components/common/TextEditor/TextEditor';
import { DrawerFieldEnum } from 'helpers/task-drawer-helpers';
import { convertToRaw } from 'draft-js';
import AttachmentsSection from '../AttachmentsSection/AttachmentsSection';
import CommentSection from '../CommentSection/CommentSection';
import LabelsSection from '../LabelsSection/LabelsSection';
import PrioritySection from '../PrioritySection/PrioritySection';
import TopSection from '../TopSection/TopSection';
import HistorySection from '../HistorySection/HistorySection';
import StatusSection from '../StatusSection/StatusSection';
import TaskDrawerEmailBodyContainer from '../EmailBody/EmailBody';
import ReminderSection from '../ReminderSection/ReminderSection';
import PatientSection from '../PatientSection/PatientSection';
import initializeTaskDrawerHooks from './hooks';
import existingUserTaskDrawerTourHooks from './existing-user-tour-hooks';
import {
  TaskDrawerContainer,
  TaskDrawerBackground,
  styleTaskDrawerContainer,
  styleFullRow,
  styleEmailRow,
  styleFirstRow,
  styleLeftColumn,
  styleRightColumn,
  styleLastRow,
  styleCommentRow,
  DescriptionError,
  ParentTaskButton,
  ParentTaskDescriptionPlaceholder,
  DescriptionTextContainer,
  TaskDrawerDivider,
  DetailsContainer,
  ParentTaskDescription,
  styleFullRowThin,
  styleNoPaddingRow,
} from './styled';
import AssignedToSection from '../AssignedToSection/AssignedToSection';
import DueDateSection from '../DueDateSection/DueDateSection';
import CustomTextEditor from '../CustomTextEditor/CustomTextEditor';
import QuickAddSubtask from '../QuickAddSubtask/QuickAddSubtask';
import CustomFieldsSection from '../CustomFieldsSection/CustomFieldsSection';
import DependenciesSection from '../DependenciesSection/DependenciesSection';
import SubtasksSection from '../SubtasksSection/SubtasksSection';

const isEmptyState = state => {
  const rawState = convertToRaw(state.getCurrentContent());
  const firstBlock = rawState?.blocks?.[0];
  if (firstBlock && firstBlock.text === '') {
    return true;
  }
  return false;
};

const TaskDrawer = ({
  isInbox,
  onTaskUpdate = () => {},
  onTaskCreation = () => {},
  onTaskDelete = () => {},
  disabledFields = [],
  fromFirstAddTask = false,
  hideTour = false,
}) => {
  const {
    closeTaskDrawer: handleCloseTaskDrawer,
    descriptionErrorState,
    descriptionReference,
    descriptionState,
    formMethods,
    handleDueDateSave,
    handleUpdateTask,
    isSubtask,
    isAddingOrEditingSubtask,
    isAddingSubtask,
    isDescriptionFocused,
    isSelectedTaskComplete,
    isTemplateTask,
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
    detailsReference,
    detailsState,
    onBlurDetailsEditor,
    onChangeDetailsEditor,
    onFocusDetailsEditor,
    isDetailsFocused,
    taskCustomFields,
    clearFormStates,
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
  const { handleSubmit, setValue, reset } = formMethods;
  const parentFormSubmit = handleSubmit(onSubmit);

  const isEmptyDetailsState = useMemo(() => isEmptyState(detailsState), [
    detailsState,
  ]);
  const isEmptyDescriptionState = useMemo(
    () => isEmptyState(descriptionState),
    [descriptionState],
  );

  const closeTaskDrawer = useCallback(() => {
    handleCloseTaskDrawer();
    reset();
    clearFormStates();
  }, [clearFormStates, handleCloseTaskDrawer, reset]);

  return (
    <>
      <TaskDrawerContainer
        open={taskDrawerOpen}
        onClose={closeTaskDrawer}
        ref={taskDrawerReference}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormContext {...formMethods}>
            {taskDrawerOpen && (
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
                    isInbox={isInbox}
                    closeTaskDrawer={closeTaskDrawer}
                    setAutoSaveVisible={setAutoSaveVisible}
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
                  <DescriptionTextContainer isCrossed={isSelectedTaskComplete}>
                    <CustomTextEditor
                      hasError={descriptionErrorState}
                      empty={isEmptyDescriptionState}
                      focused={isDescriptionFocused}
                      required
                      isSelectedTaskComplete={isSelectedTaskComplete}
                      label={isAddingOrEditingSubtask ? 'Subtask' : 'Task'}
                      selectedTask={selectedTask}
                    >
                      <TextEditor
                        ref={descriptionReference}
                        taskListIdentifier={taskListIdentifier}
                        disableMentions={isTemplateTask}
                        placeholder={
                          isAddingOrEditingSubtask
                            ? 'What is the subtask?'
                            : 'What is the task?'
                        }
                        onFocus={onFocusMentionsEditor}
                        onBlur={onBlurMentionsEditor}
                        state={descriptionState}
                        onChange={onChangeMentionsEditor}
                        keyBindingFn={event => {
                          if (event.key === 'Enter') {
                            return 'enter-command';
                          }

                          return undefined;
                        }}
                        handleKeyCommand={command => {
                          if (command === 'enter-command') {
                            // eslint-disable-next-line no-unused-expressions
                            descriptionReference.current?.blur();
                            return 'handled';
                          }

                          return 'not-handled';
                        }}
                      />
                    </CustomTextEditor>
                  </DescriptionTextContainer>
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
                <Grid item xs={12}>
                  <DetailsContainer>
                    <CustomTextEditor
                      empty={isEmptyDetailsState}
                      focused={isDetailsFocused}
                      label="details"
                      richTextEnabled
                    >
                      <TextEditor
                        minHeight={100}
                        ref={detailsReference}
                        taskListIdentifier={taskListIdentifier}
                        disableMentions={isTemplateTask}
                        showToolbar
                        onFocus={onFocusDetailsEditor}
                        onBlur={onBlurDetailsEditor}
                        state={detailsState}
                        onChange={onChangeDetailsEditor}
                        keyBindingFn={event => {
                          if (
                            event.keyCode === 13 &&
                            !event.nativeEvent.shiftKey
                          ) {
                            return 'enter-command';
                          }
                          return undefined;
                        }}
                        handleKeyCommand={command => {
                          if (command === 'enter-command') {
                            detailsReference.current.blur();
                            return 'handled';
                          }

                          return 'not-handled';
                        }}
                      />
                    </CustomTextEditor>
                  </DetailsContainer>
                </Grid>
                <Grid item xs={6} style={styleLeftColumn}>
                  <PatientSection
                    selectedPatient={
                      selectedTask?.patient ||
                      selectedParentTask?.patient ||
                      null
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
                <Grid item xs={6} style={styleRightColumn}>
                  {!isTemplateTask && (
                    <ReminderSection
                      selectedTask={selectedTask}
                      isDisabled={!selectedTask?.dueDate}
                      onSave={handleUpdateTask}
                    />
                  )}
                </Grid>
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
                      tasks={selectedTask.subtasks}
                      tasksCount={selectedTask.subTasksCount}
                      input={
                        <QuickAddSubtask
                          taskIdentifier={selectedTask?.identifier}
                          taskListIdentifier={taskListIdentifier}
                        />
                      }
                    />
                  </Grid>
                )}
                {selectedTask &&
                  !isSubtask &&
                  (isTemplateTask || checkIfBundleTask(selectedTask)) && (
                    <Grid item xs={12}>
                      <DependenciesSection selectedTask={selectedTask} />
                    </Grid>
                  )}
                <Grid item xs={12} style={styleCommentRow}>
                  <div ref={commentsSectionReference}>
                    <CommentSection
                      parentFormSubmit={parentFormSubmit}
                      taskDrawerFocusField={taskDrawerFocusField}
                      taskListIdentifier={taskListIdentifier}
                      isTemplateTask={isTemplateTask}
                    />
                  </div>
                </Grid>
                <Grid item xs={12} style={styleNoPaddingRow}>
                  <CustomFieldsSection
                    task={selectedTask}
                    taskCustomFields={taskCustomFields}
                  />
                </Grid>
              </Grid>
            )}
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
