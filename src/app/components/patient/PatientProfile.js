import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router';
import styled from 'styled-components';

import { saveTask, storeAsCurrentTask } from '../../actions/task-actions';
import { groupTasksAndCompletedTasksByList } from '../../helpers/groupTasksByList';
import useBoolean from '../../hooks/useBoolean';
import usePatient from '../../hooks/usePatient';
import BackIcon from '../../img/back.svg';
import PatientEdit from '../patients/PatientEdit';
import { PatientsSidebarSection } from '../patients/PatientsSidebar';
import PatientsTasklistEditable from '../patients/PatientsTasklistEditable';
import NewTaskDrawer from '../taskView/NewTaskDrawer';

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
    {patient && (
      <Heading>{`${patient.firstName} ${patient.lastName} ${patient.mrn}`}</Heading>
    )}
  </PatientProfileHeaderContainer>
);

const PatientDetails = styled.div`
  padding: 9px 10px 10px 10px;
  flex: 1;
`;

const PatientBottomContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
`;

const PatientListsContainer = styled.div`
  flex: 2;
`;

const PatientDrawerContainer = styled.div`
  flex: 1.4;
`;

const renderPatientSection = ({
  selectedTask,
  patientId,
  dispatch,
  closeTaskDrawer,
  ...otherProps
}) => ({ listName, taskListId, tasks, completedTasks }) => {
  const selectCurrentTask = task => {
    if (!task) {
      closeTaskDrawer();
    }
    storeAsCurrentTask(task)(dispatch);
  };

  return (
    <PatientsSidebarSection heading={listName} key={listName}>
      <PatientsTasklistEditable
        tasks={tasks}
        completedTasks={completedTasks}
        submitTask={description =>
          saveTask({ description, taskListId, patientId })(dispatch)
        }
        isAddTaskEnabled={true}
        selectCurrentTask={selectCurrentTask}
        {...otherProps}
      />
    </PatientsSidebarSection>
  );
};

const PatientProfileLayout = ({ patientId }) => {
  const dispatch = useDispatch();
  const [taskDrawerOpen, openTaskDrawer, closeTaskDrawer] = useBoolean(false);
  const { details, tasks, completedTasks, selectedTask } = usePatient(
    patientId,
  );
  const lists = groupTasksAndCompletedTasksByList(tasks, completedTasks);

  const selectedTaskId = taskDrawerOpen ? selectedTask?.taskId : undefined;

  const selectedTaskList = lists?.find(
    ({ taskListId }) => taskListId === selectedTask?.taskListId,
  );

  return (
    <>
      <PatientProfileHeader patient={details} />
      <div style={{ display: 'flex' }}>
        {details && (
          <PatientDetails>
            <PatientEdit patient={details} />
            <PatientBottomContainer>
              <PatientListsContainer>
                {lists.map(
                  renderPatientSection({
                    selectedTask,
                    selectedTaskId,
                    patientId,
                    dispatch,
                    closeTaskDrawer,
                    openTaskDrawer,
                    taskDrawerOpen,
                  }),
                )}
              </PatientListsContainer>
              {taskDrawerOpen && (
                <PatientDrawerContainer>
                  <NewTaskDrawer
                    closeDrawer={closeTaskDrawer}
                    taskList={selectedTaskList}
                  />
                </PatientDrawerContainer>
              )}
            </PatientBottomContainer>
          </PatientDetails>
        )}
      </div>
    </>
  );
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
