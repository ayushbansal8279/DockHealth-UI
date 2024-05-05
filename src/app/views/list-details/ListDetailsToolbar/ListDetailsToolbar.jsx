import React, { useCallback, useState, useContext } from 'react';
import { Box } from '@mui/material';
import FullViewIcon from 'img/list/FullViewIcon';
import SlimViewIcon from 'img/list/SlimViewIcon';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { ViewType } from 'helpers/view-type-helper';
import { useLocation, useHistory } from 'react-router-dom';
import { updateTaskStatusToFilter } from 'actions/task-list-actions';
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
import queryString from 'query-string';
import {
  GridContainer,
  GridItemCalendarView,
  GridItemFullView,
  GridItemSlimView,
  ToolbarContainer,
} from './styled';
import { ListPageContext } from '../ListDetailsView';
import { getCurrentListTasks } from '@/app/actions/list-details-actions';
import CustomizeToolbarButton from '@/app/components/tasklist/list-toolbar-buttons/CustomizeToolbarButton/CustomizeToolbarButton';
import TaskStatusToolbarSelect from '@/app/components/tasklist/list-toolbar-buttons/TaskStatusToolbarSelect';

const ListDetailsToolbar = ({
  additionalOptions,
  children,
  searchValue,
  focused,
}) => {
  const dispatch = useDispatch();
  const { viewType = ViewType.LIST_VIEW } = useLocation();
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
    (newViewType) => {
      const queryParams = {};
      if (newViewType !== ViewType.LIST_VIEW)
        queryParams.viewType = newViewType;
      const query = queryString.stringify(queryParams);
      history.push(`/core/tasks/${taskListIdentifier}?${query}`);
    },
    [history, taskListIdentifier],
  );

  const handleChangeTasksStatus = useCallback(
    (status) => {
      dispatch(updateTaskStatusToFilter(status));
      dispatch(getCurrentListTasks());
    },
    [dispatch],
  );

  return (
    <ToolbarContainer>
      <Box display="flex" flex={1} justifyContent="flex-start">
        {viewType === ViewType.CALENDAR_VIEW && (
          <TaskStatusToolbarSelect
            value={tasksStatus}
            onChange={handleChangeTasksStatus}
            iconColorFilterActive={iconColorFilterActiveItem?.value}
            iconColorActive={iconColorActiveItem?.value}
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
            />
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
