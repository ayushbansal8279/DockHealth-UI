/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useEffect, useState } from 'react';
import { Grid, IconButton, useMediaQuery } from '@mui/material';
import TaskDescription from 'components/task-drawer/TaskDescription/TaskDescription';
import { useSelector, useDispatch } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import PrioritySection from '../PrioritySection/PrioritySection';
import StatusSection from '../StatusSection/StatusSection';
import TaskDrawerEmailBodyContainer from '../EmailBody/EmailBody';
import PatientSection from '../PatientSection/PatientSection';
import AssignedToSection from '../AssignedToSection/AssignedToSection';
import DueDateSection from '../DueDateSection/DueDateSection';
import TaskDetails from '../TaskDetails/TaskDetails';
import * as TaskActions from 'actions/task-actions';

import {
  TaskDrawerContainer,
  TaskDrawerBackground,
  styleTaskDrawerContainer,
  styleFullRow,
  styleEmailRow,
  styleLeftColumn,
  styleRightColumn,
  TaskDrawerDivider,
  CreateTaskLable,
  NewTaskDrawerDivider,
  AddTaskDrawerWrapper,
  ButtonWrapper,
} from './styled';
import { Close } from '@mui/icons-material';
import Tooltip from '../../common/Tooltip/Tooltip';
import { getSharedTaskListsWithCurrentUser } from '@/app/api/task-list-api';
import {
  CancelButton,
  ConfirmButton,
} from '@/app/modal/components/ModalButton/ModalButtons';
import ListSelectorSection from '../ListSelectorSection/ListSelectorSection';

const AddTaskDrawerContent = (props) => {
  const { setAddTaskDrawer } = props;

  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [slectedListIdentifier, setSelectedListIdentifier] = useState('');
  const [assignedToIdentifiers, setAssignedToIdentifiers] = useState([]);
  const [addTaskAssignees, setAddTaskAssignees] = useState([]);
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [workflowStatusIdentifier, setWorkflowStatusIdentifier] = useState('');
  const [patientIdentifier, setPatientIdentifier] = useState('');
  const [searchedKeyword, setSearchedKeyword] = useState();
  const [searchedLists, setSearchedLists] = useState([]);
  const [lists, setLists] = useState([]);
  const currentUser = useSelector(userProfileSelector);
  const { userIdentifier } = currentUser;
  const dispatch = useDispatch();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchList = async () => {
      const lists = await getSharedTaskListsWithCurrentUser(userIdentifier);
      setSearchedLists(lists);
      setLists(lists);
    };

    fetchList();
  }, []);

  useEffect(() => {
    const assignedToIdentifiers = addTaskAssignees.map(
      (item) => item.identifier,
    );
    setAssignedToIdentifiers(assignedToIdentifiers);
  }, [addTaskAssignees]);

  const clearFormStates = () => {
    setDescription('');
    setDetails('');
    setSelectedListIdentifier('');
    setPriority('');
  };

  const closeTaskDrawer = useCallback(() => {
    setAddTaskDrawer(false);
    handleCloseTaskDrawer();
    clearFormStates();
  }, [clearFormStates, handleCloseTaskDrawer]);

  const handleListSearch = (event) => {
    setSearchedKeyword(event.target.value.toLowerCase());
    const searchedList = lists.filter((item) =>
      item.listName?.toLowerCase().includes(event.target.value.toLowerCase()),
    );
    setSearchedLists(searchedList);
  };

  const handleListChange = (listIdentifier) => {
    setSelectedListIdentifier(listIdentifier);
  };

  const handleSave = () => {
    const data = {
      taskListIdentifier: slectedListIdentifier,
      description,
      details,
      assignedToIdentifier: userIdentifier,
      assignedToIdentifiers,
      patientIdentifier,
      dueDate,
      priority,
      workflowStatusIdentifier,
    };

    const filteredData = Object.entries(data)
      .filter(([_, value]) => value !== null && value !== '')
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    dispatch(TaskActions.saveTask(filteredData));
    closeTaskDrawer();
  };

  const TopSection = () => {
    return (
      <Grid
        item
        xs={12}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '72px',
        }}
      >
        <CreateTaskLable>Create new task</CreateTaskLable>
        <Tooltip placement="bottom-end" title={'Cancle Create Task'}>
          <IconButton
            onClick={() => {
              closeTaskDrawer();
            }}
            size="small"
            color="secondary"
            style={{ paddingRight: '20px' }}
          >
            <Close />
          </IconButton>
        </Tooltip>
      </Grid>
    );
  };

  return (
    <TaskDrawerContainer>
      <AddTaskDrawerWrapper>
        <Grid container style={styleTaskDrawerContainer}>
          {TopSection()}
          <NewTaskDrawerDivider />
          <ListSelectorSection
            handleListChange={handleListChange}
            slectedListIdentifier={slectedListIdentifier}
            lists={lists}
            searchedKeyword={searchedKeyword}
            handleListSearch={handleListSearch}
            searchedLists={searchedLists}
          />
          <Grid item xs={12} style={styleFullRow(isMobile)}>
            <TaskDescription
              addTaskDrawer
              taskDescription={description}
              setTaskDescription={setDescription}
            />
          </Grid>
          {selectedTask?.sourceMessage && (
            <Grid item xs={12} style={styleEmailRow(isMobile)}>
              <TaskDrawerEmailBodyContainer />
            </Grid>
          )}
          <Grid item xs={12} mb={3} style={styleFullRow(isMobile)}>
            <TaskDetails
              addTaskDrawer
              taskDetail={details}
              setTaskDetail={setDetails}
            />
          </Grid>
          <Grid item xs={12} ml={3} mb={1} style={styleRightColumn(isMobile)}>
            <AssignedToSection
              addTaskDrawer
              setAddTaskAssignees={setAddTaskAssignees}
              slectedListIdentifier={slectedListIdentifier}
              disabled={slectedListIdentifier === ''}
            />
          </Grid>
          <Grid item xs={12} mb={1} style={styleLeftColumn(isMobile)}>
            <PatientSection
              addTaskDrawer
              setPatientIdentifier={setPatientIdentifier}
            />
          </Grid>
          <Grid item xs={12} style={styleLeftColumn(isMobile)}>
            <div>
              <DueDateSection addTaskDrawer setDueDate={setDueDate} />
            </div>
          </Grid>
          <Grid item xs={12} style={styleLeftColumn(isMobile)}>
            <PrioritySection addTaskDrawer setPriority={setPriority} />
          </Grid>
          <Grid item xs={12} ml={3} style={styleRightColumn(isMobile)}>
            <div>
              <StatusSection
                addTaskDrawer
                setWorkflowStatusIdentifier={setWorkflowStatusIdentifier}
              />
            </div>
          </Grid>
          <TaskDrawerDivider />
        </Grid>
        <ButtonWrapper>
          <CancelButton onClick={closeTaskDrawer} style={{ width: '150px' }}>
            Cancel
          </CancelButton>
          <ConfirmButton onClick={handleSave}>Save task</ConfirmButton>
        </ButtonWrapper>
      </AddTaskDrawerWrapper>
      {taskDrawerOpen && <TaskDrawerBackground onClick={closeTaskDrawer} />}
    </TaskDrawerContainer>
  );
};

export default AddTaskDrawerContent;
