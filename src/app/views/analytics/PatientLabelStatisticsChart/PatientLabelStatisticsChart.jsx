import React, { useEffect, useState } from 'react';
import * as AnalyticsApi from 'api/analytics-api';
import {
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { showGlobalErrorAlert } from 'alert/actions';
import { useDispatch, useSelector } from 'react-redux';
import { analyticsSelectedFiltersSelector } from 'selectors/analytics-selectors';
import { getTopMetrics, StatisticsGroupType } from 'helpers/analytics-helpers';
import LegendText from 'components/analytics/LegendText/LegendText';

const PatientLabelStatisticsChart = () => {
  const dispatch = useDispatch();
  const selectedFilters = useSelector(analyticsSelectedFiltersSelector);
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(null);

    (selectedFilters
      ? AnalyticsApi.getFilteredGroupedStatistics(
          StatisticsGroupType.TASK_PATIENTLABEL,
          selectedFilters,
        )
      : AnalyticsApi.getGroupedStatistics(StatisticsGroupType.TASK_PATIENTLABEL)
    )
      .then(responseMetrics => {
        setData(getTopMetrics(responseMetrics, 14));
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

export default PatientLabelStatisticsChart;
