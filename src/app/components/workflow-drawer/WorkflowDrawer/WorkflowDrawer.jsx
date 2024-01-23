import React, { useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { useHistory } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
import * as WorkflowDrawerActions from 'actions/workflow-drawer-actions';
import compose from 'ramda/src/compose';
import { useDispatch, useSelector } from 'react-redux';
import {
  isWorkflowDrawerOpenSelector,
  workflowSelector,
} from 'selectors/workflow-drawer-selectors';
import WorkflowDrawerHeader from 'components/workflow-drawer/DrawerHeader/DrawerHeader';
import { checkIfTemplateWorkflow } from 'helpers/workflow-helpers';
import {
  userProfileSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import {
  SINGLE_WORKFLOW_RESTRICTIONS_PROFILES,
  WORKFLOW_LIST_RESTRICTIONS_OPTIONS,
} from 'restrictions/task-restrictions';
import { FiledInListName } from 'components/task-drawer/TaskDrawerContent/styled';
import { createTaskListPath } from 'routing/helpers/paths';
import { currentTaskListSelector } from 'selectors/task-list-selectors';
import CustomFieldsSection from 'components/task-drawer/CustomFieldsSection/CustomFieldsSection';
import NameSection from '../NameSection/NameSection';
import DescriptionSection from '../DescriptionSection/DescriptionSection';
import PatientSection from '../PatientSection/PatientSection';
import AssignedToSection from '../AssignedToSection/AssignedToSection';
import HistorySection from '../HistorySection/HistorySection';
import DueDateSection from '../DueDateSection/DueDateSection';
import StartDateSection from '../StartDateSection/StartDateSection';
import AnchorDateSection from '../AnchorDateSection/AnchorDateSection';
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
} from './styled';

const { DISABLED } = WORKFLOW_LIST_RESTRICTIONS_OPTIONS;

const WorkflowDrawer = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const open = useSelector(isWorkflowDrawerOpenSelector);
  const selectedWorkflow = useSelector(workflowSelector);
  const isTemplateTask = useMemo(
    () => checkIfTemplateWorkflow(selectedWorkflow),
    [selectedWorkflow],
  );

  const taskList = useSelector(currentTaskListSelector);
  const { listName, taskListIdentifier } = taskList || {};

  const { orgUserRole } = useSelector(userProfileSelector);
  const restrictions = SINGLE_WORKFLOW_RESTRICTIONS_PROFILES[orgUserRole];

  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const quickAddPatientEnabledItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'patient.quickadd.enabled',
    ) || {};
  // const quickAddPatientEnabled = quickAddPatientEnabledItem?.value !== 'false';

  useEffect(() => {
    const unlisten = history.listen(
      compose(dispatch, WorkflowDrawerActions.closeDrawer),
    );

    return () => {
      unlisten();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBackdropClick = () => {
    dispatch(WorkflowDrawerActions.closeDrawer());
  };

  return ReactDOM.createPortal(
    <div>
      {open && (
        <AnimatedContainer>
          <WorkflowDrawerContainer key={selectedWorkflow?.identifier}>
            <WorkflowDrawerHeader />
            <SectionContainer>
              <Grid container spacing={4}>
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
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <NameSection readOnly={restrictions?.name === DISABLED} />
                </Grid>
                <Grid item xs={12}>
                  <DescriptionSection
                    readOnly={restrictions?.description === DISABLED}
                  />
                </Grid>
                <Grid item xs={6}>
                  <PatientSection
                    disabled={
                      !!isTemplateTask || restrictions?.patient === DISABLED
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <AssignedToSection
                    disabled={restrictions?.assignedTo === DISABLED}
                  />
                </Grid>
                <Grid item xs={6}>
                  <StartDateSection
                    disabled={
                      !!isTemplateTask || restrictions?.startDate === DISABLED
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <AnchorDateSection
                    disabled={
                      !!isTemplateTask || restrictions?.anchorDate === DISABLED
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <DueDateSection
                    disabled={
                      !!isTemplateTask || restrictions?.dueDate === DISABLED
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <ReminderSection
                    disabled={
                      !!isTemplateTask || restrictions?.reminder === DISABLED
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <PrioritySection
                    disabled={restrictions?.priority === DISABLED}
                  />
                </Grid>
                <Grid item xs={6}>
                  <StatusSection disabled={restrictions?.status === DISABLED} />
                </Grid>
                <Grid item xs={12}>
                  <LabelsSection disabled={restrictions?.labels === DISABLED} />
                </Grid>
              </Grid>
            </SectionContainer>
            <SectionSpacer />
            <SectionContainer>
              <AttachmentSection
                disabled={restrictions?.attachments === DISABLED}
              />
            </SectionContainer>
            <SectionSpacer />
            <SectionContainer>
              <TasksSection disabled={restrictions?.tasks === DISABLED} />
            </SectionContainer>
            <SectionSpacer />
            <SectionContainer withBackground>
              <CommentSection disabled={restrictions?.comments === DISABLED} />
            </SectionContainer>
            <SectionSpacer />
            <SectionContainer>
              <CustomFieldsSection
                disabled={restrictions?.customFields === DISABLED}
              />
            </SectionContainer>
            <SectionSpacer />
            <SectionContainer>
              <HistorySection disabled={restrictions?.history === DISABLED} />
            </SectionContainer>
          </WorkflowDrawerContainer>
        </AnimatedContainer>
      )}
      {open && <Backdrop onClick={handleBackdropClick} />}
    </div>,
    document.body,
  );
};

export default WorkflowDrawer;
