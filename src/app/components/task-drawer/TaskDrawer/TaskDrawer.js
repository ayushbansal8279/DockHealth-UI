/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback } from 'react';
import { AnimatePresence } from 'framer-motion/dist/framer-motion';
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
  AnimatedContainer,
  TaskDrawerContainer,
  TaskDrawerBackground,
  styleTaskDrawerContainer,
  styleFullRow,
  styleEmailRow,
  styleFirstRow,
  styleLeftColumn,
  styleRightColumn,
  styleCommentRow,
  ReferenceParentNamePlaceholder,
  TaskDrawerDivider,
  styleFullRowThin,
  styleNoPaddingRow,
  ReferenceParentButton,
  ReferenceParentName,
} from './styled';
import AssignedToSection from '../AssignedToSection/AssignedToSection';
import DueDateSection from '../DueDateSection/DueDateSection';
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
    handleUpdateTask,
    isSubtask,
    isTemplateTask,
    onClickParentTask,
    onDelete,
    onDuplicate,
    parentDescriptionState,
    selectedParentTask,
    selectedTask,
    setParentDescriptionState,
    taskDrawerFocusField,
    taskDrawerOpen,
    taskDrawerReference,
    taskListIdentifier,
    parentBundle,
    handleWorkflowReferenceClick,
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
  const closeTaskDrawer = useCallback(() => {
    handleCloseTaskDrawer();
    clearFormStates();
  }, [clearFormStates, handleCloseTaskDrawer]);

  return (
    <>
      <AnimatePresence initial={false}>
        {taskDrawerOpen && (
          <AnimatedContainer
            initial={{ translateX: '100%' }}
            animate={{ translateX: 0 }}
            exit={{ translateX: '100%' }}
            transition={{ duration: 0.3, bounce: 0 }}
          >
            <TaskDrawerContainer
              key={selectedTask?.identifier}
              ref={taskDrawerReference}
            >
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
                    onDelete={onDelete}
                    onDuplicate={onDuplicate}
                    closeTaskDrawer={closeTaskDrawer}
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
                      <ReferenceParentButton
                        type="button"
                        onClick={onClickParentTask}
                      >
                        <ReferenceParentName>
                          <TextEditor
                            readOnly
                            withEditedLabel={selectedParentTask.edited}
                            state={parentDescriptionState}
                            onChange={setParentDescriptionState}
                            taskListIdentifier={taskListIdentifier}
                            disableMentions={isTemplateTask}
                          />
                        </ReferenceParentName>
                      </ReferenceParentButton>
                    ) : (
                      <ReferenceParentNamePlaceholder />
                    )}
                  </Grid>
                )}
                {!isSubtask && parentBundle && (
                  <Grid item xs={12} style={styleFullRowThin}>
                    <Spacing vertical={4} />
                    <ReferenceParentButton
                      type="button"
                      onClick={handleWorkflowReferenceClick}
                    >
                      <ReferenceParentName>
                        {parentBundle.groupName}
                      </ReferenceParentName>
                    </ReferenceParentButton>
                  </Grid>
                )}
                <Grid item xs={12} style={styleFullRow}>
                  <TaskDescription />
                </Grid>
                {selectedTask?.sourceMessage && (
                  <Grid item xs={12} style={styleEmailRow}>
                    <TaskDrawerEmailBodyContainer />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <TaskDetails />
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
                  />
                </Grid>
                <Grid item xs={6} style={styleRightColumn}>
                  <AssignedToSection onSave={handleUpdateTask} />
                </Grid>
                <Grid item xs={6} style={styleLeftColumn}>
                  <div ref={dueDateSectionReference}>
                    <DueDateSection />
                  </div>
                </Grid>
                <Grid item xs={6} style={styleRightColumn}>
                  {!isTemplateTask && (
                    <ReminderSection onSave={handleUpdateTask} />
                  )}
                </Grid>
                <Grid item xs={6} style={styleLeftColumn}>
                  <PrioritySection onTaskUpdate={onTaskUpdate} />
                </Grid>
                <Grid item xs={6} style={styleRightColumn}>
                  <div ref={statusSectionReference}>
                    <StatusSection onTaskUpdate={onTaskUpdate} />
                  </div>
                </Grid>
                <Grid item xs={12} style={styleFullRow}>
                  <div ref={labelsSectionReference}>
                    <LabelsSection onTaskUpdate={onTaskUpdate} />
                  </div>
                </Grid>
                <Grid item xs={12} style={styleFullRow}>
                  <AttachmentsSection />
                </Grid>
                {selectedTask && !isSubtask && (
                  <Grid item xs={12}>
                    <SubtasksSection />
                  </Grid>
                )}
                {selectedTask &&
                  !isSubtask &&
                  (isTemplateTask || checkIfBundleTask(selectedTask)) && (
                    <Grid item xs={12}>
                      <DependenciesSection />
                    </Grid>
                  )}
                <Grid item xs={12} style={styleCommentRow}>
                  <div ref={commentsSectionReference}>
                    <CommentSection />
                  </div>
                </Grid>
                {taskDrawerOpen && (
                  <Grid item xs={12} style={styleNoPaddingRow}>
                    <CustomFieldsSection />
                  </Grid>
                )}
              </Grid>
              <TaskDrawerDivider />
              <Grid container item xs={12} style={styleFullRow}>
                <div>
                  <Spacing horizontal={5} />
                  <span ref={historySectionReference} />
                </div>
                <HistorySection />
              </Grid>
              {renderExistingUserTourPopover()}
            </TaskDrawerContainer>
          </AnimatedContainer>
        )}
      </AnimatePresence>
      {taskDrawerOpen && <TaskDrawerBackground onClick={closeTaskDrawer} />}
    </>
  );
};

export default React.memo(TaskDrawer);
