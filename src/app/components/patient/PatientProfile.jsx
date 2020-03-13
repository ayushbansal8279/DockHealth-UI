import { ThemeProvider, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/styles';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import { useMount } from 'react-use';
import styled from 'styled-components';
import { setHeader } from '../../actions/header-actions';
import { fetchPatient } from '../../actions/patient';
import {
  addTaskComment,
  getListTasksByPatientAndStatus,
  markAsUnread,
  markComplete,
  storeAsCurrentTask,
  toggleTaskPriority,
} from '../../actions/task-actions';
import { groupTasksAndCompletedTasksByList } from '../../helpers/group-tasks-by-list';
import usePatient from '../../hooks/use-patient';
import BackIcon from '../../img/back.svg';
import themeMontserrat from '../../theme-montserrat';
import TaskView from '../../views/TaskView';
import CubesLoader from '../common/CubesLoader';
import GenericHeader from '../common/GenericHeader';
import SafariFixGrid from '../common/SafariFixGrid';
import PatientEdit from '../patients/PatientEdit';

const PatientProfileHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 88px;
  padding: 1rem;
`;

const BackButton = styled(IconButton)`
  && {
    height: 2.25rem;
    margin-right: 0.5rem;
    width: 2.25rem;
    padding: 0;
  }
`;

const HeadingTypography = withStyles({
  root: {
    fontWeight: 'normal',
  },
})(Typography);

const Back = () => (
  <Link to="patients">
    <BackButton>
      <img src={BackIcon} alt="Go back to patients list" />
    </BackButton>
  </Link>
);

const PatientProfileHeader = ({ patient }) => {
  const patientName = `${patient.firstName ?? ''} ${patient.lastName ??
    ''} ${patient.mrn ?? ''}`.trim();

  return (
    patientName && (
      <ThemeProvider theme={themeMontserrat}>
        <PatientProfileHeaderContainer>
          <Back />
          <HeadingTypography variant="h2">{patientName}</HeadingTypography>
        </PatientProfileHeaderContainer>
      </ThemeProvider>
    )
  );
};

const PatientProfile = ({ routeParams }) => {
  const dispatch = useDispatch();

  useMount(() => {
    setHeader(dispatch)({
      layout: [
        {
          key: 'patient-header',
          component: (
            <GenericHeader>
              <Typography variant="h4">Patient</Typography>
            </GenericHeader>
          ),
        },
      ],
    });
  });

  const patientIdentifier = routeParams?.patientIdentifier;

  useMount(() => {
    fetchPatient(patientIdentifier)(dispatch);
  });

  const { details, tasks, completedTasks, isLoading } = usePatient();
  const lists = groupTasksAndCompletedTasksByList(tasks, completedTasks);

  const selectedTask = useSelector(store => store.taskState.selectedTask);

  const selectedTaskId = selectedTask
    ? selectedTask?.taskIdentifier
    : undefined;

  const userIdentifier = useSelector(
    store => store.userState.userProfile?.userIdentifier,
  );

  const isCompletedTasksFetching = useSelector(
    store => store.taskState.isCompletedTasksFetching,
  );

  const showingCompletedTasks = useSelector(
    store => store.taskState.showingCompletedTasks,
  );

  const searchedTasks = {
    tasks,
    completedTasks,
  };

  const handleCompletedTasksRequest = selectedTaskListIdentifier => {
    dispatch(
      getListTasksByPatientAndStatus(
        patientIdentifier,
        selectedTaskListIdentifier,
        'COMPLETE',
        true,
      ),
    );
  };

  const taskViewProps = {
    userIdentifier,
    listTasks: [...(tasks ?? []), ...(completedTasks ?? [])],
    tasks: searchedTasks.tasks,
    completedTasks: searchedTasks.completedTasks,
    isFetching: isLoading,
    isCompletedTasksFetching,
    showingCompletedTasks,
    markComplete: (task, status, listName, currentUser) =>
      dispatch(markComplete(task, status, listName, currentUser)),
    selectedTaskId,
    storeAsCurrentTask: task => dispatch(storeAsCurrentTask(task)),
    markAsUnread,
    addTaskComment,
    toggleTaskPriority: (task, priority) =>
      toggleTaskPriority(task, userIdentifier, priority),
    showToolbar: false,
    showAddTaskButton: false,
    isMultiList: true,
    headsUpAreaVisible: false,
    isSpecificPatient: true,
    paneled: true,
    onCompletedTasksRequest: handleCompletedTasksRequest,
  };

  return (
    <>
      <PatientProfileHeader patient={details} />
      {isLoading ? (
        <Grid container justify="center">
          <CubesLoader size={64} />
        </Grid>
      ) : (
        <>
          {details && (
            <Grid
              container
              justify="center"
              alignItems="center"
              direction="column"
            >
              <SafariFixGrid
                container
                item
                direction="column"
                style={{ marginBottom: '1rem', maxWidth: '1050px' }}
                xs={9}
              >
                <PatientEdit patient={details} />
              </SafariFixGrid>

              {!isLoading && (!lists || lists.length === 0) ? (
                <Grid container justify="center">
                  <b />
                </Grid>
              ) : (
                <TaskView {...taskViewProps} />
              )}
            </Grid>
          )}
        </>
      )}
    </>
  );
};

export default PatientProfile;
