import Chart from 'chart.js';
import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import moment from 'moment';
import { isWithinInterval } from 'date-fns/fp';

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

export default ({taskListTrends, currentTab}) => {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);
  const [tabName, setTabName] = useState(null);

  const getSpecificDayListTrends = (taskListTrends) => {
    if(!taskListTrends){
      return taskListTrends
    }
    var taskListTrendsSpecificDays = []
    var dayIndex = 0
    while(dayIndex < 7){
      var dateVal = moment().subtract(dayIndex, 'days').format('YYYY-MM-DDT00:00:00.000+0000')
      var exisitingElt = _.find(taskListTrends, {date: dateVal})
      if(!exisitingElt) {
        taskListTrendsSpecificDays.push({date: dateVal, metricValue: 0});
      }else{
        taskListTrendsSpecificDays.push(exisitingElt);
      }
      dayIndex++
    }
    return taskListTrendsSpecificDays
  };

  if (chart && currentTab!=tabName) {
    var specificDaysListTrends = getSpecificDayListTrends(taskListTrends)
    var slicedTrendsArray = (specificDaysListTrends?specificDaysListTrends.slice(0,7):[])
    var labels = _.map(slicedTrendsArray, "date") 
    var data = _.map(slicedTrendsArray, "metricValue")
    chart.data.labels = labels
    chart.data.datasets[0].data = data
    chart.update()
    setTabName(currentTab)
  }

  useEffect(
    () => {
      if (chartRef.current && !chart && currentTab!=tabName) {
        var specificDaysListTrends = getSpecificDayListTrends(taskListTrends)
        var slicedTrendsArray = (specificDaysListTrends?specificDaysListTrends.slice(0,7):[])
        var labels = _.map(slicedTrendsArray, "date") 
        var data = _.map(slicedTrendsArray, "metricValue")
        setTabName(currentTab)
        setChart(
          new Chart(chartRef.current, {
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
                      fontFamily: '"Open Sans", sans-serif',
                    },
                    type: 'time',
                    time: {
                        unit: 'day',
                        displayFormats: {
                          day: 'MMM D'
                        }
                    },
                    distribution: 'series'
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
              labels: labels,
              datasets: [
                {
                  label: 'Tasks',
                  data: data,
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
    [chartRef.current],
  );

  useEffect(
    () => {
      console.log(chart);
    },
    [chart],
  );

  return (
    <ChartOuterContainer>
      <ChartContainer>
        <canvas ref={chartRef} />
      </ChartContainer>
    </ChartOuterContainer>
  );
};
