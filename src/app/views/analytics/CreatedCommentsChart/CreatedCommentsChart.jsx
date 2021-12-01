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
} from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { showGlobalErrorAlert } from 'alert/actions';
import { analyticsSelectedFiltersSelector } from 'selectors/analytics-selectors';
import * as AnalyticsApi from 'api/analytics-api';
import { TrendType } from 'helpers/analytics-helpers';
import { sortBy, compose, map } from 'ramda';
import palette from 'styles/palette';

const CreatedCommentsChart = () => {
  const dispatch = useDispatch();
  const selectedFilters = useSelector(analyticsSelectedFiltersSelector);
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(null);

    (selectedFilters
      ? AnalyticsApi.getFilteredTrendsByDate(
          TrendType.COMMENTS_CREATED,
          selectedFilters,
        )
      : AnalyticsApi.getTrendsByDate(TrendType.COMMENTS_CREATED)
    )
      .then(responseData => {
        compose(
          setData,
          map(({ date, metricValue }) => ({
            date,
            comments: metricValue,
          })),
          sortBy(({ date }) => date),
        )(responseData);
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
            tickFormatter={value => moment(value).format('MM/DD/YY')}
          />

          <YAxis />
          <Tooltip
            labelFormatter={value => moment(value).format('MM/DD/YYYY')}
          />
          <Line
            type="monotone"
            dataKey="comments"
            stroke={palette.midnightBlue}
          />
        </LineChart>
      </ResponsiveContainer>
    )
  );
};

export default CreatedCommentsChart;
