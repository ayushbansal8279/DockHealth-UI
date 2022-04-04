import React from 'react';
import { Label } from './styled';

const DelayPeriodLabel = props => {
  const { link, onClick } = props;
  const { delayPeriod, delayPeriodUnit } = link;
  return (
    <Label onClick={onClick}>
      {delayPeriod} {delayPeriodUnit.toLowerCase()}
      {delayPeriod > 1 ? 's' : ''}
    </Label>
  );
};

export default DelayPeriodLabel;
