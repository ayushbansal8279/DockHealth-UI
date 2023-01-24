import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
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
import { userProfileSelector } from 'selectors/user-selectors';
import debounce from 'lodash.debounce';
import { onSearchChanged } from 'helpers/ga-event-helper';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import LayoutHeader from 'components/template/LayoutHeader/LayoutHeader';
import MegaFilter from 'components/tasklist/MegaFilter/MegaFilter';
import HeaderSearch from 'components/template/HeaderSearch/HeaderSearch';
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
import { DashboardTasksTab } from 'helpers/dashboard-helpers';
import { getViewTypeFromQueryString, ViewType } from 'helpers/view-type-helper';
import { DashboardHeaderContainer } from './styled';

const DashboardHeader = () => {
  const { search } = useLocation();
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
    taskGroupInfo => taskGroupInfo?.metricValue !== 0,
  );
  const currentCommonTabName = Object.entries(DashboardTasksTab || {})?.filter(
    ([, value]) => value === tabName,
  )?.[0];

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
    debounce(value => {
      onSearchChanged();
      dispatch(searchDashboardTasks(value));
    }, 1000),
    [],
  );

  const handleSearchChange = value => {
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
          f => f.quickFilterIdentifier === selectedQuickFilter,
        )?.selectedOptions,
      ),
    [quickFiltersList, selectedFilters, selectedQuickFilter],
  );

  const handleQuickFilterCreate = useCallback(
    name => dispatch(createQuickFilter(name, { contextType }, selectedFilters)),
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
    quickFilterIdentifier => dispatch(deleteQuickFilter(quickFilterIdentifier)),
    [dispatch],
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
        {viewType !== ViewType.CALENDAR_VIEW && (
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
        )}
      </LayoutHeader>
    </DashboardHeaderContainer>
  );
};

export default DashboardHeader;
