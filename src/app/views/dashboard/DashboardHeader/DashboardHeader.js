import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { megaFilterSelector } from 'selectors/mega-filter-selectors';
import {
  dashboardTasksIsLoadingSelector,
  dashboardTasksSelector,
  dashboardTabNameSelector,
} from 'selectors/dashboard-tasks-selectors';
import {
  getDashboardFilters,
  initializeDashboardState,
  searchDashboardTasks,
} from 'actions/dashboard-actions';
import { userProfileSelector } from 'selectors/user-selectors';
import debounce from 'lodash.debounce';
import { onSearchChanged } from 'helpers/ga-event-helper';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import LayoutHeader from 'components/template/LayoutHeader/LayoutHeader';
import MegaFilter from 'components/tasklist/MegaFilter/MegaFilter';
import { selectFiltersForMegaFilter } from 'actions/mega-filter-actions';
import { isEmpty } from 'ramda';
import HeaderSearch from 'components/template/HeaderSearch/HeaderSearch';

const DashboardHeader = () => {
  const [searchValue, setSearchValue] = useState('');
  const dispatch = useDispatch();
  const isLoadingTasks = useSelector(dashboardTasksIsLoadingSelector);
  const dashboardTasks = useSelector(dashboardTasksSelector);
  const currentUser = useSelector(userProfileSelector);
  const tabName = useSelector(dashboardTabNameSelector);
  const megaFilter = useSelector(megaFilterSelector);
  const { filters, selectedFilters } = megaFilter || {};

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
    if (!selectedFilters || isEmpty(selectedFilters))
      dispatch(getDashboardFilters());
  }, [dispatch, selectedFilters]);

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
        filters={filters}
        selectedFilters={selectedFilters}
        onSelectFilters={sf =>
          dispatch(selectFiltersForMegaFilter(sf, 'dashboard', tabName))
        }
        taskStatus="INCOMPLETE"
        activeItemsAmount={activeTasksCount}
        onOpen={handleMegaFilterOpen}
        isFetching={isLoadingTasks}
      />
    </LayoutHeader>
  );
};

export default DashboardHeader;
