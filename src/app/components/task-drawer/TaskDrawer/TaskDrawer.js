import React, { useCallback } from 'react';
import { FormContext } from 'react-hook-form';
import { Grid } from '@material-ui/core';
import { checkIfBundleTask } from 'helpers/task-helpers';
import Spacing from 'components/common/Spacing';
import TextEditor from 'components/common/TextEditor/TextEditor';
import TaskDescription from 'components/task-drawer/TaskDescription/TaskDescription';
import { DrawerFieldEnum } from 'helpers/task-drawer-helpers';
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
  ParentTaskButton,
  ParentTaskDescriptionPlaceholder,
  TaskDrawerDivider,
  ParentTaskDescription,
  styleFullRowThin,
  styleNoPaddingRow,
} from './styled';
import AssignedToSection from '../AssignedToSection/AssignedToSection';
import DueDateSection from '../DueDateSection/DueDateSection';
import QuickAddSubtask from '../QuickAddSubtask/QuickAddSubtask';
import CustomFieldsSection from '../CustomFieldsSection/CustomFieldsSection';
import DependenciesSection from '../DependenciesSection/DependenciesSection';
import SubtasksSection from '../SubtasksSection/SubtasksSection';
import TaskDetails from '../TaskDetails/TaskDetails';

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
    formMethods,
    handleDueDateSave,
    handleUpdateTask,
    isSubtask,
    isAddingSubtask,
    isTemplateTask,
    onClickParentTask,
    onDelete,
    onDuplicate,
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
  const { setValue, reset } = formMethods;

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
        {/* <form onSubmit={handleSubmit(onSubmit)}> */}
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
                templateBundleIdentifier={templateBundleIdentifier}
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
              <TaskDescription selectedTask={selectedTask} />
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
              <TaskDetails selectedTask={selectedTask} />
            </Grid>
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
                taskListIdentifier={isTemplateTask ? null : taskListIdentifier}
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
                  taskDrawerFocusField={taskDrawerFocusField}
                  taskListIdentifier={taskListIdentifier}
                  isTemplateTask={isTemplateTask}
                />
              </div>
            </Grid>
            {taskDrawerOpen && (
              <Grid item xs={12} style={styleNoPaddingRow}>
                <CustomFieldsSection
                  task={selectedTask}
                  taskCustomFields={taskCustomFields}
                />
              </Grid>
            )}
          </Grid>
        </FormContext>
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
