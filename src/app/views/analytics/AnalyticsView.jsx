import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import { userProfileSelector } from 'selectors/user-selectors';
import {
  analyticsFiltersSelector,
  analyticsSelectedFiltersSelector,
} from 'selectors/analytics-selectors';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import { useDispatch, useSelector } from 'react-redux';
import compose from 'ramda/src/compose';
import equals from 'ramda/src/equals';
import * as AnalyticsActions from 'actions/analytics-actions';

import MegaFilter from 'components/tasklist/MegaFilter/MegaFilter';
import {
  showAddQuickFilterOption,
  deleteQuickFilter,
  selectQuickFilter,
  getAnalyticsQuickFilters,
  createQuickAnalyticsFilter,
  updateQuickAnalyticsFilter,
} from 'actions/mega-filter-actions';
import {
  addQuickFilterOptionSelector,
  quickFiltersSelector,
  selectedQuickFilterSelector,
  isFetchingFiltersSelector,
} from 'selectors/mega-filter-selectors';
import ChartTail from './ChartTail/ChartTail';
import { Container, ChartsContainer } from './styled';
import WorkflowStatusStatisticsChart from './WorkflowStatusStatisticsChart/WorkflowStatusStatisticsChart';
import AssignedToStatisticsChart from './AssignedToStatisticsChart/AssignedToStatisticsChart';
import TaskLabelStatisticsChart from './TaskLabelStatisticsChart/TaskLabelStatisticsChart';
import PatientLabelStatisticsChart from './PatientLabelStatisticsChart/PatientLabelStatisticsChart';
import CreatedCommentsChart from './CreatedCommentsChart/CreatedCommentsChart';
import TasksStatisticsChart from './TasksStatisticsChart/TasksStatisticsChart';

const AnalyticsView = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userProfile = useSelector(userProfileSelector);

  const isFetchingFilters = useSelector(isFetchingFiltersSelector);
  const quickFiltersList = useSelector(quickFiltersSelector);
  const addQuickFilterOption = useSelector(addQuickFilterOptionSelector);
  const selectedQuickFilter = useSelector(selectedQuickFilterSelector);

  const filters = useSelector(analyticsFiltersSelector);
  const selectedFilters = useSelector(analyticsSelectedFiltersSelector);

  useEffect(() => {
    dispatch(AnalyticsActions.getAnalyticsFilterOptions());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectedFiltersChange = newSelectedFilters => {
    dispatch(AnalyticsActions.setAnalyticsSelectedFilters(newSelectedFilters));
  };

  const handleSaveAsQuickFilter = useCallback(
    () => dispatch(showAddQuickFilterOption()),
    [dispatch],
  );

  useEffect(() => {
    if (!checkIfUserIsOrganizationAdmin(userProfile)) {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  const handleMegaFilterOpen = useCallback(() => {
    dispatch(getAnalyticsQuickFilters());
  }, [dispatch]);

  const handleSelectQuickFilter = useCallback(
    (id, filtersSetup) => {
      dispatch(selectQuickFilter(id));
      dispatch(AnalyticsActions.setAnalyticsSelectedFilters(filtersSetup));
    },
    [dispatch],
  );

  const handleSaveQuickFilter = useCallback(
    () =>
      dispatch(
        updateQuickAnalyticsFilter(selectedQuickFilter, {
          selectedOptions: selectedFilters,
        }),
      ),
    [dispatch, selectedFilters, selectedQuickFilter],
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
    name => dispatch(createQuickAnalyticsFilter(name, selectedFilters)),
    [dispatch, selectedFilters],
  );

  const handleQuickFilterUpdate = useCallback(
    (quickFilterIdentifier, name) =>
      dispatch(updateQuickAnalyticsFilter(quickFilterIdentifier, { name })),
    [dispatch],
  );

  const handleQuickFilterDelete = useCallback(
    quickFilterIdentifier => dispatch(deleteQuickFilter(quickFilterIdentifier)),
    [dispatch],
  );

  const [maximizedChart, setMaximizedChart] = useState();

  const handleChartMaximize = name => {
    setMaximizedChart(name);
  };

  return (
    <ViewLayout header={<BasicLayoutHeader title="Analytics" />}>
      <Container>
        <MegaFilter
          filters={filters}
          selectedFilters={selectedFilters}
          onSelectFilters={compose(
            dispatch,
            AnalyticsActions.setAnalyticsSelectedFilters,
          )}
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
          onSelectedFiltersChange={handleSelectedFiltersChange}
          onClear={() => dispatch(AnalyticsActions.clearAnalyticsFilter())}
        />
        <Box p={1} />
        <span>
          By default (no filter) stats below are displayed for tasks created in
          the last 30 day period.
        </span>
        <ChartsContainer>
          <ChartTail
            name="Tasks Created and Completed"
            maximized={maximizedChart}
            onMaximize={handleChartMaximize}
          >
            <TasksStatisticsChart />
          </ChartTail>
          <ChartTail name="Comments Created" onMaximize={handleChartMaximize}>
            <CreatedCommentsChart />
          </ChartTail>
          <ChartTail name="Tasks by Status" onMaximize={handleChartMaximize}>
            <WorkflowStatusStatisticsChart />
          </ChartTail>
          <ChartTail
            name="Tasks by Assigned To"
            onMaximize={handleChartMaximize}
          >
            <AssignedToStatisticsChart />
          </ChartTail>
          <ChartTail name="Tasks by Labels" onMaximize={handleChartMaximize}>
            <TaskLabelStatisticsChart />
          </ChartTail>
          <ChartTail
            name="Tasks by Patient Labels"
            onMaximize={handleChartMaximize}
          >
            <PatientLabelStatisticsChart />
          </ChartTail>
        </ChartsContainer>
      </Container>
    </ViewLayout>
  );
};

export default AnalyticsView;
