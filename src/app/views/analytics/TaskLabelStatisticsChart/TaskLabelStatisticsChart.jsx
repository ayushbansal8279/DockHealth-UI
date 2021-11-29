import React, { useEffect, useState } from 'react';
import * as AnalyticsApi from 'api/analytics-api';
import {
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Legend,
  Cell,
} from 'recharts';
import { useSelector, useDispatch } from 'react-redux';
import { showGlobalErrorAlert } from 'alert/actions';
import { analyticsSelectedFiltersSelector } from 'selectors/analytics-selectors';
import { getTopMetrics, StatisticsGroupType } from 'helpers/analytics-helpers';
import LegendText from 'components/analytics/LegendText/LegendText';

const TaskLabelStatisticsChart = () => {
  const dispatch = useDispatch();
  const selectedFilters = useSelector(analyticsSelectedFiltersSelector);
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(null);

    (selectedFilters
      ? AnalyticsApi.getFilteredGroupedStatistics(
          StatisticsGroupType.TASK_TASKLABEL,
          selectedFilters,
        )
      : AnalyticsApi.getGroupedStatistics(StatisticsGroupType.TASK_TASKLABEL)
    )
      .then(responseMetrics => {
        setData(getTopMetrics(responseMetrics, 14));
      })
      .catch(() => {
        dispatch(showGlobalErrorAlert());
      });
  }, [dispatch, selectedFilters]);

  const renderLegendText = value => {
    return <LegendText value={value} />;
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

export default TaskLabelStatisticsChart;
