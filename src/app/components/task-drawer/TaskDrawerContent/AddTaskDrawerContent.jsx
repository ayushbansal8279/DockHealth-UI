/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useEffect, useState } from 'react';
import { Grid, IconButton, useMediaQuery } from '@mui/material';
import TaskDescription from 'components/task-drawer/TaskDescription/TaskDescription';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectedUserOrganizationSelector,
  userProfileSelector,
} from 'selectors/user-selectors';
import PrioritySection from '../PrioritySection/PrioritySection';
import StatusSection from '../StatusSection/StatusSection';
import TaskDrawerEmailBodyContainer from '../EmailBody/EmailBody';
import PatientSection from '../PatientSection/PatientSection';
import initializeTaskDrawerHooks from './hooks';
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
import palette from '@/app/styles/palette';
import { getGroupsForTaskList } from '@/app/api/task-group-list-api';
import GroupSelectorSection from '../ListSelectorSection/GroupSelectorSection';
import { getDashboardTasks } from '@/app/actions/dashboard-actions';
import { showGlobalErrorAlert } from '@/app/alert/actions';
import StartDateSection from '../StartDateSection/StartDateSection';

const AddTaskDrawerContent = (props) => {
  const {
    isInbox,
    onTaskUpdate = () => {},
    onTaskCreation = () => {},
    onTaskDelete = () => {},
    fromFirstAddTask = false,
    hideTour = false,
    setAddTaskDrawer,
  } = props;

  const {
    closeTaskDrawer: handleCloseTaskDrawer,
    selectedTask,
    taskDrawerOpen,
  } = initializeTaskDrawerHooks({
    isInbox,
    onTaskUpdate,
    onTaskCreation,
    onTaskDelete,
    fromFirstAddTask,
    hideTour,
  });

  const [isClicked, setClicked] = useState(false);
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [slectedListIdentifier, setSelectedListIdentifier] = useState('');
  const [groups, setGroups] = useState([]);
  const [taskGroupIdentifier, setTaskGroupIdentifier] = useState('');
  const [assignedToIdentifiers, setAssignedToIdentifiers] = useState([]);
  const [addTaskAssignees, setAddTaskAssignees] = useState([]);
  const [priority, setPriority] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startDateIntent, setStartDateIntent] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueDateIntent, setDueDateIntent] = useState('');
  const [workflowStatusIdentifier, setWorkflowStatusIdentifier] = useState('');
  const [patient, setPatient] = useState(null);
  const [searchedKeyword, setSearchedKeyword] = useState();
  const [searchedLists, setSearchedLists] = useState([]);
  const [lists, setLists] = useState([]);
  const currentUser = useSelector(userProfileSelector);
  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const { userIdentifier } = currentUser;
  const dispatch = useDispatch();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const quickAddPatientEnabledItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'patient.quickadd.enabled',
    ) || {};
  const quickAddPatientEnabled = quickAddPatientEnabledItem?.value !== 'false';

  const [addTaskDrawerRecurringSchedule, setAddTaskDrawerRecurringSchedule] =
    useState(null);

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

  useEffect(() => {
    if (slectedListIdentifier) {
      getGroupsForTaskList(slectedListIdentifier).then((responseGroups) => {
        setGroups(responseGroups);
      });
    }
  }, [slectedListIdentifier]);

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

  const handleGroupChange = (groupIdentifier) => {
    setTaskGroupIdentifier(groupIdentifier);
  };

  const handleSave = async () => {
    setClicked(true);
    if (description && slectedListIdentifier) {
      const data = {
        taskListIdentifier: slectedListIdentifier,
        taskGroupIdentifier,
        description,
        details,
        assignedToIdentifiers: [
          ...new Set([...(assignedToIdentifiers || []), userIdentifier]),
        ],
        patientIdentifier: patient?.patientIdentifier,
        startDate,
        startDateIntent,
        dueDate,
        dueDateIntent,
        priority,
        workflowStatusIdentifier,
      };

      const filteredData = Object.entries(data)
        .filter(([_, value]) => value !== null && value !== '')
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
      try {
        dispatch(
          TaskActions.saveTask(
            filteredData,
            false,
            addTaskDrawerRecurringSchedule,
          ),
        );

        closeTaskDrawer();
        dispatch(getDashboardTasks());
      } catch (error) {
        dispatch(showGlobalErrorAlert());
        dispatch(getDashboardTasks());
      }
    }
  };

  const TopSection = () => {
    return (
      <Grid
        item
        size={12}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '72px',
        }}
      >
        <CreateTaskLable>Create new task</CreateTaskLable>
        <Tooltip placement="bottom-end" title={'Cancel Create Task'}>
          <IconButton
            onClick={() => {
              closeTaskDrawer();
            }}
            size="small"
            color="secondary"
            style={{ marginRight: '20px' }}
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
            isClicked={isClicked}
            handleListChange={handleListChange}
            slectedListIdentifier={slectedListIdentifier}
            lists={lists}
            searchedKeyword={searchedKeyword}
            handleListSearch={handleListSearch}
            searchedLists={searchedLists}
          />
          <GroupSelectorSection
            handleGroupChange={handleGroupChange}
            taskGroupIdentifier={taskGroupIdentifier}
            groups={groups}
            slectedListIdentifier={slectedListIdentifier}
          />
          <Grid item size={12} style={styleFullRow(isMobile)}>
            <TaskDescription
              addTaskDrawer
              isClicked={isClicked}
              taskDescription={description}
              setTaskDescription={setDescription}
            />
          </Grid>
          {selectedTask?.sourceMessage && (
            <Grid item size={12} style={styleEmailRow(isMobile)}>
              <TaskDrawerEmailBodyContainer />
            </Grid>
          )}
          <Grid item size={12} mb={3} style={styleFullRow(isMobile)}>
            <TaskDetails
              addTaskDrawer
              taskDetail={details}
              setTaskDetail={setDetails}
            />
          </Grid>
          <Grid item size={12} ml={3} mb={1} style={styleRightColumn(isMobile)}>
            <AssignedToSection
              addTaskDrawer
              setAddTaskAssignees={setAddTaskAssignees}
              slectedListIdentifier={slectedListIdentifier}
              disabled={slectedListIdentifier === ''}
            />
          </Grid>
          <Grid item size={12} mb={1} style={styleLeftColumn(isMobile)}>
            <PatientSection
              addTaskDrawer
              setPatient={setPatient}
              selectedPatient={patient}
              quickAddPatientEnabled={quickAddPatientEnabled}
            />
          </Grid>
          <Grid item size={12} mb={1} style={styleLeftColumn(isMobile)}>
            <div>
              <StartDateSection
                addTaskDrawer
                setStartDate={setStartDate}
                defaultStartDateIntent={startDateIntent}
                setStartDateIntent={setStartDateIntent}
              />
            </div>
          </Grid>
          <Grid item size={12} style={styleLeftColumn(isMobile)}>
            <div>
              <DueDateSection
                addTaskDrawer
                setDueDate={setDueDate}
                defaultDueDateIntent={dueDateIntent}
                setDueDateIntent={setDueDateIntent}
                addTaskDrawerRecurringSchedule={addTaskDrawerRecurringSchedule}
                setAddTaskDrawerRecurringSchedule={
                  setAddTaskDrawerRecurringSchedule
                }
              />
            </div>
          </Grid>
          <Grid item size={12} style={styleLeftColumn(isMobile)}>
            <PrioritySection
              addTaskDrawer
              priority={priority}
              setPriority={setPriority}
            />
          </Grid>
          <Grid item size={12} ml={3} style={styleRightColumn(isMobile)}>
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
          <ConfirmButton
            style={{
              width: '150px',
              backgroundColor:
                (!description || !slectedListIdentifier) && palette.shadowBlue,
            }}
            onClick={handleSave}
          >
            Save task
          </ConfirmButton>
        </ButtonWrapper>
      </AddTaskDrawerWrapper>
      {taskDrawerOpen && <TaskDrawerBackground onClick={closeTaskDrawer} />}
    </TaskDrawerContainer>
  );
};

export default AddTaskDrawerContent;
