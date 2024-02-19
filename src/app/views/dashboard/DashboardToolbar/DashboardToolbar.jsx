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
import { Grid } from '@mui/material';
import DashboardTab from 'views/dashboard/DashboardTab/DashboardTab';
import Spacing from 'components/common/Spacing';
import {
  HOME_ALL_TASKS_PATH,
  HOME_PATH,
  HOME_SHARED_PATH,
  HOME_UPCOMING_TASKS_PATH,
  HOME_OVERDUE_TASKS_PATH,
  HOME_COMPLETED_TASKS_PATH,
} from 'routing/helpers/paths';
import { DashboardTasksTab } from 'helpers/dashboard-helpers';
import { ViewType, getViewTypeFromQueryString } from 'helpers/view-type-helper';
import {
  dashboardGroupsPreferencesSelector,
  selectedUserOrganizationSelector,
  userProfileSelector,
  userHasShareTaskFeatureSelector,
  userHasMultiOrgViewFeatureSelector,
} from 'selectors/user-selectors';
import * as DashboardApi from 'api/dashboard-api';
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

const { ADMIN, OWNER, MEMBER, GUEST, DOCK_LITE } = UserOrganizationRole;

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

  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const { orgUserRole } = useSelector(userProfileSelector);
  const userHasMultiOrgViewAvailable = useSelector(
    userHasMultiOrgViewFeatureSelector,
  );
  const allTasksForMemberEnabledItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'constraint.allTasksForMember.enabled',
    ) || {};
  const restrictAllTasksForMember =
    (orgUserRole === 'MEMBER' &&
      allTasksForMemberEnabledItem?.value === 'false') ||
    false;
  const shareTaskAvailable = useSelector(userHasShareTaskFeatureSelector);

  const [sharedTasksCount, setSharedTasksCount] = useState(0);
  const [sharedTasksAnyUnread, setSharedTasksAnyUnread] = useState(false);

  useEffect(() => {
    DashboardApi.getTasksAssignedToUserByImplicitGroup('SHARED', 0, 0).then(
      (data) => {
        const taskCount = data?.taskGroups?.[0]?.tasks?.length;
        setSharedTasksCount(taskCount);
        const anyTasksUnread =
          data?.taskGroups?.[0]?.tasks?.filter((t) => t.read === false)
            ?.length !== 0;
        setSharedTasksAnyUnread(anyTasksUnread);
      },
    );
  }, [setSharedTasksCount, setSharedTasksAnyUnread]);
  //       const anyTasksUnread =
  //         data?.taskGroups?.[0]?.tasks?.filter((t) => t.read === false)
  //           ?.length !== 0;
  //       setSharedTasksAnyUnread(anyTasksUnread);
  //     },
  //   );
  // }, [setSharedTasksCount, setSharedTasksAnyUnread]);

  useEffect(() => {
    if (
      !dashboardGroupsPreferences &&
      groupList &&
      groupList.length > 0 &&
      !sentInitialSetup.current
    ) {
      const initialPreferences = groupList
        .filter((g) => g.defaultOpen)
        .flatMap((g) => g.groupType);
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

  // const updateGroupsPreferences = useCallback(
  //   (groupType) => {
  //     const newSetup = groupsPreferences?.includes(groupType)
  //       ? groupsPreferences.filter((option) => option !== groupType)
  //       : [...groupsPreferences, groupType];

  //     setGroupsPreferences(newSetup);
  //     dispatch(updateCurrentUserPreferences({ displayGroups: newSetup }));
  //   },
  //   [dispatch, groupsPreferences],
  // );
  // const additionalOptions = useMemo(() => {
  //   return groupList?.map((group) => ({
  //     name: group.groupName,
  //     onClick: () => updateGroupsPreferences(group.groupType),
  //     key: group.key,
  //     checked: groupsPreferences
  //       ? groupsPreferences?.includes(group.groupType)
  //       : group.defaultOpen,
  //   }));
  // }, [groupList, groupsPreferences, updateGroupsPreferences]);

  useEffect(() => {
    let columnsConfig = DASHBOARD_BASE_COLUMNS_CONFIG;
    if (userHasMultiOrgViewAvailable) {
      columnsConfig = {
        ...DASHBOARD_BASE_COLUMNS_CONFIG,
        [TaskItemColumn.ORG_NAME]: true,
      };
    }
    setViewSpecificConfig(columnsConfig);
  }, [setViewSpecificConfig, userHasMultiOrgViewAvailable]);

  // const handleChangeViewType = useCallback(
  //   (event) => {
  //     const queryParameters = new URLSearchParams(search);
  //     const value = event?.target.value ?? ViewType.LIST_VIEW;
  //     if (value === ViewType.LIST_VIEW) {
  //       queryParameters.delete('viewType');
  //     } else {
  //       queryParameters.set('viewType', value.toLowerCase());
  //     }
  //     history.push({ search: queryParameters.toString() });
  //   },
  //   [search, history],
  //[] );

  return (
    <ToolbarContainer container direction="row" justifyContent="space-between">
      <Grid item md={8} sm={12}>
        <DashboardTabsContainer>
          <AccessRestrictor
            allowedToRoles={[ADMIN, OWNER, MEMBER, GUEST, DOCK_LITE]}
          >
            <DashboardTab
              label="My Tasks"
              setHighlightPosition={setHighlightPosition}
              onClick={() => {
                history.push(`${HOME_PATH}${search}`);
              }}
              isSelected={tabName === DashboardTasksTab.MY_TASKS}
            />
          </AccessRestrictor>
          {shareTaskAvailable && (
            <DashboardTab
              label={`Shared With Me (${sharedTasksCount})`}
              setHighlightPosition={setHighlightPosition}
              onClick={() => {
                history.push(`${HOME_SHARED_PATH}${search}`);
              }}
              isSelected={tabName === DashboardTasksTab.SHARED_TASKS}
              showNewIndicator={sharedTasksAnyUnread}
            />
          )}
          {!restrictAllTasksForMember && (
            <AccessRestrictor allowedToRoles={[ADMIN, OWNER, MEMBER]}>
              <DashboardTab
                label="All Tasks"
                setHighlightPosition={setHighlightPosition}
                onClick={() => {
                  history.push(`${HOME_ALL_TASKS_PATH}${search}`);
                }}
                isSelected={tabName === DashboardTasksTab.ALL_TASKS}
              />
            </AccessRestrictor>
          )}
          <AccessRestrictor
            allowedToRoles={[ADMIN, OWNER, MEMBER, GUEST, DOCK_LITE]}
          >
            <DashboardTab
              label="Upcoming"
              setHighlightPosition={setHighlightPosition}
              onClick={() => {
                history.push(`${HOME_UPCOMING_TASKS_PATH}${search}`);
              }}
              isSelected={tabName === DashboardTasksTab.UPCOMING}
            />
          </AccessRestrictor>
          <AccessRestrictor
            allowedToRoles={[ADMIN, OWNER, MEMBER, GUEST, DOCK_LITE]}
          >
            <DashboardTab
              label="Overdue"
              setHighlightPosition={setHighlightPosition}
              onClick={() => {
                history.push(`${HOME_OVERDUE_TASKS_PATH}${search}`);
              }}
              isSelected={tabName === DashboardTasksTab.OVERDUE}
            />
          </AccessRestrictor>
          <AccessRestrictor
            allowedToRoles={[ADMIN, OWNER, MEMBER, GUEST, DOCK_LITE]}
          >
            <DashboardTab
              label="Completed"
              setHighlightPosition={setHighlightPosition}
              onClick={() => {
                history.push(`${HOME_COMPLETED_TASKS_PATH}${search}`);
              }}
              isSelected={tabName === DashboardTasksTab.COMPLETED}
            />
          </AccessRestrictor>
          <DashboardTabHighlight {...highlightPosition} />
        </DashboardTabsContainer>
      </Grid>
      {/* <ActionsContainer item md={8}>
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
            <AccessRestrictor
            allowedToRoles={[ADMIN, OWNER, MEMBER, GUEST, DOCK_LITE]}
            >
              <CustomizeToolbarButton
              showCustomColumnCreate={false}
                additionalOptionsTitle="Groups"
                additionalOptions={additionalOptions}
                iconColorFilterActive={iconColorFilterActive}
                isDashboard
                />
            </AccessRestrictor>
          </>
        )}
      </ActionsContainer> */}
    </ToolbarContainer>
  );
};

export default DashboardToolbar;
