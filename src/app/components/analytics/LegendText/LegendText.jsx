import React from 'react';
import palette from 'styles/palette';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { trunc } from 'helpers/utility-functions';

const LegendText = props => {
  const { color, value, metricValue } = props;
  return (
    <span style={{ color: color || palette.mediumGrey }}>
      {value.length > 20 ? (
        <Tooltip title={`${value} (${metricValue})`}>
          <span>{`${trunc(value, 20)} (${metricValue})`}</span>
        </Tooltip>
      ) : (
        `${value} (${metricValue})`
      )}
    </span>
  );
};

export default LegendText;
