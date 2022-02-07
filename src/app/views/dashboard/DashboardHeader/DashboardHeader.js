import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { compose, equals } from 'ramda';
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

const DashboardHeader = () => {
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
    dispatch(getQuickFilters({ tabName }));
  }, [dispatch, tabName]);

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
            filters: selectedFilters,
          },
          { tabName },
        ),
      ),
    [dispatch, selectedFilters, selectedQuickFilter, tabName],
  );

  const handleSaveAsQuickFilter = useCallback(
    () => dispatch(showAddQuickFilterOption()),
    [dispatch],
  );

  const wasChangedFilters = useMemo(
    () =>
      !equals(
        selectedFilters,
        quickFiltersList.find(f => f.key === selectedQuickFilter)?.filters,
      ),
    [quickFiltersList, selectedFilters, selectedQuickFilter],
  );

  console.log('wasChangedFilters', wasChangedFilters);
  console.log('1', selectedFilters);
  console.log('2', quickFiltersList);
  console.log(
    '3',
    quickFiltersList.find(f => f.key === selectedQuickFilter)?.filters,
  );

  const handleQuickFilterCreate = useCallback(
    name => dispatch(createQuickFilter(name, { tabName }, selectedFilters)),
    [dispatch, selectedFilters, tabName],
  );

  const handleQuickFilterUpdate = useCallback(
    (key, name) =>
      dispatch(updateQuickFilter(key, { displayValue: name }, { tabName })),
    [dispatch, tabName],
  );

  const handleQuickFilterDelete = useCallback(
    key => dispatch(deleteQuickFilter(key)),
    [dispatch],
  );

  return (
    <LayoutHeader>
      <UserAvatar
        user={currentUser}
        showOnlineIndicator={false}
        size={55}
        hideTooltip
      />
      <LayoutHeader.Spacer />
      <LayoutHeader.Title title={`Hello ${currentUser.firstName}`} />
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
    </LayoutHeader>
  );
};

export default DashboardHeader;
