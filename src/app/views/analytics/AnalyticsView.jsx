import React, { useEffect, useRef } from 'react';
import { Box } from '@material-ui/core';
import { useBoolean } from 'hooks/useBoolean';
import { useHistory } from 'react-router-dom';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import FilterButton from 'components/filter/FilterButton/FilterButton';
import { userProfileSelector } from 'selectors/user-selectors';
import { analyticsFiltersActiveSelector } from 'selectors/analytics-selectors';
import { setHeader, unsetHeader } from 'actions/template-actions';
import { clearAnalyticsFilter } from 'actions/analytics-actions';
import GenericHeader from 'components/template/GenericHeader/GenericHeader';
import FilterPopover from 'components/filter/FilterPopover/FilterPopover';
import { useDispatch, useSelector } from 'react-redux';
import ChartTail from './ChartTail/ChartTail';
import AnalyticsFilters from './AnalyticsFilters/AnalyticsFilters';
import { ViewContainer, ChartsContainer } from './styled';
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
  const analyticsFiltersActive = useSelector(analyticsFiltersActiveSelector);
  const filterButtonReference = useRef(null);
  const { 0: filterOpen, 2: closeFilter, 3: toggleFilter } = useBoolean(false);

  useEffect(() => {
    dispatch(
      setHeader({
        layout: [
          {
            key: 'dashboard',
            component: (
              <>
                <GenericHeader>Analytics</GenericHeader>
              </>
            ),
          },
        ],
      }),
    );

    return () => {
      dispatch(unsetHeader);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!checkIfUserIsOrganizationAdmin(userProfile)) {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  return (
    <>
      <ViewContainer>
        <FilterButton
          ref={filterButtonReference}
          active={analyticsFiltersActive}
          onClick={toggleFilter}
          onClear={() => dispatch(clearAnalyticsFilter())}
        />
        <Box p={1} />
        <ChartsContainer>
          <ChartTail name="Tasks Created and Completed (last 30 days)">
            <TasksStatisticsChart />
          </ChartTail>
          <ChartTail name="Comments Created (last 30 days)">
            <CreatedCommentsChart />
          </ChartTail>
          <ChartTail name="Open Tasks by Status">
            <WorkflowStatusStatisticsChart />
          </ChartTail>
          <ChartTail name="Open Tasks by Assigned To">
            <AssignedToStatisticsChart />
          </ChartTail>
          <ChartTail name="Open Tasks by Labels">
            <TaskLabelStatisticsChart />
          </ChartTail>
          <ChartTail name="Open Tasks by Patient Labels">
            <PatientLabelStatisticsChart />
          </ChartTail>
        </ChartsContainer>
      </ViewContainer>
      <FilterPopover
        anchorEl={filterButtonReference.current}
        open={filterOpen}
        onClose={closeFilter}
      >
        <AnalyticsFilters />
      </FilterPopover>
    </>
  );
};

export default AnalyticsView;
