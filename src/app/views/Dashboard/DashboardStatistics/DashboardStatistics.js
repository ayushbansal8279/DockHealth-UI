import React from 'react';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';
import {
  dashboardStatisticsSelector,
  dashboardStatisticsIsLoadingSelector,
} from 'selectors/dashboard-statistics-selectors';
import { dashboardTasksIsLoadingSelector } from 'selectors/dashboard-tasks-selectors';
import { MontserratTypography } from 'styles/theme-montserrat';
import DashboardStatisticsIcon from 'img/dashboard-statistics';
import DashboardStatisticsTile from './DashboardStatisticsTile';

import {
  DashboardStatisticsLabel,
  DashboardStatisticsContainer,
  DashboardStatisticsLabelBox,
  DashboardStatisticsTilesContainer,
} from './styled';
import DashboardStatisticsLoader from '../DashboardStatisticsLoader/DashboardStatisticsLoader';

const TILS_CONFIG = {
  'my-tasks': {
    completed: 'purpleBlue',
    assigned: 'redPurple',
    patientsCared: 'orangeYellow',
  },
  'all-tasks': {
    completed: 'orangeRed',
    assigned: 'greenTurquoise',
    patientsCared: 'bluePurple',
  },
};

const DashboardStatistics = ({
  dashboardStatistics,
  dashboardIsLoading,
  dashboardTab,
}) => {
  const patientStatsAmount = dashboardStatistics?.find(
    ({ metricName }) => metricName === 'PATIENTS_SERVED_COUNT',
  )?.metricValue;
  const showPatientAmount = patientStatsAmount !== 0;

  return (
    <DashboardStatisticsContainer>
      {dashboardIsLoading ? (
        <DashboardStatisticsLoader />
      ) : (
        <>
          <Grid container direction="row" spacing={2}>
            <DashboardStatisticsLabelBox item xs={3}>
              <img src={DashboardStatisticsIcon} alt="statistics" />
              <DashboardStatisticsLabel paddingLeft="4px">
                <MontserratTypography variant="span">
                  TODAY&apos;S STATUS
                </MontserratTypography>
              </DashboardStatisticsLabel>
            </DashboardStatisticsLabelBox>
            <Grid item xs={3}>
              <MontserratTypography variant="span">
                <DashboardStatisticsLabel>
                  PAST 30 DAYS
                </DashboardStatisticsLabel>
              </MontserratTypography>
            </Grid>
          </Grid>
          <DashboardStatisticsTilesContainer>
            <DashboardStatisticsTile
              label="OPEN TASKS"
              amount={
                dashboardStatistics?.find(
                  ({ metricName }) => metricName === 'INCOMPLETE_TASKS_COUNT',
                )?.metricValue
              }
            />

            <DashboardStatisticsTile
              background={TILS_CONFIG[dashboardTab]?.completed}
              icon="completed"
              label="COMPLETED"
              amount={
                dashboardStatistics?.find(
                  ({ metricName }) => metricName === 'COMPLETED_TASKS_COUNT',
                )?.metricValue
              }
            />

            <DashboardStatisticsTile
              background={TILS_CONFIG[dashboardTab]?.assigned}
              icon="assigned"
              label="ASSIGNED"
              amount={
                dashboardStatistics?.find(
                  ({ metricName }) => metricName === 'ASSIGNED_TASKS_COUNT',
                )?.metricValue
              }
            />

            <DashboardStatisticsTile
              background={TILS_CONFIG[dashboardTab]?.patientsCared}
              icon="patientsCared"
              label={
                showPatientAmount
                  ? 'PATIENTS CARED FOR'
                  : 'We can calculate patients when they are assigned to their tasks'
              }
              alignText="center"
              amount={patientStatsAmount}
              showAmount={showPatientAmount}
            />
          </DashboardStatisticsTilesContainer>
        </>
      )}
    </DashboardStatisticsContainer>
  );
};

const mapStateToProps = state => ({
  dashboardStatistics: dashboardStatisticsSelector(state),
  dashboardIsLoading:
    dashboardStatisticsIsLoadingSelector(state) ||
    dashboardTasksIsLoadingSelector(state),
});

export default connect(mapStateToProps)(React.memo(DashboardStatistics));
