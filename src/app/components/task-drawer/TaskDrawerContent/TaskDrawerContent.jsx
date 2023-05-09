/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useMemo } from 'react';
import { Box, Grid, Typography, useMediaQuery } from '@material-ui/core';
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
import { isMemberAdmin } from 'helpers/list-members-helper';
import StartDateSection from 'components/task-drawer/StartDateSection/StartDateSection';
// import WatchersPopover from 'components/task-drawer/TaskDrawerContent/WatchersPopover/WatchersPopover';
import { createTaskListPath } from 'routing/helpers/paths';
import { useHistory } from 'react-router-dom';
import { currentTaskListSelector } from 'selectors/task-list-selectors';
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
  styleLeftColumn,
  styleRightColumn,
  styleCommentRow,
  ReferenceParentNamePlaceholder,
  TaskDrawerDivider,
  styleFullRowThin,
  ReferenceParentButton,
  ReferenceParentName,
  FiledInListName,
  // SubscriptionBadge,
} from './styled';

const { DISABLED, READ_ONLY } = SINGLE_TASK_RESTRICTIONS_OPTIONS;

const TaskDrawerContent = props => {
  const {
    isInbox,
    onTaskUpdate = () => {},
    onTaskCreation = () => {},
    onTaskDelete = () => {},
    disabledFields = [],
    fromFirstAddTask = false,
    hideTour = false,
    hideCloseIcon,
  } = props;
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

  const history = useHistory();

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
  const quickAddPatientEnabledItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'patient.quickadd.enabled',
    ) || {};
  const quickAddPatientEnabled = quickAddPatientEnabledItem?.value !== 'false';

  let restrictions = SINGLE_TASK_RESTRICTIONS_PROFILES[orgUserRole];
  let taskListRestrictions = TASK_LIST_RESTRICTIONS_PROFILES[orgUserRole];

  const restrictMentions = restrictions?.mentions === DISABLED;

  const selectedOrganization = useSelector(selectedUserOrganizationSelector);
  const currentTasklist = useSelector(currentTaskListSelector);
  const currentUser = useSelector(userProfileSelector);
  const isListAdmin = useMemo(() => {
    const currentUserMember = currentTasklist?.listUsers?.find(
      u => u.identifier === currentUser?.identifier,
    );
    return isMemberAdmin(currentUserMember);
  }, [currentUser, currentTasklist]);

  const isCreator = useMemo(() => {
    return selectedTask?.creator?.identifier === currentUser?.identifier;
  }, [currentUser, selectedTask]);

  if (!restrictions) {
    restrictions = {};
  }
  if (!taskListRestrictions) {
    taskListRestrictions = {};
  }

  const taskDeleteDisabled = useMemo(() => {
    const deleteDisabledItem =
      selectedOrganization?.themeSettings?.find(
        ({ name }) => name === 'list.tasks.member.delete.enabled',
      ) || {};
    return (
      deleteDisabledItem &&
      deleteDisabledItem?.value === 'false' &&
      !isListAdmin &&
      !isCreator
    );
  }, [selectedOrganization, isListAdmin, isCreator]);

  const editAssignmentDisabled = useMemo(() => {
    const editAssignmentDisabledItem =
      selectedOrganization?.themeSettings?.find(
        ({ name }) => name === 'list.tasks.member.edit.assignment.enabled',
      ) || {};
    return (
      editAssignmentDisabledItem &&
      editAssignmentDisabledItem?.value === 'false' &&
      !isListAdmin &&
      !isCreator
    );
  }, [selectedOrganization, isListAdmin, isCreator]);

  const editDueDateDisabled = useMemo(() => {
    const editDueDateDisabledItem =
      selectedOrganization?.themeSettings?.find(
        ({ name }) => name === 'list.tasks.member.edit.duedate.enabled',
      ) || {};
    return (
      editDueDateDisabledItem &&
      editDueDateDisabledItem?.value === 'false' &&
      !isListAdmin &&
      !isCreator
    );
  }, [selectedOrganization, isListAdmin, isCreator]);

  const editDescriptionDisabled = useMemo(() => {
    const editDescriptionDisabledItem =
      selectedOrganization?.themeSettings?.find(
        ({ name }) => name === 'list.tasks.member.edit.description.enabled',
      ) || {};
    return (
      editDescriptionDisabledItem &&
      editDescriptionDisabledItem?.value === 'false' &&
      !isListAdmin &&
      !isCreator
    );
  }, [selectedOrganization, isListAdmin, isCreator]);

  const editPatientDisabled = useMemo(() => {
    const editPatientDisabledItem =
      selectedOrganization?.themeSettings?.find(
        ({ name }) => name === 'list.tasks.member.edit.patient.enabled',
      ) || {};
    return (
      editPatientDisabledItem &&
      editPatientDisabledItem?.value === 'false' &&
      !isListAdmin &&
      !isCreator
    );
  }, [selectedOrganization, isListAdmin, isCreator]);

  const editStatusDisabled = useMemo(() => {
    const editStatusDisabledItem =
      selectedOrganization?.themeSettings?.find(
        ({ name }) => name === 'list.tasks.member.edit.status.enabled',
      ) || {};
    return (
      editStatusDisabledItem &&
      editStatusDisabledItem?.value === 'false' &&
      !isListAdmin &&
      !isCreator
    );
  }, [selectedOrganization, isListAdmin, isCreator]);

  const editPriorityDisabled = useMemo(() => {
    const editPriorityDisabledItem =
      selectedOrganization?.themeSettings?.find(
        ({ name }) => name === 'list.tasks.member.edit.priority.enabled',
      ) || {};
    return (
      editPriorityDisabledItem &&
      editPriorityDisabledItem?.value === 'false' &&
      !isListAdmin &&
      !isCreator
    );
  }, [selectedOrganization, isListAdmin, isCreator]);

  const editLabelsDisabled = useMemo(() => {
    const editLabelsDisabledItem =
      selectedOrganization?.themeSettings?.find(
        ({ name }) => name === 'list.tasks.member.edit.labels.enabled',
      ) || {};
    return (
      editLabelsDisabledItem &&
      editLabelsDisabledItem?.value === 'false' &&
      !isListAdmin &&
      !isCreator
    );
  }, [selectedOrganization, isListAdmin, isCreator]);

  const editSubTasksDisabled = useMemo(() => {
    const editSubTasksDisabledItem =
      selectedOrganization?.themeSettings?.find(
        ({ name }) => name === 'list.tasks.member.edit.subtasks.enabled',
      ) || {};
    return (
      editSubTasksDisabledItem &&
      editSubTasksDisabledItem?.value === 'false' &&
      !isListAdmin &&
      !isCreator
    );
  }, [selectedOrganization, isListAdmin, isCreator]);

  const nonAssigneeCompleteDisabled = useMemo(() => {
    const nonAssigneeCompleteDisabledItem =
      selectedOrganization?.themeSettings?.find(
        ({ name }) => name === 'list.tasks.non-assignee.complete.enabled',
      ) || {};
    return (
      nonAssigneeCompleteDisabledItem &&
      nonAssigneeCompleteDisabledItem?.value === 'false' &&
      selectedTask?.assignedToUsers.filter(
        user => user.identifier === currentUser.identifier,
      ).length === 0 &&
      !isCreator
    );
  }, [selectedTask, currentUser, selectedOrganization, isCreator]);

  if (taskDeleteDisabled) {
    restrictions.delete = DISABLED;
  }
  if (editAssignmentDisabled) {
    restrictions.assigment = READ_ONLY;
  }
  if (editDueDateDisabled) {
    restrictions.dueDate = DISABLED;
  }
  if (editDescriptionDisabled) {
    restrictions.description = DISABLED;
  }
  if (editPatientDisabled) {
    restrictions.patient = DISABLED;
  }
  if (editStatusDisabled) {
    restrictions.status = DISABLED;
  }
  if (editPriorityDisabled) {
    restrictions.priority = DISABLED;
  }
  if (editLabelsDisabled) {
    restrictions.labels = DISABLED;
  }
  if (editSubTasksDisabled) {
    restrictions.subtasks = DISABLED;
  }
  if (nonAssigneeCompleteDisabled) {
    taskListRestrictions.completeTask = DISABLED;
  }

  // const watchersReference = useRef(null);
  // const [isSubscriptionListOpen, setSubscriptionListOpen] = useState(false);

  // const handleSubscriptionCountClick = () => {
  //   setSubscriptionListOpen(!isSubscriptionListOpen);
  // };

  // const handleSubscriptionListClose = () => {
  //   setSubscriptionListOpen(false);
  // };

  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

  if (taskDeleteDisabled) {
    if (!restrictions) {
      restrictions = {};
    }
    restrictions.delete = DISABLED;
  }

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
          justify="space-between"
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
        <Box
          padding={isMobile ? '8px 16px' : '8px 32px'}
          sx={{ width: '100%' }}
        >
          <Grid container spacing={2}>
            <Grid item>
              <Typography sx={{ fontWeight: 'bold' }} component="span">
                List:{' '}
                <FiledInListName
                  onClick={() => {
                    history.push(
                      createTaskListPath(
                        selectedTask?.taskList?.taskListIdentifier,
                      ),
                    );
                  }}
                >
                  {selectedTask?.taskList?.listName}
                </FiledInListName>
              </Typography>
            </Grid>
            {!isSubtask && (parentBundle || taskTemplate) && (
              <Grid item>
                <Typography sx={{ fontWeight: 'bold' }} component="span">
                  WorkFlow:{' '}
                </Typography>
                <ReferenceParentButton
                  type="button"
                  onClick={handleWorkflowReferenceClick}
                >
                  <ReferenceParentName>
                    {isTemplateTask
                      ? taskTemplate.name
                      : parentBundle.groupName}
                  </ReferenceParentName>
                </ReferenceParentButton>
              </Grid>
            )}
          </Grid>

          {/* <SubscriptionBadge>
            <Chip
              label={12}
              color="primary"
              onClick={handleSubscriptionCountClick}
            />{' '}
            <span ref={watchersReference}>Watchers</span>{' '}
            <a type="button">Unwatch</a>
          </SubscriptionBadge> */}
        </Box>
        {isSubtask && (
          <Grid item xs={12} style={styleFullRowThin(isMobile)}>
            <Spacing vertical={2} />
            {selectedParentTask ? (
              <ReferenceParentButton
                type="button"
                onClick={onClickParentTask}
                style={{ width: '100%' }}
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
        {/* {!isSubtask && (parentBundle || taskTemplate) && (
          <Grid item xs={6} style={styleFullRowThin(isMobile)}>
            <Spacing horizontal={2} />
            <Typography component="span">WorkFlow: </Typography>
            <ReferenceParentButton
              type="button"
              onClick={handleWorkflowReferenceClick}
            >
              <ReferenceParentName>
                {isTemplateTask ? taskTemplate.name : parentBundle.groupName}
              </ReferenceParentName>
            </ReferenceParentButton>
          </Grid>
        )} */}
        <Grid item xs={12} style={styleFullRow(isMobile)}>
          <TaskDescription
            readOnly={restrictions?.description === READ_ONLY}
            disableMentions={restrictMentions}
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
        <Grid item xs={12} md={6} style={styleLeftColumn(isMobile)}>
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
            quickAddPatientEnabled={quickAddPatientEnabled}
          />
        </Grid>
        <Grid item xs={12} md={6} style={styleRightColumn(isMobile)}>
          <AssignedToSection
            onSave={handleUpdateTask}
            disabled={restrictions?.assigment === READ_ONLY}
          />
        </Grid>
        {!taskStartDateDisabled && (
          <Grid item xs={12} md={6} style={styleLeftColumn(isMobile)}>
            <div>
              <StartDateSection
                disabled={restrictions?.startDate === DISABLED}
              />
            </div>
          </Grid>
        )}
        {!taskStartDateDisabled && (
          <Grid item xs={12} md={6} style={styleRightColumn(isMobile)}>
            <div />
          </Grid>
        )}
        <Grid item xs={12} md={6} style={styleLeftColumn(isMobile)}>
          <div>
            <DueDateSection disabled={restrictions?.dueDate === DISABLED} />
          </div>
        </Grid>
        <Grid item xs={12} md={6} style={styleRightColumn(isMobile)}>
          {!isTemplateTask && (
            <ReminderSection
              onSave={handleUpdateTask}
              disabled={restrictions?.reminder === DISABLED}
            />
          )}
        </Grid>
        <Grid item xs={12} md={6} style={styleLeftColumn(isMobile)}>
          <PrioritySection
            onTaskUpdate={onTaskUpdate}
            disabled={restrictions?.priority === DISABLED}
          />
        </Grid>
        <Grid item xs={12} md={6} style={styleRightColumn(isMobile)}>
          <div>
            <StatusSection
              onTaskUpdate={onTaskUpdate}
              disabled={restrictions?.status === DISABLED}
            />
          </div>
        </Grid>
        {/* Put custom fields here */}
        {restrictions?.customFields !== DISABLED && (
          <Grid item xs={12} style={styleFullRow(isMobile)}>
            <CustomFieldsSection fieldCategoryType="TASK_CORE" />
          </Grid>
        )}
        {restrictions?.labels !== DISABLED && taskLabelsLocation === 'default' && (
          <Grid item xs={12} style={styleFullRow(isMobile)}>
            <div>
              <LabelsSection onTaskUpdate={onTaskUpdate} />
            </div>
          </Grid>
        )}
        {!taskAttachmentsDisabled && (
          <Grid item xs={12} style={styleFullRow(isMobile)}>
            <AttachmentsSection
              restrictions={restrictions?.attachments}
              disabled={restrictions?.attachments === DISABLED}
            />
          </Grid>
        )}
        <Grid item xs={12} style={styleCommentRow}>
          <div>
            <CommentSection />
          </div>
        </Grid>
        {selectedTask && !isSubtask && !subTasksDisabled && (
          <Grid item xs={12}>
            <SubtasksSection restrictions={restrictions?.subtasks} />
          </Grid>
        )}
        {restrictions?.dependencies !== DISABLED &&
          selectedTask &&
          !isSubtask &&
          (isTemplateTask || checkIfBundleTask(selectedTask)) && (
            <Grid item xs={12}>
              <DependenciesSection />
            </Grid>
          )}
        {restrictions?.customFields !== DISABLED && (
          <Grid item xs={12} style={styleFullRow(isMobile)}>
            <CustomFieldsSection fieldCategoryType="TASK_OTHER" />
          </Grid>
        )}
        {restrictions?.labels !== DISABLED && taskLabelsLocation === 'bottom' && (
          <Grid item xs={12} style={styleFullRow(isMobile)}>
            <div>
              <LabelsSection onTaskUpdate={onTaskUpdate} />
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
          <HistorySection />
        </Grid>
      )}
      <TaskDrawerBackground onClick={closeTaskDrawer} />
      {/* <WatchersPopover
        open={isSubscriptionListOpen}
        anchorEl={watchersReference.current}
        onClose={handleSubscriptionListClose}
      /> */}
    </TaskDrawerContainer>
  );
};

export default TaskDrawerContent;
