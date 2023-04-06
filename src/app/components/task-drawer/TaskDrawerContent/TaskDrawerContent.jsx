/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useRef, useState } from 'react';
import { Box, Chip, Grid, Typography, useMediaQuery } from '@mui/material';
import { checkIfBundleTask } from 'helpers/task-helpers';
import Spacing from 'components/common/Spacing';
import TextEditor from 'components/common/TextEditor/TextEditor';
import TaskDescription from 'components/task-drawer/TaskDescription/TaskDescription';
import { DrawerFieldEnum } from 'helpers/task-drawer-helpers';
import { useSelector } from 'react-redux';
import {
  userProfileSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import {
  SINGLE_TASK_RESTRICTIONS_PROFILES,
  SINGLE_TASK_RESTRICTIONS_OPTIONS,
  TASK_LIST_RESTRICTIONS_PROFILES,
} from 'restrictions/task-restrictions';
import StartDateSection from 'components/workflow-drawer/StartDateSection/StartDateSection';
import WatchersPopover from 'components/task-drawer/TaskDrawerContent/WatchersPopover/WatchersPopover';
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
import AssignedToSection from '../AssignedToSection/AssignedToSection';
import DueDateSection from '../DueDateSection/DueDateSection';
import CustomFieldsSection from '../CustomFieldsSection/CustomFieldsSection';
import DependenciesSection from '../DependenciesSection/DependenciesSection';
import SubtasksSection from '../SubtasksSection/SubtasksSection';
import TaskDetails from '../TaskDetails/TaskDetails';
import {
  TaskDrawerContainer,
  TaskDrawerBackground,
  styleTaskDrawerContainer,
  styleFullRow,
  styleEmailRow,
  styleFirstRow,
  styleCommentRow,
  ReferenceParentNamePlaceholder,
  TaskDrawerDivider,
  styleFullRowThin,
  ReferenceParentButton,
  ReferenceParentName,
  FiledInListName,
  SubscriptionBadge,
} from './styled';

const { DISABLED, READ_ONLY } = SINGLE_TASK_RESTRICTIONS_OPTIONS;

const TaskDrawerContent = ({
  isInbox,
  onTaskUpdate = () => {},
  onTaskCreation = () => {},
  onTaskDelete = () => {},
  disabledFields = [],
  fromFirstAddTask = false,
  hideTour = false,
  hideCloseIcon,
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
    taskTemplate,
    handleWorkflowReferenceClick,
    clearFormStates,
    handleCopyLink,
  } = initializeTaskDrawerHooks({
    isInbox,
    onTaskUpdate,
    onTaskCreation,
    onTaskDelete,
    fromFirstAddTask,
    hideTour,
  });

  const closeTaskDrawer = useCallback(() => {
    handleCloseTaskDrawer();
    clearFormStates();
  }, [clearFormStates, handleCloseTaskDrawer]);

  const { orgUserRole } = useSelector(userProfileSelector);
  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const taskAttachmentsDisabled =
    currentOrganization?.disabledFeatures?.includes('TASK_ATTACHMENTS') ||
    false;
  const taskStartDateDisabled =
    currentOrganization?.disabledFeatures?.includes('TASK_START_DATE') || false;
  const subTasksDisabled =
    currentOrganization?.disabledFeatures?.includes('TASK_SUBTASKS') || false;

  const taskLabelsLocationItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'task.labels.location',
    ) || {};
  const taskLabelsLocation = taskLabelsLocationItem?.value || 'default';

  const restrictions = SINGLE_TASK_RESTRICTIONS_PROFILES[orgUserRole];
  const taskListRestrictions = TASK_LIST_RESTRICTIONS_PROFILES[orgUserRole];

  const restrictMentions = restrictions?.mentions === DISABLED;

  const watchersReference = useRef(null);
  const [isSubscriptionListOpen, setSubscriptionListOpen] = useState(false);

  const handleSubscriptionCountClick = () => {
    setSubscriptionListOpen(!isSubscriptionListOpen);
  };

  const handleSubscriptionListClose = () => {
    setSubscriptionListOpen(false);
  };

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
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
          justifyContent="space-between"
          style={styleFirstRow(isMobile)}
        >
          <TopSection
            handleCopyLink={handleCopyLink}
            hideCloseIcon={hideCloseIcon}
            restrictions={restrictions}
            taskListRestrictions={taskListRestrictions}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            closeTaskDrawer={closeTaskDrawer}
          />
        </Grid>
        {selectedTask && <TaskDrawerDivider />}
        <Box padding="0 32px" sx={{ width: '100%' }}>
          <Typography component="span">
            List:{' '}
            <FiledInListName>
              {selectedTask?.taskList?.listName}
            </FiledInListName>
          </Typography>
          <SubscriptionBadge>
            <Chip
              label={12}
              color="primary"
              onClick={handleSubscriptionCountClick}
            />{' '}
            <span ref={watchersReference}>Watchers</span>{' '}
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a type="button">Unwatch</a>
          </SubscriptionBadge>
        </Box>
        <Box display="flex" padding={isMobile ? '0 16px' : '0 32px'}>
          <Typography>List: </Typography>
          <Spacing horizontal={3} />
          <FiledInListName>{selectedTask?.taskList?.listName}</FiledInListName>
        </Box>
        {isSubtask && (
          <Grid item xs={12} style={styleFullRowThin(isMobile)}>
            <Spacing vertical={2} />
            {selectedParentTask ? (
              <ReferenceParentButton type="button" onClick={onClickParentTask}>
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
        {!isSubtask && (parentBundle || taskTemplate) && (
          <Grid item xs={12} style={styleFullRowThin(isMobile)}>
            <Spacing vertical={2} />
            <ReferenceParentButton
              type="button"
              onClick={handleWorkflowReferenceClick}
            >
              <ReferenceParentName>
                {isTemplateTask ? taskTemplate.name : parentBundle.groupName}
              </ReferenceParentName>
            </ReferenceParentButton>
          </Grid>
        )}
        <Grid item xs={12} style={styleFullRow(isMobile)}>
          <TaskDescription
            readOnly={restrictions?.description === READ_ONLY}
            disableMentions={restrictMentions}
            selectedTask={selectedTask}
          />
        </Grid>
        {selectedTask?.sourceMessage && (
          <Grid item xs={12} style={styleEmailRow(isMobile)}>
            <TaskDrawerEmailBodyContainer />
          </Grid>
        )}
        <Grid item xs={12} style={styleFullRow(isMobile)}>
          <TaskDetails
            readOnly={restrictions?.taskDetails === READ_ONLY}
            disableMentions={restrictMentions}
          />
        </Grid>
        <Grid item xs={6} style={styleFullRow(isMobile)}>
          <PatientSection
            selectedPatient={
              selectedTask?.patient || selectedParentTask?.patient || null
            }
            disabled={
              restrictions?.patient === READ_ONLY ||
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
        <Grid item xs={6} style={styleFullRow(isMobile)}>
          <AssignedToSection
            onSave={handleUpdateTask}
            disabled={restrictions?.assigment === READ_ONLY}
            selectedTask={selectedTask}
          />
        </Grid>
        {!taskStartDateDisabled && (
          <Grid item xs={6} style={styleFullRow(isMobile)}>
            <div>
              <StartDateSection
                disabled={restrictions?.startDate === DISABLED}
                selectedTask={selectedTask}
              />
            </div>
          </Grid>
        )}
        {!taskStartDateDisabled && (
          <Grid item xs={6} style={styleFullRow(isMobile)}>
            <div />
          </Grid>
        )}
        <Grid item xs={6} style={styleFullRow(isMobile)}>
          <div>
            <DueDateSection
              disabled={restrictions?.dueDate === DISABLED}
              selectedTask={selectedTask}
            />
          </div>
        </Grid>
        <Grid item xs={6} style={styleFullRow(isMobile)}>
          {!isTemplateTask && (
            <ReminderSection
              onSave={handleUpdateTask}
              disabled={restrictions?.reminder === DISABLED}
              selectedTask={selectedTask}
            />
          )}
        </Grid>
        <Grid item xs={6} style={styleFullRow(isMobile)}>
          <PrioritySection
            onTaskUpdate={onTaskUpdate}
            disabled={restrictions?.priority === DISABLED}
            selectedTask={selectedTask}
          />
        </Grid>
        <Grid item xs={6} style={styleFullRow(isMobile)}>
          <div>
            <StatusSection
              onTaskUpdate={onTaskUpdate}
              disabled={restrictions?.status === DISABLED}
              selectedTask={selectedTask}
            />
          </div>
        </Grid>
        {/* Put custom fields here */}
        {restrictions?.customFields !== DISABLED && (
          <Grid item xs={12} style={styleFullRow(isMobile)}>
            <CustomFieldsSection fieldCategoryType="TASK_CORE" />
          </Grid>
        )}
        {restrictions?.labels !== DISABLED &&
          taskLabelsLocation === 'default' && (
            <Grid item xs={12} style={styleFullRow(isMobile)}>
              <div>
                <LabelsSection
                  onTaskUpdate={onTaskUpdate}
                  selectedTask={selectedTask}
                />
              </div>
            </Grid>
          )}
        {!taskAttachmentsDisabled && (
          <Grid item xs={12} style={styleFullRow(isMobile)}>
            <AttachmentsSection
              restrictions={restrictions?.attachments}
              disabled={restrictions?.attachments === DISABLED}
              selectedTask={selectedTask}
            />
          </Grid>
        )}
        <Grid item xs={12} style={styleCommentRow}>
          <div>
            <CommentSection selectedTask={selectedTask} />
          </div>
        </Grid>
        {selectedTask && !isSubtask && !subTasksDisabled && (
          <Grid item xs={12}>
            <SubtasksSection
              restrictions={restrictions?.subtasks}
              selectedTask={selectedTask}
            />
          </Grid>
        )}
        {restrictions?.dependencies !== DISABLED &&
          selectedTask &&
          !isSubtask &&
          (isTemplateTask || checkIfBundleTask(selectedTask)) && (
            <Grid item xs={12}>
              <DependenciesSection selectedTask={selectedTask} />
            </Grid>
          )}
        {restrictions?.customFields !== DISABLED && (
          <Grid item xs={12} style={styleFullRow(isMobile)}>
            <CustomFieldsSection fieldCategoryType="TASK_OTHER" />
          </Grid>
        )}
        {restrictions?.labels !== DISABLED &&
          taskLabelsLocation === 'bottom' && (
            <Grid item xs={12} style={styleFullRow(isMobile)}>
              <div>
                <LabelsSection
                  onTaskUpdate={onTaskUpdate}
                  selectedTask={selectedTask}
                />
              </div>
            </Grid>
          )}
      </Grid>
      <TaskDrawerDivider />
      {restrictions?.history !== DISABLED && (
        <Grid container item xs={12} style={styleFullRow(isMobile)}>
          <div>
            <Spacing horizontal={5} />
            <span />
          </div>
          <HistorySection
            selectedTask={selectedTask}
            selectedTaskIdentifier={selectedTask?.identifier}
          />
        </Grid>
      )}
      {taskDrawerOpen && <TaskDrawerBackground onClick={closeTaskDrawer} />}
      <WatchersPopover
        open={isSubscriptionListOpen}
        anchorEl={watchersReference.current}
        onClose={handleSubscriptionListClose}
      />
    </TaskDrawerContainer>
  );
};

export default TaskDrawerContent;
