import React, { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import * as WorkflowDrawerActions from 'actions/workflow-drawer-actions';
import { AnimatePresence } from 'framer-motion/dist/framer-motion';
import { compose } from 'ramda';
import { useDispatch, useSelector } from 'react-redux';
import {
  isWorkflowDrawerOpenSelector,
  workflowSelector,
} from 'selectors/workflow-drawer-selectors';
import WorkflowDrawerHeader from 'components/workflow-drawer/DrawerHeader/DrawerHeader';
import { checkIfTemplateWorkflow } from 'helpers/workflow-helpers';
import NameSection from '../NameSection/NameSection';
import DescriptionSection from '../DescriptionSection/DescriptionSection';
import PatientSection from '../PatientSection/PatientSection';
import AssignedToSection from '../AssignedToSection/AssignedToSection';
import HistorySection from '../HistorySection/HistorySection';
import DueDateSection from '../DueDateSection/DueDateSection';
import StartDateSection from '../StartDateSection/StartDateSection';
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

const WorkflowDrawer = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const open = useSelector(isWorkflowDrawerOpenSelector);
  const selectedWorkflow = useSelector(workflowSelector);

  const isTemplateTask = useMemo(
    () => checkIfTemplateWorkflow(selectedWorkflow),
    [selectedWorkflow],
  );

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

  return (
    <>
      <AnimatePresence initial={false}>
        {open && (
          <AnimatedContainer
            initial={{ translateX: '100%' }}
            animate={{ translateX: 0 }}
            exit={{ translateX: '100%' }}
            transition={{ duration: 0.3, bounce: 0 }}
          >
            <WorkflowDrawerContainer key={selectedWorkflow?.identifier}>
              <WorkflowDrawerHeader />
              <SectionContainer>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <NameSection />
                  </Grid>
                  <Grid item xs={12}>
                    <DescriptionSection />
                  </Grid>
                  <Grid item xs={6}>
                    <PatientSection disabled={!!isTemplateTask} />
                  </Grid>
                  <Grid item xs={6}>
                    <AssignedToSection />
                  </Grid>
                  <Grid item xs={6}>
                    <StartDateSection disabled={!!isTemplateTask} />
                  </Grid>
                  <Grid item xs={6} />
                  <Grid item xs={6}>
                    <DueDateSection disabled={!!isTemplateTask} />
                  </Grid>
                  <Grid item xs={6}>
                    <ReminderSection disabled={!!isTemplateTask} />
                  </Grid>
                  <Grid item xs={6}>
                    <PrioritySection />
                  </Grid>
                  <Grid item xs={6}>
                    <StatusSection />
                  </Grid>
                  <Grid item xs={12}>
                    <LabelsSection />
                  </Grid>
                </Grid>
              </SectionContainer>
              <SectionContainer>
                <AttachmentSection />
              </SectionContainer>
              <SectionSpacer />
              <SectionContainer>
                <TasksSection />
              </SectionContainer>
              <SectionContainer withBackground>
                <CommentSection />
              </SectionContainer>
              <SectionSpacer />
              <SectionContainer>
                <HistorySection />
              </SectionContainer>
            </WorkflowDrawerContainer>
          </AnimatedContainer>
        )}
      </AnimatePresence>
      {open && <Backdrop onClick={handleBackdropClick} />}
    </>
  );
};

export default WorkflowDrawer;
