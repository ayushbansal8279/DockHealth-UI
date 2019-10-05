import React from 'react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import BackIcon from '../../img/back.svg';
import PatientEdit from '../patients/PatientEdit';
import { PatientsSidebarSection } from '../patients/PatientsSidebar';
import { usePatient } from '../../hooks/patient';
import { groupTasksAndCompletedTasksByList } from '../../helpers/groupTasksByList';
import {
  addTaskComment,
  markComplete,
  saveTask,
  storeAsCurrentTask, toggleTaskPriority
} from '../../actions/task-actions';
import PatientsTasklistEditable from '../patients/PatientsTasklistEditable';
import TaskDetails from '../home/TaskDetails';

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

const PatientProfileHeader = ({ patient }) => (
  <PatientProfileHeaderContainer>
    <Back />
    {patient && <Heading>{`${patient.firstName} ${patient.lastName} ${patient.mrn}`}</Heading>}
  </PatientProfileHeaderContainer>
);

const PatientDetails = styled.div`
  padding: 9px 10px 10px 10px;
  flex: 1;
`;

const PatientProfileLayout = ({ patientId }) => {
  const dispatch = useDispatch();
  const { details, tasks, completedTasks, selectedTask, isLoading, error } = usePatient(patientId);
  const lists = groupTasksAndCompletedTasksByList(tasks, completedTasks);
  const userId = useSelector(store => store.userState.userProfile.userId);

  return (<>
    <PatientProfileHeader patient={details} />
    <div style={{ display: 'flex' }}>
    {details && (
      <PatientDetails>
        <PatientEdit patient={details} />
        {
          lists.map(list => (
            <PatientsSidebarSection heading={list.listName} key={list.listName}>
              <PatientsTasklistEditable
                tasks={list.tasks}
                completedTasks={list.completedTasks}
                submitTask={description => dispatch(saveTask({ description, taskListId: list.taskListId, patientId }))}
                selectedTaskId={selectedTask?.taskId}
              />
            </PatientsSidebarSection>
          ))
        }
      </PatientDetails>
    )}
    {selectedTask && (
      <TaskDetails
        addTaskComment={(comment) => { dispatch(addTaskComment(selectedTask, { comment })); }}
        userId={userId}
        selectedTask={selectedTask}
        close={() => { dispatch(storeAsCurrentTask(null)); }}
        markComplete={(task, status, listName) => { dispatch(markComplete(task, status, listName)); }}
        toggleTaskPriority={(task, priority) => { dispatch(toggleTaskPriority(task, userId, priority)); } }
        stickyStyle={{ paddingTop: '9px', top: 0 }}
      />
    )}
    </div>
  </>);
};

const PatientProfile = ({ routeParams }) => (
  <div className="off-canvas-content" data-off-canvas-content>
    <div className="row expanded collapse" style={{ minHeight: '100%' }}>
      <div className="columns" style={{ background: '#f5f8fa' }}>
        <PatientProfileLayout patientId={routeParams.patientId} />
      </div>
    </div>
  </div>
);

export default PatientProfile;
