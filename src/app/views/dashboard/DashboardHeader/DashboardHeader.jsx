import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { Box } from '@mui/material';
import {
  dashboardTasksSelector,
  dashboardTabNameSelector,
  dashboardFilterOptionsSelector,
  isFetchingDashboardFiltersSelector,
  dashboardTaskViewFilterSelector,
} from 'selectors/dashboard-selectors';
import {
  getDashboardFilters,
  getDashboardTasks,
  getDashboardGroups,
  initializeDashboardState,
  searchDashboardTasks,
  selectDashboardFilters,
  updateDashboardTaskViewFilter,
} from 'actions/dashboard-actions';

import {
  userProfileSelector,
  dashboardGroupsPreferencesSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import debounce from 'lodash.debounce';
import { onSearchChanged } from 'helpers/ga-event-helper';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import LayoutHeader from 'components/template/LayoutHeader/LayoutHeader';
import HeaderSearch from 'components/template/HeaderSearch/HeaderSearch';
import AccessRestrictor from 'components/access/AccessRestrictor/AccessRestrictor';
import compose from 'ramda/src/compose';
import equals from 'ramda/src/equals';
import {
  showAddQuickFilterOption,
  createQuickFilter,
  updateQuickFilter,
  deleteQuickFilter,
  getQuickFilters,
  selectQuickFilter,
} from 'actions/mega-filter-actions';
import {
  addQuickFilterOptionSelector,
  quickFiltersSelector,
  selectedQuickFilterSelector,
  selectedFiltersInMegaFilterSelector,
} from 'selectors/mega-filter-selectors';
import { DashboardTasksTab } from 'helpers/dashboard-helpers';
import { UserOrganizationRole } from 'helpers/user-helper';
import { getViewTypeFromQueryString, ViewType } from 'helpers/view-type-helper';
import SlimViewIcon from 'img/list/SlimViewIcon';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import Spacing from 'components/common/Spacing';
import { updateCurrentUserPreferences } from 'actions/user-actions';
import { Add } from '@mui/icons-material';
import CustomizeToolbarButton from '@/app/components/tasklist/list-toolbar-buttons/CustomizeToolbarButton/CustomizeToolbarButton';
import MegaFilter from '@/app/components/tasklist/list-toolbar-buttons/MegaFilter/MegaFilter';
import {
  GridContainer,
  GridItemCalendarView,
  GridItemSlimView,
  DashboardHeaderContainer,
  AddTaskButtonWrapper,
  AddTaskButtonLabel,
} from './styled';
import { ActionsContainer } from '../DashboardToolbar/styled';
import HomeTaskViewFilter from '@/app/components/tasklist/list-toolbar-buttons/HomeTaskViewFilter';
import * as localStorageHelper from '@/app/helpers/local-storage-helper';
import { openAddTaskTaskDrawer } from '@/app/actions/task-drawer-actions';
import { TaskOrigin } from '@/app/helpers/task-helpers';
import sessionStorageHelper from '@/app/helpers/session-storage-helper';

const DashboardHeader = ({
  clearSearch,
  setClearSearch,
  clearFilter,
  setClearFilter,
  setAddTaskDrawer,
}) => {
  const { search } = useLocation();
  const history = useHistory();
  const groupList = useSelector(dashboardTasksSelector);
  const viewType = getViewTypeFromQueryString(search);
  const [searchValue, setSearchValue] = useState('');
  const dispatch = useDispatch();
  const isFetchingFilters = useSelector(isFetchingDashboardFiltersSelector);
  const dashboardTasks = useSelector(dashboardTasksSelector);
  const currentUser = useSelector(userProfileSelector);
  const tabName = useSelector(dashboardTabNameSelector);
  const filterOptions = useSelector(dashboardFilterOptionsSelector);
  const taskViewFilter = useSelector(dashboardTaskViewFilterSelector);
  const selectedFilters = useSelector(selectedFiltersInMegaFilterSelector);
  const quickFiltersList = useSelector(quickFiltersSelector);
  const addQuickFilterOption = useSelector(addQuickFilterOptionSelector);
  const selectedQuickFilter = useSelector(selectedQuickFilterSelector);
  const savedDashboardSelectedQuickFilters = sessionStorageHelper.getItem(
    'dashboardSelectedQuickFilters',
  );
  const [multipleSelectedQuickFilters, setMultipleSelectedQuickFilters] =
    useState([]);
  const filteredDashboardTasks = dashboardTasks?.filter(
    (taskGroupInfo) => taskGroupInfo?.metricValue !== 0,
  );
  const currentCommonTabName = Object.entries(DashboardTasksTab || {})?.filter(
    ([, value]) => value === tabName,
  )?.[0];

  const [calendarView, setCalendarView] = useState(
    viewType === ViewType.CALENDAR_VIEW,
  );
  const dashboardGroupsPreferences = useSelector(
    dashboardGroupsPreferencesSelector,
  );
  const [groupsPreferences, setGroupsPreferences] = useState(
    dashboardGroupsPreferences || [],
  );
  const [slimView, setSlimView] = useState(viewType === ViewType.LIST_VIEW);

  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const iconColorFilterActiveItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'icon.active.filter',
    ) || {};

  const { ADMIN, OWNER, MEMBER, GUEST, DOCK_LITE } = UserOrganizationRole;
  const contextType = currentCommonTabName ? currentCommonTabName[0] : null;

  const activeTasksCount = useMemo(
    () =>
      filteredDashboardTasks?.reduce(
        (accumulator, currentValue) =>
          accumulator + (currentValue?.tasks?.length || 0),
        0,
      ),
    [filteredDashboardTasks],
  );

  const onChangeTaskViewFilter = (newFilter) => {
    dispatch(updateDashboardTaskViewFilter(newFilter));
    localStorageHelper.setDashboardTaskViewFilter(
      currentOrganization?.organizationIdentifier,
      newFilter,
    );
    dispatch(getDashboardTasks());
  };

  const handleMegaFilterOpen = useCallback(() => {
    dispatch(getDashboardFilters());
    dispatch(getQuickFilters({ contextType }));
  }, [contextType, dispatch]);

  const searchTasksWithDebounce = useCallback(() => {
    debounce((value) => {
      onSearchChanged();
      dispatch(searchDashboardTasks(value));
    }, 1000);
  }, [dispatch]);

  const handleSearchChange = (value) => {
    setSearchValue(value);
    if (value) {
      searchTasksWithDebounce(value);
    } else {
      dispatch(
        initializeDashboardState(
          tabName,
          localStorageHelper.getDashboardTaskViewFilter(
            currentOrganization?.organizationIdentifier,
          ),
        ),
      );
    }
  };

  useEffect(() => {
    if (clearSearch) {
      setSearchValue('');
      dispatch(
        initializeDashboardState(
          tabName,
          localStorageHelper.getDashboardTaskViewFilter(
            currentOrganization?.organizationIdentifier,
          ),
        ),
      );
      setTimeout(() => {
        setClearSearch(false);
      }, 500);
    }
  }, [
    clearSearch,
    dispatch,
    setClearSearch,
    tabName,
    currentOrganization?.organizationIdentifier,
  ]);

  useEffect(() => {
    dispatch(getQuickFilters({ contextType }));
    setSearchValue('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabName]);

  const handleSelectQuickFilter = useCallback(
    (id, filtersSetup) => {
      dispatch(selectQuickFilter(id));
      dispatch(selectDashboardFilters(filtersSetup, id));
    },
    [dispatch],
  );

  const handleSaveQuickFilter = useCallback(
    (quickFilterIdentifier, selectedFilters) =>
      dispatch(
        updateQuickFilter(
          quickFilterIdentifier,
          {
            selectedOptions: selectedFilters,
          },
          { contextType },
        ),
      ),
    [contextType, dispatch],
  );

  const handleSaveAsQuickFilter = useCallback(
    () => dispatch(showAddQuickFilterOption()),
    [dispatch],
  );

  const wasChangedFilters = useMemo(
    () =>
      !equals(
        selectedFilters,
        quickFiltersList?.find(
          (f) => f.quickFilterIdentifier === selectedQuickFilter,
        )?.selectedOptions,
      ),
    [quickFiltersList, selectedFilters, selectedQuickFilter],
  );

  const handleQuickFilterCreate = useCallback(
    (name, selectedFilters) =>
      dispatch(createQuickFilter(name, { contextType }, selectedFilters)),
    [contextType, dispatch],
  );

  const handleQuickFilterUpdate = useCallback(
    (quickFilterIdentifier, name) =>
      dispatch(
        updateQuickFilter(quickFilterIdentifier, { name }, { contextType }),
      ),
    [contextType, dispatch],
  );

  const handleQuickFilterDelete = useCallback(
    (quickFilterIdentifier) =>
      dispatch(deleteQuickFilter(quickFilterIdentifier)),
    [dispatch],
  );

  const handleChangeViewType = useCallback(
    (event) => {
      const queryParameters = new URLSearchParams(search);
      const value = event ?? ViewType.LIST_VIEW;
      if (value === ViewType.LIST_VIEW) {
        queryParameters.delete('viewType');
      } else {
        queryParameters.set('viewType', value.toLowerCase());
      }
      history.push({ search: queryParameters.toString() });
    },
    [search, history],
  );

  const updateGroupsPreferences = useCallback(
    (groupType) => {
      const newSetup = groupsPreferences?.includes(groupType)
        ? groupsPreferences.filter((option) => option !== groupType)
        : [...groupsPreferences, groupType];

      setGroupsPreferences(newSetup);
      dispatch(updateCurrentUserPreferences({ displayGroups: newSetup }));
    },
    [dispatch, groupsPreferences],
  );

  const additionalOptions = useMemo(() => {
    return groupList?.map((group) => ({
      name: group.groupName,
      onClick: () => updateGroupsPreferences(group.groupType),
      key: group.key,
      checked: groupsPreferences
        ? groupsPreferences?.includes(group.groupType)
        : group.defaultOpen,
    }));
  }, [groupList, groupsPreferences, updateGroupsPreferences]);

  const openAddTaskDrawer = () => {
    setAddTaskDrawer(true);
    dispatch(openAddTaskTaskDrawer());
  };

  useEffect(() => {
    if (savedDashboardSelectedQuickFilters !== undefined) {
      setMultipleSelectedQuickFilters(
        JSON.parse(savedDashboardSelectedQuickFilters),
      );
    }
  }, [savedDashboardSelectedQuickFilters]);

  const handleUpdateMultipleSelectedQuickFilters = useCallback(
    (identifier) => {
      const quickFiltersList = multipleSelectedQuickFilters || [];
      if (!quickFiltersList?.includes(identifier)) {
        quickFiltersList.push(identifier);
      } else {
        const index = quickFiltersList.indexOf(identifier);
        quickFiltersList.splice(index, 1);
      }
      sessionStorageHelper.setItem(
        'dashboardSelectedQuickFilters',
        JSON.stringify(quickFiltersList),
      );

      setMultipleSelectedQuickFilters(quickFiltersList);
      setTimeout(() => dispatch(getDashboardGroups()), 1000); //time delay results in better home view refresh
    },
    [dispatch, multipleSelectedQuickFilters],
  );

  return (
    <DashboardHeaderContainer>
      <LayoutHeader>
        <UserAvatar
          user={currentUser}
          showOnlineIndicator={false}
          size={55}
          hideTooltip
        />
        <LayoutHeader.Spacer />
        <LayoutHeader.Title title={`Hello ${currentUser.firstName}`} />
      </LayoutHeader>
      <ActionsContainer>
        {viewType !== ViewType.CALENDAR_VIEW && (
          <>
            <Spacing horizontal={4} />
            <Box display="flex" flex={1} justifyContent="flex-start">
              <AccessRestrictor
                allowedToRoles={[ADMIN, OWNER, MEMBER, GUEST, DOCK_LITE]}
              >
                <CustomizeToolbarButton
                  showCustomColumnCreate={false}
                  additionalOptionsTitle="Groups"
                  additionalOptions={additionalOptions}
                  iconColorFilterActive={iconColorFilterActiveItem?.value}
                  isDashboard
                />
                <Box mx={0.5} />
                <HomeTaskViewFilter
                  filter={taskViewFilter}
                  onChange={onChangeTaskViewFilter}
                />
                <Box mx={0.5} />
                <MegaFilter
                  filters={filterOptions}
                  selectedFilters={selectedFilters}
                  onSelectFilters={compose(dispatch, selectDashboardFilters)}
                  taskStatus="INCOMPLETE"
                  activeItemsAmount={activeTasksCount}
                  onOpen={handleMegaFilterOpen}
                  isFetching={isFetchingFilters}
                  quickFiltersList={quickFiltersList}
                  addQuickFilterOption={addQuickFilterOption}
                  selectedQuickFilter={selectedQuickFilter}
                  selectQuickFilter={handleSelectQuickFilter}
                  handleSaveQuickFilter={handleSaveQuickFilter}
                  onSaveAsNewClick={handleSaveAsQuickFilter}
                  wasChangedFilters={wasChangedFilters}
                  onQuickFilterCreate={handleQuickFilterCreate}
                  onQuickFilterUpdate={handleQuickFilterUpdate}
                  onQuickFilterDelete={handleQuickFilterDelete}
                  clearFilter={clearFilter}
                  setClearFilter={setClearFilter}
                  origin={TaskOrigin.DASHBOARD}
                  multiSelectEnabled
                  multipleSelectedQuickFilters={multipleSelectedQuickFilters}
                  updateMultipleSelectedQuickFilters={
                    handleUpdateMultipleSelectedQuickFilters
                  }
                />
                <Box mx={0.5} />
                <HeaderSearch
                  value={searchValue}
                  onChange={handleSearchChange}
                />
              </AccessRestrictor>
            </Box>
          </>
        )}
        <Box mr>
          <AddTaskButtonWrapper onClick={openAddTaskDrawer}>
            <Add />
            <AddTaskButtonLabel>Add Task</AddTaskButtonLabel>
          </AddTaskButtonWrapper>
        </Box>
        <Box
          display="flex"
          flex={viewType === ViewType.CALENDAR_VIEW ? 1 : 0}
          justifyContent="flex-end"
        >
          <GridContainer>
            <GridItemCalendarView
              active={calendarView}
              onClick={() => {
                handleChangeViewType(ViewType.CALENDAR_VIEW);
                setCalendarView(true);
                setSlimView(false);
              }}
            >
              <CalendarMonthOutlinedIcon
                sx={{
                  height: '28px',
                  width: '24px',
                }}
              />
            </GridItemCalendarView>
            <GridItemSlimView
              active={slimView}
              onClick={() => {
                handleChangeViewType(ViewType.LIST_VIEW);
                setSlimView(true);
                setCalendarView(false);
              }}
            >
              <SlimViewIcon />
            </GridItemSlimView>
          </GridContainer>
        </Box>
      </ActionsContainer>
    </DashboardHeaderContainer>
  );
};

export default DashboardHeader;
