import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  dashboardTabNameSelector,
  dashboardTasksSelector,
} from 'selectors/dashboard-selectors';
import { useHistory, useLocation } from 'react-router-dom';
import { updateCurrentUserPreferences } from 'actions/user-actions';
import { Grid } from '@material-ui/core';
import DashboardTab from 'views/dashboard/DashboardTab/DashboardTab';
import Spacing from 'components/common/Spacing';
import {
  HOME_ALL_TASKS_PATH,
  HOME_PATH,
  // HOME_SHARED_PATH,
} from 'routing/helpers/paths';
import { DashboardTasksTab } from 'helpers/dashboard-helpers';
import { ViewType, getViewTypeFromQueryString } from 'helpers/view-type-helper';
import { dashboardGroupsPreferencesSelector } from 'selectors/user-selectors';
import TaskViewTypeToolbarSelect from 'components/tasklist/TaskViewTypeToolbarSelect/TaskViewTypeToolbarSelect';
import CustomizeToolbarButton from 'components/tasklist/CustomizeToolbarButton/CustomizeToolbarButton';
import { useTaskListColumnsConfig } from 'context-api/columns-config-context';
import {
  TaskItemColumn,
  TASK_ITEM_BASE_COLUMN_CONFIG,
} from 'helpers/task-helpers';
import { UserOrganizationRole } from 'helpers/user-helper';
import AccessRestrictor from 'components/access/AccessRestrictor/AccessRestrictor';
import {
  ToolbarContainer,
  ActionsContainer,
  DashboardTabsContainer,
  DashboardTabHighlight,
  TaskViewSelectWrapper,
} from './styled';

const DASHBOARD_BASE_COLUMNS_CONFIG = {
  ...TASK_ITEM_BASE_COLUMN_CONFIG,
  [TaskItemColumn.LIST_NAME]: true,
};

const { ADMIN, OWNER, MEMBER, GUEST, EXTERNAL } = UserOrganizationRole;

const DashboardToolbar = ({ iconColorFilterActive, iconColorActive }) => {
  const history = useHistory();
  const { search } = useLocation();
  const viewType = getViewTypeFromQueryString(search);
  const dispatch = useDispatch();
  const [highlightPosition, setHighlightPosition] = useState({
    width: 0,
    left: 0,
  });
  const tabName = useSelector(dashboardTabNameSelector);
  const { setViewSpecificConfig } = useTaskListColumnsConfig();
  const dashboardGroupsPreferences = useSelector(
    dashboardGroupsPreferencesSelector,
  );
  const groupList = useSelector(dashboardTasksSelector);
  const [groupsPreferences, setGroupsPreferences] = useState(
    dashboardGroupsPreferences || [],
  );
  const sentInitialSetup = useRef(false);

  useEffect(() => {
    if (
      !dashboardGroupsPreferences &&
      groupList &&
      groupList.length > 0 &&
      !sentInitialSetup.current
    ) {
      const initialPreferences = groupList
        .filter(g => g.defaultOpen)
        .flatMap(g => g.groupType);
      if (initialPreferences) {
        sentInitialSetup.current = true;
        setGroupsPreferences(initialPreferences);
        dispatch(
          updateCurrentUserPreferences({
            displayGroups: initialPreferences,
          }),
        );
      }
    }
  }, [groupList, dashboardGroupsPreferences, dispatch]);

  const updateGroupsPreferences = useCallback(
    groupType => {
      const newSetup = groupsPreferences?.includes(groupType)
        ? groupsPreferences.filter(option => option !== groupType)
        : [...groupsPreferences, groupType];

      setGroupsPreferences(newSetup);
      dispatch(updateCurrentUserPreferences({ displayGroups: newSetup }));
    },
    [dispatch, groupsPreferences],
  );
  const additionalOptions = useMemo(() => {
    return groupList?.map(group => ({
      name: group.groupName,
      onClick: () => updateGroupsPreferences(group.groupType),
      key: group.key,
      checked: groupsPreferences
        ? groupsPreferences?.includes(group.groupType)
        : group.defaultOpen,
    }));
  }, [groupList, groupsPreferences, updateGroupsPreferences]);

  useEffect(() => {
    setViewSpecificConfig(DASHBOARD_BASE_COLUMNS_CONFIG);
  }, [setViewSpecificConfig]);

  const handleChangeViewType = useCallback(
    event => {
      const queryParameters = new URLSearchParams(search);
      const value = event?.target.value ?? ViewType.LIST_VIEW;
      if (value === ViewType.LIST_VIEW) {
        queryParameters.delete('viewType');
      } else {
        queryParameters.set('viewType', value.toLowerCase());
      }
      history.push({ search: queryParameters.toString() });
    },
    [search, history],
  );

  return (
    <ToolbarContainer container direction="row" justify="space-between">
      <Grid item md={4}>
        <DashboardTabsContainer>
          <AccessRestrictor allowedToRoles={[ADMIN, OWNER, MEMBER, GUEST]}>
            <DashboardTab
              label="My Tasks"
              setHighlightPosition={setHighlightPosition}
              onClick={() => {
                history.push(`${HOME_PATH}${search}`);
              }}
              isSelected={tabName === DashboardTasksTab.MY_TASKS}
            />
          </AccessRestrictor>
          {/* <AccessRestrictor allowedToRoles={[EXTERNAL]}>
            <DashboardTab
              label="Shared with me"
              setHighlightPosition={setHighlightPosition}
              onClick={() => {
                history.push(`${HOME_SHARED_PATH}`);
              }}
              isSelected={tabName === DashboardTasksTab.SHARED_TASKS}
            />
          </AccessRestrictor> */}
          <AccessRestrictor allowedToRoles={[ADMIN, OWNER]}>
            <DashboardTab
              label="All Tasks"
              setHighlightPosition={setHighlightPosition}
              onClick={() => {
                history.push(`${HOME_ALL_TASKS_PATH}${search}`);
              }}
              isSelected={tabName === DashboardTasksTab.ALL_TASKS}
            />
          </AccessRestrictor>

          <DashboardTabHighlight {...highlightPosition} />
        </DashboardTabsContainer>
      </Grid>
      <ActionsContainer item md={8}>
        {tabName !== DashboardTasksTab.SHARED_TASKS && (
          <TaskViewSelectWrapper>
            <TaskViewTypeToolbarSelect
              value={viewType}
              onChange={handleChangeViewType}
              iconColorFilterActive={iconColorFilterActive}
              iconColorActive={iconColorActive}
            />
          </TaskViewSelectWrapper>
        )}
        {viewType !== ViewType.CALENDAR_VIEW && (
          <>
            <Spacing horizontal={4} />
            <AccessRestrictor allowedToRoles={[ADMIN, OWNER, MEMBER, GUEST]}>
              <CustomizeToolbarButton
                showCustomColumnCreate={false}
                additionalOptionsTitle="Groups"
                additionalOptions={additionalOptions}
                iconColorFilterActive={iconColorFilterActive}
              />
            </AccessRestrictor>
          </>
        )}
      </ActionsContainer>
    </ToolbarContainer>
  );
};

export default DashboardToolbar;
