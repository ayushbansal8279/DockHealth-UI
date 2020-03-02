import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import { useMount } from 'react-use';
import styled from 'styled-components';
import { fetchPatient } from '../../actions/patient';
import {
  addTaskComment,
  markAsUnread,
  markComplete,
  storeAsCurrentTask,
  toggleTaskPriority,
  getListTasksByPatientAndStatus,
} from '../../actions/task-actions';
import { groupTasksAndCompletedTasksByList } from '../../helpers/group-tasks-by-list';
import usePatient from '../../hooks/use-patient';
import BackIcon from '../../img/back.svg';
import TaskView from '../../views/TaskView';
import SafariFixGrid from '../common/SafariFixGrid';
import PatientEdit from '../patients/PatientEdit';
import CubesLoader from '../common/CubesLoader';

const PatientProfileHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #fff;
  height: 88px;
  padding: 14px 40px 0 22px;
`;

const BackButton = styled(IconButton)`
  && {
    height: 36px;
    width: 36px;
    padding: 0;
  }
`;

const Heading = styled.div`
  margin-left: 18px;
  font-size: 30px;
  font-weight: 600;
  line-height: 41px;
`;

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
      <PatientProfileHeaderContainer>
        <Back />
        <Heading>{patientName}</Heading>
      </PatientProfileHeaderContainer>
    )
  );
};

const PatientProfileLayout = ({ patientIdentifier }) => {
  const dispatch = useDispatch();

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

  const handleCompletedTasksRequest = (
    selectedTaskListIdentifier,
  ) => {
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
    isSpecificPatient: true,
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

const PatientProfile = ({ routeParams }) => (
  <div className="off-canvas-content" data-off-canvas-content>
    <div className="row expanded collapse" style={{ minHeight: '100%' }}>
      <div className="columns" style={{ background: '#f5f8fa' }}>
        <PatientProfileLayout
          patientIdentifier={routeParams.patientIdentifier}
        />
      </div>
    </div>
  </div>
);

export default PatientProfile;
