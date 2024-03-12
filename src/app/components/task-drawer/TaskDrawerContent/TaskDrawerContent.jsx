/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useMemo } from 'react';
import { Box, Grid, Typography, useMediaQuery } from '@mui/material';
import { checkIfBundleTask } from 'helpers/task-helpers';
import Spacing from 'components/common/Spacing';
import RichTextEditor from 'components/common/RichTextEditor/RichTextEditor';
import TaskDescription from 'components/task-drawer/TaskDescription/TaskDescription';
import { DrawerFieldEnum } from 'helpers/task-drawer-helpers';
import { useSelector, useDispatch } from 'react-redux';
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
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import AddComment from 'components/drawer-common/AddComment/AddComment';
// import WatchersPopover from 'components/task-drawer/TaskDrawerContent/WatchersPopover/WatchersPopover';
import { createTaskListPath } from 'routing/helpers/paths';
import { useHistory } from 'react-router-dom';
import { currentTaskListSelector } from 'selectors/task-list-selectors';
import { addComment } from 'actions/task-actions';
import palette from 'styles/palette';
import AttachmentsSection from '../AttachmentsSection/AttachmentsSection';
import CommentSection from '../CommentSection/CommentSection';
import LabelsSection from '../LabelsSection/LabelsSection';
import PrioritySection from '../PrioritySection/PrioritySection';
import TopSection from '../TopSection/TopSection';
import HistorySection from '../HistorySection/HistorySection';
import StatusSection from '../StatusSection/StatusSection';
import TaskDrawerEmailBodyContainer from '../EmailBody/EmailBody';
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
import ReminderSection from '../ReminderSection/ReminderSection';
import StartDateSection from '../StartDateSection/StartDateSection';

const { DISABLED, READ_ONLY } = SINGLE_TASK_RESTRICTIONS_OPTIONS;

const TaskDrawerContent = (props) => {
  const {
    isInbox,
    onTaskUpdate = () => {},
    onTaskCreation = () => {},
    onTaskDelete = () => {},
    disabledFields = [],
    fromFirstAddTask = false,
    hideTour = false,
    hideCloseIcon,
    stickyHeader = false,
    origin,
  } = props;
  const {
    closeTaskDrawer: handleCloseTaskDrawer,
    handleUpdateTask,
    isSubtask,
    isTemplateTask,
    onClickParentTask,
    onDelete,
    onDuplicate,
    // parentDescriptionState,
    selectedParentTask,
    selectedTask,
    // setParentDescriptionState,
    taskDrawerFocusField,
    taskDrawerOpen,
    taskDrawerReference,
    // taskListIdentifier,
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
    origin,
  });

  const closeTaskDrawer = useCallback(() => {
    handleCloseTaskDrawer();
    clearFormStates();
  }, [clearFormStates, handleCloseTaskDrawer]);

  const history = useHistory();
  const dispatch = useDispatch();

  const { orgUserRole } = useSelector(userProfileSelector);
  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const taskAttachmentsDisabled =
    currentOrganization?.disabledFeatures?.includes('TASK_ATTACHMENTS') ||
    false;
  const subTasksDisabled =
    currentOrganization?.disabledFeatures?.includes('TASK_SUBTASKS') || false;
  
  const taskStartDateDisabled =
    currentOrganization?.disabledFeatures?.includes('TASK_START_DATE') || false;

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
  const taskListIdentifier = selectedTask?.taskList?.taskListIdentifier;

  const selectedOrganization = useSelector(selectedUserOrganizationSelector);
  const currentTasklist = useSelector(currentTaskListSelector);
  const currentUser = useSelector(userProfileSelector);
  const isListAdmin = useMemo(() => {
    const currentUserMember = currentTasklist?.listUsers?.find(
      (u) => u.identifier === currentUser?.identifier,
    );
    const isOwnerOrAdmin = checkIfUserIsOrganizationAdmin(currentUser);
    return isMemberAdmin(currentUserMember) || isOwnerOrAdmin;
  }, [currentUser, currentTasklist]);

  const isCreator = useMemo(() => {
    return (
      !parentBundle &&
      selectedTask?.creator?.identifier === currentUser?.identifier
    );
  }, [currentUser, selectedTask, parentBundle]);

  if (!restrictions) {
    restrictions = {};
  }
  if (!taskListRestrictions) {
    taskListRestrictions = {};
  }
  const setConfig = (
    themeSettingName,
    restrictionsConfig,
    configName,
    configValue,
  ) => {
    const enabledItem =
      selectedOrganization?.themeSettings?.find(
        ({ name }) => name === themeSettingName,
      ) || {};
    const enabledValue =
      enabledItem &&
      enabledItem?.value === 'false' &&
      !isListAdmin &&
      !isCreator;

    if (enabledValue) {
      // eslint-disable-next-line no-param-reassign
      restrictionsConfig[configName] = configValue;
    }
  };
  setConfig(
    'list.tasks.member.delete.enabled',
    restrictions,
    'delete',
    DISABLED,
  );
  setConfig(
    'list.tasks.member.move.list.enabled',
    restrictions,
    'move',
    DISABLED,
  );
  setConfig(
    'list.tasks.member.duplicate.enabled',
    restrictions,
    'duplicate',
    DISABLED,
  );
  setConfig(
    'list.tasks.member.edit.assignment.enabled',
    restrictions,
    'assigment',
    READ_ONLY,
  );
  setConfig(
    'list.tasks.member.edit.duedate.enabled',
    restrictions,
    'dueDate',
    DISABLED,
  );
  setConfig(
    'list.tasks.member.edit.description.enabled',
    restrictions,
    'description',
    DISABLED,
  );
  setConfig(
    'list.tasks.member.edit.patient.enabled',
    restrictions,
    'patient',
    DISABLED,
  );
  setConfig(
    'list.tasks.member.edit.status.enabled',
    restrictions,
    'status',
    DISABLED,
  );
  setConfig(
    'list.tasks.member.edit.priority.enabled',
    restrictions,
    'priority',
    DISABLED,
  );
  setConfig(
    'list.tasks.member.edit.labels.enabled',
    restrictions,
    'labels',
    DISABLED,
  );
  setConfig(
    'list.tasks.member.edit.subtasks.enabled',
    restrictions,
    'subtasks',
    DISABLED,
  );
  const nonAssigneeCompleteDisabled = useMemo(() => {
    const nonAssigneeCompleteDisabledItem =
      selectedOrganization?.themeSettings?.find(
        ({ name }) => name === 'list.tasks.non-assignee.complete.enabled',
      ) || {};
    return (
      nonAssigneeCompleteDisabledItem &&
      nonAssigneeCompleteDisabledItem?.value === 'false' &&
      selectedTask?.assignedToUsers?.filter(
        (user) => user.identifier === currentUser.identifier,
      ).length === 0 &&
      !isCreator
    );
  }, [selectedTask, currentUser, selectedOrganization, isCreator]);
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

  const taskDeleteDisabled = useMemo(() => {
    const disabledSettingItem =
      selectedOrganization?.themeSettings?.find(
        ({ name: themeName }) =>
          themeName === 'list.tasks.member.delete.enabled',
      ) || {};
    return (
      disabledSettingItem &&
      disabledSettingItem?.value === 'false' &&
      !isListAdmin &&
      !isCreator
    );
  }, [selectedOrganization, isListAdmin, isCreator]);

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const boundAddComment = useCallback(
    (comment) =>
      addComment(selectedTask, {
        comment,
        creator: currentUser,
      })(dispatch),
    [currentUser, dispatch, selectedTask],
  );

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
          style={{
            paddingTop: '0',
            marginTop: '0',
            height: '60px',
            position: stickyHeader ? 'fixed' : 'relative',
            width: '800px',
            zIndex: '1000000',
          }}
        >
          <TopSection
            handleCopyLink={handleCopyLink}
            hideCloseIcon={hideCloseIcon}
            restrictions={restrictions}
            taskListRestrictions={taskListRestrictions}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            closeTaskDrawer={closeTaskDrawer}
            style={{ position: 'sticky' }}
          />
        </Grid>
        {selectedTask && <TaskDrawerDivider style={{ marginTop: '60px' }} />}
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
            <Typography sx={{ fontWeight: 'bold' }} component="span">
              Parent Task:{' '}
            </Typography>
            {selectedParentTask ? (
              <ReferenceParentButton
                type="button"
                onClick={onClickParentTask}
                style={{ width: '85%' }}
              >
                <ReferenceParentName>
                  <RichTextEditor
                    height={60}
                    readonly
                    showToolbar={false}
                    value={selectedParentTask?.description}
                    initOnClick
                    showCharCount
                    taskListIdentifier={
                      selectedParentTask?.taskList?.taskListIdentifier
                    }
                    mentions={selectedParentTask?.taskMentions}
                  />
                </ReferenceParentName>
              </ReferenceParentButton>
            ) : (
              <ReferenceParentNamePlaceholder />
            )}
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
        <Grid item xs={12} mb={3} style={styleFullRow(isMobile)}>
          <TaskDetails
            readOnly={restrictions?.description === READ_ONLY}
            disableMentions={restrictMentions}
          />
        </Grid>
        <Grid item xs={12} ml={3} mb={1} style={styleRightColumn(isMobile)}>
          <AssignedToSection
            onSave={handleUpdateTask}
            disabled={restrictions?.assigment === READ_ONLY}
            selectedTask={selectedTask}
          />
        </Grid>
        <Grid item xs={12} mb={1} style={styleLeftColumn(isMobile)}>
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
        {/* May be later we need start date in Drawer */}
        {/* {!taskStartDateDisabled && (
          <Grid item xs={12} mb={1} style={styleLeftColumn(isMobile)}>
            <div>
              <StartDateSection
                disabled={restrictions?.startDate === DISABLED}
                selectedTask={selectedTask}
              />
            </div>
          </Grid>
        )} */}
        <Grid item xs={12} style={styleLeftColumn(isMobile)}>
          <div>
            <DueDateSection
              disabled={restrictions?.dueDate === DISABLED}
              selectedTask={selectedTask}
            />
          </div>
        </Grid>
        <Grid item xs={12} ml={3} style={styleRightColumn(isMobile)}>
          {!isTemplateTask && (
            <ReminderSection
              onSave={handleUpdateTask}
              disabled={restrictions?.reminder === DISABLED}
              selectedTask={selectedTask}
            />
          )}
        </Grid>
        <Grid item xs={12} style={styleLeftColumn(isMobile)}>
          <PrioritySection
            onTaskUpdate={onTaskUpdate}
            disabled={restrictions?.priority === DISABLED}
            selectedTask={selectedTask}
          />
        </Grid>
        <Grid item xs={12} ml={3} style={styleRightColumn(isMobile)}>
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
          <Grid item xs={12}>
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
        <TaskDrawerDivider />
        {!taskAttachmentsDisabled && (
          <Grid item xs={12} style={styleFullRow(isMobile)}>
            <AttachmentsSection
              restrictions={restrictions?.attachments}
              disabled={restrictions?.attachments === DISABLED}
              selectedTask={selectedTask}
            />
          </Grid>
        )}
        <TaskDrawerDivider />
        <Grid item xs={12} style={styleCommentRow}>
          <div>
            <CommentSection selectedTask={selectedTask} />
          </div>
        </Grid>
        {selectedTask && !isSubtask && !subTasksDisabled && (
          <Grid item xs={12}>
            <SubtasksSection
              restrictions={restrictions?.subtasks}
              taskRestrictions={restrictions}
              taskListRestrictions={taskListRestrictions}
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
          <HistorySection
            selectedTask={selectedTask}
            selectedTaskIdentifier={selectedTask?.identifier}
          />
        </Grid>
      )}
      {taskDrawerOpen && <TaskDrawerBackground onClick={closeTaskDrawer} />}
      {/* <WatchersPopover
        open={isSubscriptionListOpen}
        anchorEl={watchersReference.current}
        onClose={handleSubscriptionListClose}
      /> */}
      {restrictions?.comments !== DISABLED && (
        <Box
          sx={{
            position: 'sticky',
            bottom: '0%',
            left: 0,
            px: 4,
            py: 1,
            backgroundColor: palette.blueGrey,
            borderTop: `1px solid ${palette.zinc}`,
            zIndex: 3,
          }}
        >
          <AddComment
            autoFocus={taskDrawerFocusField === DrawerFieldEnum.COMMENT}
            taskListIdentifier={taskListIdentifier}
            onAdd={boundAddComment}
          />
        </Box>
      )}
    </TaskDrawerContainer>
  );
};

export default TaskDrawerContent;
