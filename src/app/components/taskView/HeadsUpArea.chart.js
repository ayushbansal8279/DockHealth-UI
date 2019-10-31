import Chart from 'chart.js';
import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

const ChartOuterContainer = styled.div`
  flex: 1;
  overflow: hidden;
  padding: 5px;
`;

const ChartContainer = styled.div`
  height: 100%;
  position: relative;
`;

export default () => {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);

  useEffect(
    () => {
      if (chartRef.current && !chart) {
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
              labels: ['1', '2', '3', '4', '5'],
              datasets: [
                {
                  label: 'Test',
                  data: [7, 6, 5, 8, 2],
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
