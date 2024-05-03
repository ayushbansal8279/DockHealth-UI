import React, { useCallback, useState, useMemo, useContext } from 'react';
import uniq from 'ramda/src/uniq';
import { Box } from '@mui/material';
import FullViewIcon from 'img/list/FullViewIcon';
import SlimViewIcon from 'img/list/SlimViewIcon';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import TaskStatusToolbarSelect from '@/app/components/tasklist/list-toolbar-buttons/TaskStatusToolbarSelect/TaskStatusToolbarSelect';
import InboxTips from '@/app/components/tasklist/list-toolbar-buttons/InboxTips/InboxTips';
import { ViewType, getViewTypeFromQueryString } from 'helpers/view-type-helper';
import { useLocation, useHistory } from 'react-router-dom';
import { TaskStatus } from 'helpers/task-helpers';
import { updateUserListViewSetup } from 'actions/task-list-actions';
import CustomizeToolbarButton from '@/app/components/tasklist/list-toolbar-buttons/CustomizeToolbarButton/CustomizeToolbarButton';
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
  GridItemCalendarView,
  GridItemFullView,
  GridItemSlimView,
  ToolbarContainer,
} from './styled';
import { ListPageContext } from '../ListDetailsView';
const TASKS_VISIBILITY_KEY = 'SHOW_WORKFLOW_COMPLETED_TASKS';

const ListDetailsToolbar = ({
  additionalOptions,
  children,
  searchValue,
  focused,
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

  const { changeViewType, handleSetChangeViewType, handleRemoveAllTasks } =
    useContext(ListPageContext);
  const [calendarView, setCalendarView] = useState(
    viewType === ViewType.CALENDAR_VIEW,
  );
  const [slimView, setSlimView] = useState(
    viewType === ViewType.LIST_VIEW && changeViewType === 'SLIM_VIEW',
  );
  const [fullView, setFullView] = useState(
    viewType === ViewType.LIST_VIEW && changeViewType === 'FULL_VIEW',
  );
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
        {viewType === ViewType.CALENDAR_VIEW && (
          <TaskStatusToolbarSelect
            value={tasksStatus}
            onChange={handleChangeTasksStatus}
            iconColorFilterActive={iconColorFilterActiveItem?.value}
            iconColorActive={iconColorActiveItem?.value}
            searchValue={searchValue}
            focused={focused}
          />
        )}

        {viewType === ViewType.LIST_VIEW && (
          <>
            <CustomizeToolbarButton
              openCustomFieldModal={() => setCustomFieldsModalOpened(true)}
              additionalOptions={additionalOptions}
              disableButton={restrictCustomizationFeatures}
              iconColorFilterActive={iconColorFilterActiveItem?.value}
              searchValue={searchValue}
              focused={focused}
            />
            <Box mx={0.5} />
            <TaskStatusToolbarSelect
              value={tasksStatus}
              onChange={handleChangeTasksStatus}
              iconColorFilterActive={iconColorFilterActiveItem?.value}
              iconColorActive={iconColorActiveItem?.value}
              searchValue={searchValue}
              focused={focused}
              taskListIdentifier={taskListIdentifier}
            />
            {/* <Box sx={boxComponentStyles} /> */}
            <TaskCustomFieldsModal
              opened={customFieldsModalOpened}
              handleClose={() => setCustomFieldsModalOpened(false)}
              taskListIdentifier={taskList?.taskListIdentifier}
              isOrganizationAdmin={isOrganizationAdmin}
              isListAdmin={isListAdmin}
            />
            {children}
          </>
        )}
      </Box>

      <Box mx={0.5} />
      <GridContainer>
        <GridItemCalendarView
          active={calendarView}
          onClick={() => {
            handleChangeViewType(ViewType.CALENDAR_VIEW);
            handleSetChangeViewType('');
            handleRemoveAllTasks();
          }}
        >
          <CalendarMonthOutlinedIcon
            sx={{
              height: '28px',
              width: '24px',
            }}
          />
        </GridItemCalendarView>
        <GridItemFullView
          active={fullView}
          onClick={() => {
            handleChangeViewType(ViewType.LIST_VIEW);
            handleSetChangeViewType('FULL_VIEW');
            handleRemoveAllTasks();
            setSlimView(false);
            setFullView(true);
          }}
        >
          <FullViewIcon />
        </GridItemFullView>
        <GridItemSlimView
          active={slimView}
          onClick={() => {
            handleChangeViewType(ViewType.LIST_VIEW);
            handleSetChangeViewType('SLIM_VIEW');
            handleRemoveAllTasks();
            setFullView(false);
            setSlimView(true);
          }}
        >
          <SlimViewIcon />
        </GridItemSlimView>
      </GridContainer>
    </ToolbarContainer>
  );
};

export default ListDetailsToolbar;
