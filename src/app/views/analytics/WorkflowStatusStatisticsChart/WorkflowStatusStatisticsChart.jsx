import React, { useEffect, useState } from 'react';
import * as AnalyticsApi from 'api/analytics-api';
import {
  ResponsiveContainer,
  Legend,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { showGlobalErrorAlert } from 'alert/actions';
import { useSelector, useDispatch } from 'react-redux';
import { analyticsSelectedFiltersSelector } from 'selectors/analytics-selectors';
import LegendText from 'components/analytics/LegendText/LegendText';
import { getTopMetrics, StatisticsGroupType } from 'helpers/analytics-helpers';
import palette from 'styles/palette';

const WorkflowStatusStatisticsChart = () => {
  const dispatch = useDispatch();
  const selectedFilters = useSelector(analyticsSelectedFiltersSelector);
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(null);

    (selectedFilters
      ? AnalyticsApi.getFilteredGroupedStatistics(
          StatisticsGroupType.TASK_WORKFLOWSTATUS,
          selectedFilters,
        )
      : AnalyticsApi.getGroupedStatistics(
          StatisticsGroupType.TASK_WORKFLOWSTATUS,
        )
    )
      .then(responseMetrics => {
        const mappedMetrics = responseMetrics.map(
          ({ metricName, metricValue, metricColor }) => ({
            metricName: metricName ?? 'No status',
            metricValue,
            metricColor: metricName ? metricColor : palette.coolGrey3,
          }),
        );
        setData(getTopMetrics(mappedMetrics));
      })
      .catch(() => {
        dispatch(showGlobalErrorAlert());
      });
  }, [dispatch, selectedFilters]);

  const renderLegendText = (value, entry) => {
    return (
      <LegendText value={value} metricValue={entry?.payload?.metricValue} />
    );
  };

  return (
    data && (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="metricValue"
            nameKey="metricName"
            cx="50%"
            cy="50%"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${entry.metricName}`}
                fill={data[index].metricColor}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend formatter={renderLegendText} />
        </PieChart>
      </ResponsiveContainer>
    )
  );
};

export default WorkflowStatusStatisticsChart;
