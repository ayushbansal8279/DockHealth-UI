import Chart from 'chart.js';
import moment from 'moment';
import find from 'ramda/es/find';
import map from 'ramda/es/map';
import prop from 'ramda/es/prop';
import propEq from 'ramda/es/propEq';
import range from 'ramda/es/range';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const ChartOuterContainer = styled.div`
  flex: 1;
  overflow: hidden;
  padding: 5px;
  height: 120px;
`;

const ChartContainer = styled.div`
  height: 100%;
  position: relative;
`;

const getSpecificDayListTrends = trends => {
  if (!trends) {
    return trends;
  }

  const taskListTrendsSpecificDays = [];

  range(0, 7).forEach(dayIndex => {
    const dateValue = moment()
      .subtract(dayIndex, 'days')
      .format('YYYY-MM-DDT00:00:00.000+0000');

    const exisitingElt = find(propEq('date', dateValue), trends);
    if (!exisitingElt) {
      taskListTrendsSpecificDays.push({ date: dateValue, metricValue: 0 });
    } else {
      taskListTrendsSpecificDays.push(exisitingElt);
    }
  });

  return taskListTrendsSpecificDays;
};

const getChartDataFromTrends = trends => {
  const specificDaysListTrends = getSpecificDayListTrends(trends);
  const slicedTrendsArray = specificDaysListTrends?.slice(0, 7) ?? [];
  const labels = map(prop('date'), slicedTrendsArray);
  const data = map(prop('metricValue'), slicedTrendsArray);

  return { data, labels };
};

export default ({ taskListTrends, currentTab }) => {
  const chartReference = useRef(null);
  const [chart, setChart] = useState(null);
  const [tabName, setTabName] = useState(null);

  useEffect(() => {
    if (chart && currentTab !== tabName) {
      const { data, labels } = getChartDataFromTrends(taskListTrends);
      chart.data.labels = labels;
      chart.data.datasets[0].data = data;
      chart.update();
      setTabName(currentTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab]);

  useEffect(
    () => {
      if (chartReference.current && !chart && currentTab !== tabName) {
        const { data, labels } = getChartDataFromTrends(taskListTrends);
        setTabName(currentTab);

        setChart(
          new Chart(chartReference.current, {
            options: {
              legend: false,
              maintainAspectRatio: false,
              scales: {
                xAxes: [
                  {
                    gridLines: false,
                    ticks: {
                      precision: 0,
                      padding: 8,
                      fontFamily: '"Roboto", sans-serif',
                    },
                    type: 'time',
                    time: {
                      unit: 'day',
                      displayFormats: {
                        day: 'MMM D',
                      },
                    },
                    distribution: 'series',
                  },
                ],
                yAxes: [
                  {
                    gridLines: false,
                    position: 'left',
                    ticks: {
                      fontFamily: '"Open Sans", sans-serif',
                      maxTicksLimit: 4,
                      padding: 8,
                      precision: 0,
                      suggestedMin: 0,
                    },
                    scaleLabel: {
                      display: true,
                      fontColor: '#ababb2',
                      fontFamily: '"Open Sans", sans-serif',
                      labelString: 'New Tasks',
                    },
                    type: 'linear',
                  },
                ],
              },
            },
            type: 'line',
            data: {
              labels,
              datasets: [
                {
                  label: 'Tasks',
                  data,
                  backgroundColor: 'rgba(0, 124, 171, 0.2)',
                  borderColor: 'rgba(0, 124, 171)',
                  pointBorderColor: 'transparent',
                  pointBackgroundColor: 'transparent',
                  pointHoverBorderColor: '#007cab',
                  pointHoverBackgroundColor: '#007cab',
                },
              ],
            },
          }),
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chartReference.current],
  );

  return (
    <ChartOuterContainer>
      <ChartContainer>
        <canvas ref={chartReference} />
      </ChartContainer>
    </ChartOuterContainer>
  );
};
