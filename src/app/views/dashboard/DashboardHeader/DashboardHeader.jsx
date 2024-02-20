import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { Box } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import {
  dashboardTasksSelector,
  dashboardTabNameSelector,
  dashboardFilterOptionsSelector,
  isFetchingDashboardFiltersSelector,
  dashboardSelectedFiltersSelector,
} from 'selectors/dashboard-selectors';
import {
  getDashboardFilters,
  initializeDashboardState,
  searchDashboardTasks,
  selectDashboardFilters,
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
import MegaFilter from 'components/tasklist/MegaFilter/MegaFilter';
import HeaderSearch from 'components/template/HeaderSearch/HeaderSearch';
import CustomizeToolbarButton from 'components/tasklist/CustomizeToolbarButton/CustomizeToolbarButton';
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
} from 'selectors/mega-filter-selectors';
import {
  DashboardTasksTab,
  DashboardQuickFilters,
} from 'helpers/dashboard-helpers';
import { UserOrganizationRole } from 'helpers/user-helper';
import { getViewTypeFromQueryString, ViewType } from 'helpers/view-type-helper';
// import TaskViewTypeToolbarSelect from 'components/tasklist/TaskViewTypeToolbarSelect/TaskViewTypeToolbarSelect';
import FullViewIcon from 'img/list/FullViewIcon';
import SlimViewIcon from 'img/list/SlimViewIcon';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import Spacing from 'components/common/Spacing';
import { updateCurrentUserPreferences } from 'actions/user-actions';
import {
  GridContainer,
  GridItemCalendarView,
  GridItemFullView,
  GridItemSlimView,
} from './styled';
import {
  ActionsContainer,
  DashboardQuickFilter,
  DashboardQuickFilterClear,
  DashboardQuickFilterContainer,
  DashboardQuickFilterLabel,
} from '../DashboardToolbar/styled';

import { DashboardHeaderContainer } from './styled';

const DashboardHeader = () => {
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
  const selectedFilters = useSelector(dashboardSelectedFiltersSelector);
  const quickFiltersList = useSelector(quickFiltersSelector);
  const addQuickFilterOption = useSelector(addQuickFilterOptionSelector);
  const selectedQuickFilter = useSelector(selectedQuickFilterSelector);
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
  // const [fullView, setFullView] = useState(false);

  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const iconColorFilterActiveItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'icon.active.filter',
    ) || {};

  const { ADMIN, OWNER, MEMBER, GUEST, DOCK_LITE } = UserOrganizationRole;
  // const DashBoardQucikFilter = [
  //   'Escalations',
  //   'Overdue',
  //   'Due Today',
  //   'Created by me',
  //   'Shared with me',
  // ];
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

  const handleMegaFilterOpen = useCallback(() => {
    dispatch(getDashboardFilters());
    dispatch(getQuickFilters({ contextType }));
  }, [contextType, dispatch]);

  const searchTasksWithDebounce = useCallback(
    debounce((value) => {
      onSearchChanged();
      dispatch(searchDashboardTasks(value));
    }, 1000),
    [],
  );

  const handleSearchChange = (value) => {
    setSearchValue(value);
    if (value) {
      searchTasksWithDebounce(value);
    } else {
      dispatch(initializeDashboardState(tabName));
    }
  };

  useEffect(() => {
    setSearchValue('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabName]);

  const handleSelectQuickFilter = useCallback(
    (id, filtersSetup) => {
      dispatch(selectQuickFilter(id));
      dispatch(selectDashboardFilters(filtersSetup));
    },
    [dispatch],
  );

  const handleSaveQuickFilter = useCallback(
    () =>
      dispatch(
        updateQuickFilter(
          selectedQuickFilter,
          {
            selectedOptions: selectedFilters,
          },
          { contextType },
        ),
      ),
    [contextType, dispatch, selectedFilters, selectedQuickFilter],
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
    (name) =>
      dispatch(createQuickFilter(name, { contextType }, selectedFilters)),
    [contextType, dispatch, selectedFilters],
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

  const [quickFilters, setQuickFilters] = useState([]);

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
        {/* {viewType !== ViewType.CALENDAR_VIEW && (
          <>
            <LayoutHeader.Spacer />
            <HeaderSearch value={searchValue} onChange={handleSearchChange} />
            <LayoutHeader.Spacer />
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
              onSaveClick={handleSaveQuickFilter}
              onSaveAsNewClick={handleSaveAsQuickFilter}
              wasChangedFilters={wasChangedFilters}
              onQuickFilterCreate={handleQuickFilterCreate}
              onQuickFilterUpdate={handleQuickFilterUpdate}
              onQuickFilterDelete={handleQuickFilterDelete}
            />
          </>
        )} */}
      </LayoutHeader>
      <ActionsContainer>
        {/* {tabName !== DashboardTasksTab.SHARED_TASKS && (
          <TaskViewSelectWrapper>
            <TaskViewTypeToolbarSelect
              value={viewType}
              onChange={handleChangeViewType}
              // iconColorFilterActive={iconColorFilterActive}
              // iconColorActive={iconColorActive}
            />
          </TaskViewSelectWrapper>
        )} */}
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
                <LayoutHeader.Spacer />
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
                  onSaveClick={handleSaveQuickFilter}
                  onSaveAsNewClick={handleSaveAsQuickFilter}
                  wasChangedFilters={wasChangedFilters}
                  onQuickFilterCreate={handleQuickFilterCreate}
                  onQuickFilterUpdate={handleQuickFilterUpdate}
                  onQuickFilterDelete={handleQuickFilterDelete}
                />
                <LayoutHeader.Spacer />
                <HeaderSearch
                  value={searchValue}
                  onChange={handleSearchChange}
                />
                <LayoutHeader.Spacer />
              </AccessRestrictor>
              <DashboardQuickFilterContainer>
                {DashboardQuickFilters.map((value, index) => {
                  return (
                    <DashboardQuickFilter
                      key={value}
                      active={quickFilters.some((object) => object === value)}
                      onClick={() => {
                        if (!quickFilters.some((object) => object === value))
                          setQuickFilters((current) => [...current, value]);
                      }}
                    >
                      <DashboardQuickFilterLabel
                        active={quickFilters.some((object) => object === value)}
                      >
                        {value}
                      </DashboardQuickFilterLabel>
                      {quickFilters.some((object) => object === value) ? (
                        <DashboardQuickFilterClear
                          active={quickFilters.some(
                            (object) => object === value,
                          )}
                          onClick={() => {
                            const deleteObj = quickFilters.filter((object) => {
                              if (object !== value) return object;
                            });
                            setQuickFilters(deleteObj);
                          }}
                        >
                          <ClearIcon sx={{ height: '16px', width: '16px' }} />
                        </DashboardQuickFilterClear>
                      ) : (
                        <></>
                      )}
                    </DashboardQuickFilter>
                  );
                })}
              </DashboardQuickFilterContainer>
            </Box>
          </>
        )}
        <Box
          display="flex"
          flex={viewType === ViewType.CALENDAR_VIEW ? 1 : 0}
          justifyContent="flex-end"
        >
          <GridContainer>
            <GridItemCalendarView active={calendarView}>
              <Box
                sx={{ marginTop: '4px' }}
                onClick={() => {
                  handleChangeViewType(ViewType.CALENDAR_VIEW);
                  setCalendarView(true);
                  setSlimView(false);
                  // setFullView(false);
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
            </GridItemCalendarView>
            {/* <GridItemFullView active={fullView}>
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
            </GridItemFullView> */}
            <GridItemSlimView active={slimView}>
              <Box
                onClick={() => {
                  handleChangeViewType(ViewType.LIST_VIEW);
                  // setFullView(true);
                  setSlimView(true);
                  setCalendarView(false);
                }}
                sx={{ marginTop: '8px' }}
              >
                <SlimViewIcon />
              </Box>
            </GridItemSlimView>
          </GridContainer>
        </Box>
      </ActionsContainer>
    </DashboardHeaderContainer>
  );
};

export default DashboardHeader;
