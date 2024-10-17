import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { useHistory } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
import * as WorkflowDrawerActions from 'actions/workflow-drawer-actions';
import compose from 'ramda/src/compose';
import { useDispatch, useSelector } from 'react-redux';
import {
  commentIdentifierToScrollSelector,
  isWorkflowDrawerOpenSelector,
  workflowIdentifierSelector,
  workflowSelector,
} from 'selectors/workflow-drawer-selectors';
import WorkflowDrawerHeader from 'components/workflow-drawer/DrawerHeader/DrawerHeader';
import { checkIfTemplateWorkflow } from 'helpers/workflow-helpers';
import { userProfileSelector } from 'selectors/user-selectors';
import {
  SINGLE_WORKFLOW_RESTRICTIONS_PROFILES,
  WORKFLOW_LIST_RESTRICTIONS_OPTIONS,
} from 'restrictions/task-restrictions';
import * as WorkflowActions from 'actions/workflow-actions';
import {
  getCommentIdToScroll,
  scrollToByQuerySelector,
} from 'helpers/scroll-helper';
import { FiledInListName } from 'components/task-drawer/TaskDrawerContent/styled';
import { createTaskListPath } from 'routing/helpers/paths';
import { currentTaskListSelector } from 'selectors/task-list-selectors';
import CustomFieldsSection from 'components/task-drawer/CustomFieldsSection/CustomFieldsSection';
import StickyAddComment from 'components/drawer-common/AddComment/StickyAddComment';
import moment from 'moment';
import NameSection from '../NameSection/NameSection';
import DescriptionSection from '../DescriptionSection/DescriptionSection';
import PatientSection from '../PatientSection/PatientSection';
import AssignedToSection from '../AssignedToSection/AssignedToSection';
import HistorySection from '../HistorySection/HistorySection';
import DueDateSection from '../DueDateSection/DueDateSection';
import ReminderSection from '../ReminderSection/ReminderSection';
import PrioritySection from '../PrioritySection/PrioritySection';
import StatusSection from '../StatusSection/StatusSection';
import LabelsSection from '../LabelsSection/LabelsSection';
import CommentSection from '../CommentSection/CommentSection';
import AttachmentSection from '../AttachmentSection/AttachmentSection';
import TasksSection from '../TasksSection/TasksSection';
import {
  Backdrop,
  AnimatedContainer,
  WorkflowDrawerContainer,
  SectionContainer,
  SectionSpacer,
  DeployTextContainer,
} from './styled';
import StartDateSection from '../StartDateSection/StartDateSection';
import AnchorDateSection from '../AnchorDateSection/AnchorDateSection';

const { DISABLED } = WORKFLOW_LIST_RESTRICTIONS_OPTIONS;

const WorkflowDrawer = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const open = useSelector(isWorkflowDrawerOpenSelector);
  const selectedWorkflow = useSelector(workflowSelector);
  const [isOverdue, setIsOverdue] = useState(false);
  const commentIdentifierToScroll = useSelector(
    commentIdentifierToScrollSelector,
  );
  const isTemplateTask = useMemo(
    () => checkIfTemplateWorkflow(selectedWorkflow),
    [selectedWorkflow],
  );
  const workflowIdentifier = useSelector(workflowIdentifierSelector);

  const taskList = useSelector(currentTaskListSelector);
  const { listName, taskListIdentifier } = taskList || {};

  const { orgUserRole } = useSelector(userProfileSelector);
  const restrictions = SINGLE_WORKFLOW_RESTRICTIONS_PROFILES[orgUserRole];
  const momentDueDate = selectedWorkflow?.dueDateTime
    ? moment(selectedWorkflow?.dueDateTime)
    : null;

  const memberslist = selectedWorkflow?.members;
  const currentUser = useSelector(userProfileSelector);

  const hasEditorPermissions =
    memberslist?.find(({ user }) => user.identifier === currentUser.identifier)
      ?.memberPermission === 'EDITOR';

  useEffect(() => {
    if (momentDueDate) {
      setIsOverdue(momentDueDate.isBefore(moment()));
    }
  }, [selectedWorkflow, momentDueDate]);

  useEffect(() => {
    const unlisten = history.listen(
      compose(dispatch, WorkflowDrawerActions.closeDrawer),
    );

    return () => {
      unlisten();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { linkedSourceTaskBundle } = selectedWorkflow || {};

  useEffect(() => {
    let handler = setInterval(() => {
      if (
        scrollToByQuerySelector(
          `#${getCommentIdToScroll(commentIdentifierToScroll)}`,
        )
      ) {
        clearInterval(handler);
        handler = null;
        dispatch(
          WorkflowDrawerActions.setWorkflowCommentIdentifierToScroll(null),
        );
      }
    }, 20);

    return () => {
      if (handler) clearInterval(handler);
    };
  }, [dispatch, commentIdentifierToScroll]);

  const handleBackdropClick = () => {
    dispatch(WorkflowDrawerActions.closeDrawer());
  };

  const handleAddComment = (tokenizedComment) => {
    dispatch(
      WorkflowActions.addWorkflowComment(workflowIdentifier, tokenizedComment),
    );
  };

  return ReactDOM.createPortal(
    <div>
      {open && (
        <AnimatedContainer>
          <WorkflowDrawerContainer key={selectedWorkflow?.identifier}>
            <WorkflowDrawerHeader />
            <SectionContainer>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: 'bold' }} component="span">
                    List:{' '}
                    <FiledInListName
                      onClick={() => {
                        history.push(createTaskListPath(taskListIdentifier));
                      }}
                    >
                      {listName}
                    </FiledInListName>
                    {linkedSourceTaskBundle !== undefined && (
                      <DeployTextContainer>
                        Deployed From :{' '}
                        <FiledInListName>
                          {linkedSourceTaskBundle.name}
                        </FiledInListName>
                      </DeployTextContainer>
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <NameSection
                    readOnly={
                      restrictions?.name === DISABLED ||
                      (isTemplateTask && !hasEditorPermissions)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <DescriptionSection
                    readOnly={
                      restrictions?.description === DISABLED ||
                      (isTemplateTask && !hasEditorPermissions)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <AssignedToSection
                    disabled={
                      restrictions?.assignedTo === DISABLED ||
                      (isTemplateTask && !hasEditorPermissions)
                    }
                  />
                </Grid>
                <Grid item xs={12} mb={1}>
                  <PatientSection
                    disabled={
                      !!isTemplateTask ||
                      restrictions?.patient === DISABLED ||
                      (isTemplateTask && !hasEditorPermissions)
                    }
                  />
                </Grid>
                <Grid container spacing={6}>
                  <Grid item xs={6}>
                    <StartDateSection
                      disabled={
                        !!isTemplateTask ||
                        restrictions?.startDate === DISABLED ||
                        (isTemplateTask && !hasEditorPermissions)
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <AnchorDateSection
                      disabled={
                        !!isTemplateTask ||
                        restrictions?.anchorDate === DISABLED ||
                        (isTemplateTask && !hasEditorPermissions)
                      }
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <DueDateSection
                    disabled={
                      !!isTemplateTask ||
                      restrictions?.dueDate === DISABLED ||
                      (isTemplateTask && !hasEditorPermissions)
                    }
                  />
                </Grid>
                {!isOverdue && (
                  <Grid ml={18.5} xs={12}>
                    <ReminderSection
                      disabled={
                        !!isTemplateTask ||
                        restrictions?.reminder === DISABLED ||
                        (isTemplateTask && !hasEditorPermissions)
                      }
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <PrioritySection
                    disabled={
                      restrictions?.priority === DISABLED ||
                      (isTemplateTask && !hasEditorPermissions)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <StatusSection
                    disabled={
                      restrictions?.status === DISABLED ||
                      (isTemplateTask && !hasEditorPermissions)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <LabelsSection
                    disabled={
                      restrictions?.labels === DISABLED ||
                      (isTemplateTask && !hasEditorPermissions)
                    }
                  />
                </Grid>
              </Grid>
            </SectionContainer>
            <SectionSpacer />
            <SectionContainer>
              <AttachmentSection
                disabled={
                  restrictions?.attachments === DISABLED ||
                  (isTemplateTask && !hasEditorPermissions)
                }
              />
            </SectionContainer>
            <SectionSpacer />
            <SectionContainer>
              <TasksSection
                disabled={
                  restrictions?.tasks === DISABLED ||
                  (isTemplateTask && !hasEditorPermissions)
                }
              />
            </SectionContainer>
            <SectionSpacer />
            <SectionContainer withBackground>
              <CommentSection />
            </SectionContainer>
            <SectionSpacer />
            <CustomFieldsSection
              disabled={
                restrictions?.customFields === DISABLED ||
                (isTemplateTask && !hasEditorPermissions)
              }
            />
            <SectionSpacer />
            <SectionContainer>
              <HistorySection
                disabled={
                  restrictions?.history === DISABLED ||
                  (isTemplateTask && !hasEditorPermissions)
                }
              />
            </SectionContainer>
            <StickyAddComment onAdd={handleAddComment} />
          </WorkflowDrawerContainer>
        </AnimatedContainer>
      )}
      {open && <Backdrop onClick={handleBackdropClick} />}
    </div>,
    document.body,
  );
};

export default WorkflowDrawer;
