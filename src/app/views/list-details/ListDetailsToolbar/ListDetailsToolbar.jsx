import React, { useCallback, useState, useMemo, useParams } from 'react';
import uniq from 'ramda/src/uniq';
import TaskViewTypeToolbarSelect from 'components/tasklist/TaskViewTypeToolbarSelect/TaskViewTypeToolbarSelect';
import { Box } from '@mui/material';
import FullViewIcon from 'img/list/FullViewIcon';
import SlimViewIcon from 'img/list/SlimViewIcon';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
// import { Grid } from '@mui/material';
// import listSectionSavedState from 'helpers/list-section-saved-state';
import TaskStatusToolbarSelect from 'components/tasklist/TaskStatusToolbarSelect/TaskStatusToolbarSelect';
// import CompleteTasksVisibilitySwitch from 'components/tasklist/CompleteTasksVisibilitySwitch/CompleteTasksVisibilitySwitch';
import InboxTips from 'components/tasklist/InboxTips/InboxTips';
import ViewTypeSwitch, {
  ViewType as listDetailsViewType,
} from 'components/tasklist/ViewTypeSwitch/ViewTypeSwitch';
// import {
//   onSlimViewChanged,
//   onTaskGroupCollapsed,
//   onTaskGroupExpanded,
// } from 'helpers/ga-event-helper';
import { ViewType, getViewTypeFromQueryString } from 'helpers/view-type-helper';
import { useLocation, useHistory } from 'react-router-dom';
import { TaskStatus } from 'helpers/task-helpers';
import { updateUserListViewSetup } from 'actions/task-list-actions';
import CustomizeToolbarButton from 'components/tasklist/CustomizeToolbarButton/CustomizeToolbarButton';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import {
  userProfileSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import { useDispatch, useSelector } from 'react-redux';
import {
  currentTaskListSelector,
  currentTaskListTasksStatusSelector,
} from 'selectors/task-list-selectors';
import { isMemberAdmin } from 'helpers/list-members-helper';
import TaskCustomFieldsModal from 'modal/customModals/TaskCustomFieldsModal';
import {
  GridContainer,
  GridItem1,
  GridItem2,
  GridItem3,
  ToolbarContainer,
} from './styled';

const TASKS_VISIBILITY_KEY = 'SHOW_WORKFLOW_COMPLETED_TASKS';

const ListDetailsToolbar = ({
  additionalOptions,
  children,
  searchValue,
  focused,
  boxComponentStyles,
}) => {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const history = useHistory();
  const [customFieldsModalOpened, setCustomFieldsModalOpened] = useState(false);
  const currentUser = useSelector(userProfileSelector);
  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const tasksStatus = useSelector(currentTaskListTasksStatusSelector);
  const isOrganizationAdmin = checkIfUserIsOrganizationAdmin(currentUser);
  const taskList = useSelector(currentTaskListSelector);
  const { taskListIdentifier, restrictCustomization } = taskList || {};
  const currentUserMember = taskList?.listUsers.find(
    (u) => u.identifier === currentUser?.identifier,
  );
  const isListAdmin = isMemberAdmin(currentUserMember);
  const viewType = getViewTypeFromQueryString(search);
  const restrictCustomizationFeatures = restrictCustomization && !isListAdmin;
  const iconColorFilterActiveItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'icon.active.filter',
    ) || {};
  const iconColorActiveItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'icon.active.color',
    ) || {};
  const [calendarView, setCalendarView] = useState(
    viewType === ViewType.CALENDAR_VIEW,
  );
  const [slimView, setSlimView] = useState(false);
  const [fullView, setFullView] = useState(false);
  const handleChangeViewType = useCallback(
    (event) => {
      const queryParameters = new URLSearchParams(search);
      const value = event ?? ViewType.LIST_VIEW;
      // ?.target.value ?? ViewType.LIST_VIEW;
      if (value === ViewType.LIST_VIEW) {
        queryParameters.delete('viewType');
      } else {
        queryParameters.set('viewType', value.toLowerCase());
      }
      history.push({ search: queryParameters.toString() });
    },
    [search, history],
  );

  const { displayOptions = [] } = useMemo(
    () =>
      taskList?.listType === 'PUBLIC'
        ? taskList
        : taskList?.listUsers?.find(
            (user) => user.identifier === currentUser.identifier,
          ) ||
          taskList ||
          {},
    [taskList, currentUser],
  );

  const handleChangeTasksStatus = useCallback(
    (event) => {
      history.push(
        `/core/tasks/${taskListIdentifier}${
          event.target.value === TaskStatus.INCOMPLETE
            ? ''
            : `/${TaskStatus.COMPLETE}`
        }${search}`,
      );
    },
    [history, taskListIdentifier, search],
  );

  // const groupSessionStorageKey = `${listUniqueKey}-default`;

  // const { viewType, isOpen, switchOpen, setViewType } = listSectionSavedState({
  //   sessionStorageKey: groupSessionStorageKey,
  // });

  // const onTaskGroupViewModeChange = (viewMode) => {
  //   loadTasksForTaskGroup({
  //     listUniqueKey,
  //     startPosition: 0,
  //     viewMode,
  //     refresh: true,
  //   });
  // };

  // const changeViewType = (value) => {
  //   setViewType(value);
  //   if (value === listDetailsViewType.SLIM_VIEW) {
  //     onTaskGroupViewModeChange(listDetailsViewType.SLIM_VIEW);
  //     onSlimViewChanged(true);
  //   } else {
  //     onTaskGroupViewModeChange(listDetailsViewType.FULL_VIEW);
  //     onSlimViewChanged(false);
  //   }
  // };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleTasksVisibilityChange = (visible) => {
    const newDisplayOptions = visible
      ? uniq([...displayOptions, TASKS_VISIBILITY_KEY])
      : displayOptions.filter((k) => k !== TASKS_VISIBILITY_KEY);

    dispatch(
      updateUserListViewSetup(
        taskList.taskListIdentifier,
        newDisplayOptions,
        currentUser.identifier,
      ),
    );
  };

  return (
    <ToolbarContainer>
      <Box display="flex" flex={1} justifyContent="flex-start">
        <TaskStatusToolbarSelect
          value={tasksStatus}
          onChange={handleChangeTasksStatus}
          iconColorFilterActive={iconColorFilterActiveItem?.value}
          iconColorActive={iconColorActiveItem?.value}
          searchValue={searchValue}
          focused={focused}
        />
        {/* <Box mx={0.5} />
        <TaskViewTypeToolbarSelect
          value={viewType}
          onChange={handleChangeViewType}
          iconColorFilterActive={iconColorFilterActiveItem?.value}
          iconColorActive={iconColorActiveItem?.value}
        /> */}
        {viewType === ViewType.LIST_VIEW && (
          <>
            <Box sx={boxComponentStyles} />
            <CustomizeToolbarButton
              openCustomFieldModal={() => setCustomFieldsModalOpened(true)}
              additionalOptions={additionalOptions}
              disableButton={restrictCustomizationFeatures}
              iconColorFilterActive={iconColorFilterActiveItem?.value}
              searchValue={searchValue}
              focused={focused}
            />
            {/* <Box sx={boxComponentStyles} /> */}
            <TaskCustomFieldsModal
              opened={customFieldsModalOpened}
              handleClose={() => setCustomFieldsModalOpened(false)}
              taskListIdentifier={taskList?.taskListIdentifier}
              isOrganizationAdmin={isOrganizationAdmin}
              isListAdmin={isListAdmin}
            />
            {taskList?.listType === 'INBOX' && <InboxTips />}
            {/* <Box sx={boxComponentStyles} /> */}
            {children}
          </>
        )}
      </Box>

      <Box sx={boxComponentStyles} />
      <GridContainer>
        <GridItem1 active={calendarView}>
          <Box
            sx={{ marginTop: '4px' }}
            onClick={() => {
              handleChangeViewType(ViewType.CALENDAR_VIEW);
              setCalendarView(true);
              setSlimView(false);
              setFullView(false);
            }}
          >
            <CalendarMonthOutlinedIcon
              // fontSize="medium"
              sx={{
                height: '28px',
                width: '28px',
              }}
            />
          </Box>
        </GridItem1>
        <GridItem2 active={slimView}>
          <Box
            sx={{ marginTop: '8px' }}
            onClick={() => {
              handleChangeViewType(ViewType.LIST_VIEW);
              setSlimView(true);
              setFullView(false);
              setCalendarView(false);
            }}
          >
            <FullViewIcon />
          </Box>
        </GridItem2>
        <GridItem3 active={fullView}>
          <Box
            onClick={() => {
              handleChangeViewType(ViewType.LIST_VIEW);
              setFullView(true);
              setSlimView(false);
              setCalendarView(false);
            }}
            sx={{ marginTop: '8px' }}
          >
            <SlimViewIcon />
          </Box>
        </GridItem3>
      </GridContainer>
      {/* <ViewTypeSwitch /> */}
      {/* {viewType === ViewType.LIST_VIEW && <>{children}</>} */}
      {/* {viewType === ViewType.LIST_VIEW && ( */}
      {/* // <Box display="flex" flex={1} justifyContent="flex-end"> */}
      {/* {tasksStatus === TaskStatus.INCOMPLETE && (
            <CompleteTasksVisibilitySwitch
              visible={displayOptions.includes(TASKS_VISIBILITY_KEY)}
              onChange={handleTasksVisibilityChange}
              iconColorFilterActive={iconColorFilterActiveItem?.value}
            />
          )} */}
      {/* {children} */}
      {/* <Box mx={0.5} /> */}
      {/* </Box> */}
      {/* )} */}
      {/* {children} */}
    </ToolbarContainer>
  );
};

export default ListDetailsToolbar;
