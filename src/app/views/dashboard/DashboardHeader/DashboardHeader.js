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
import { compose } from 'ramda';

const DashboardHeader = () => {
  const [searchValue, setSearchValue] = useState('');
  const dispatch = useDispatch();
  const isFetchingFilters = useSelector(isFetchingDashboardFiltersSelector);
  const dashboardTasks = useSelector(dashboardTasksSelector);
  const currentUser = useSelector(userProfileSelector);
  const tabName = useSelector(dashboardTabNameSelector);
  const filterOptions = useSelector(dashboardFilterOptionsSelector);
  const selectedFilters = useSelector(dashboardSelectedFiltersSelector);

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
  }, [dispatch]);

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
        filters={filterOptions}
        selectedFilters={selectedFilters}
        onSelectFilters={compose(dispatch, selectDashboardFilters)}
        taskStatus="INCOMPLETE"
        activeItemsAmount={activeTasksCount}
        onOpen={handleMegaFilterOpen}
        isFetching={isFetchingFilters}
      />
    </LayoutHeader>
  );
};

export default DashboardHeader;
