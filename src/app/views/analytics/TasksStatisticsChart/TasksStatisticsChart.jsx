import React, { useEffect, useState } from 'react';
import moment from 'moment';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { showGlobalErrorAlert } from 'alert/actions';
import { analyticsSelectedFiltersSelector } from 'selectors/analytics-selectors';
import * as AnalyticsApi from 'api/analytics-api';
import { TrendType } from 'helpers/analytics-helpers';
import map from 'ramda/src/map';
import find from 'ramda/src/find';
import propEq from 'ramda/src/propEq';
import palette from 'styles/palette';

const TasksStatisticsChart = () => {
  const dispatch = useDispatch();
  const selectedFilters = useSelector(analyticsSelectedFiltersSelector);
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(null);

    const request = selectedFilters
      ? Promise.all([
          AnalyticsApi.getFilteredTrendsByDate(
            TrendType.TASKS_CREATED,
            selectedFilters,
          ),
          AnalyticsApi.getFilteredTrendsByDate(
            TrendType.TASKS_COMPLETED,
            selectedFilters,
          ),
        ])
      : Promise.all([
          AnalyticsApi.getTrendsByDate(TrendType.TASKS_CREATED),
          AnalyticsApi.getTrendsByDate(TrendType.TASKS_COMPLETED),
        ]);

    request
      .then(([created, completed]) => {
        const metrics = map(({ date, metricValue }) => {
          const completedValue = find(
            propEq('date', date),
            completed,
          )?.metricValue;

          return {
            created: metricValue,
            completed: completedValue,
            date,
          };
        }, created);

        setData(metrics);
      })
      .catch(() => {
        dispatch(showGlobalErrorAlert());
      });
  }, [dispatch, selectedFilters]);

  return (
    data && (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => moment(value).format('MM/DD/YY')}
          />

          <YAxis
            allowDecimals={false}
            label={{ value: 'Tasks', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            labelFormatter={(value) => moment(value).format('MM/DD/YYYY')}
          />
          <Legend verticalAlign="bottom" />
          <Line
            type="monotone"
            dataKey="created"
            stroke={palette.midnightBlue}
          />
          <Line
            type="monotone"
            dataKey="completed"
            stroke={palette.brightBlue}
          />
        </LineChart>
      </ResponsiveContainer>
    )
  );
};

export default TasksStatisticsChart;
