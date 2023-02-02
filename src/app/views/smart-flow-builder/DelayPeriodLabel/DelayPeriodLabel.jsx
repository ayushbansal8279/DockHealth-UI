import React from 'react';
import { TIME_REFERENCE } from '../TaskLinkDelayForm/helpers';
import { Label } from './styled';

const DelayPeriodLabel = (props) => {
  const { link, onClick } = props;
  const { delayPeriod, delayPeriodUnit, timeRelative, timeReference } = link;
  const fixedWidth = timeRelative != null;
  return (
    <Label fixedWidth={fixedWidth} onClick={onClick}>
      {delayPeriod} {delayPeriodUnit.toLowerCase()}
      {delayPeriod > 1 ? 's' : ''} {timeRelative?.toLowerCase()}{' '}
      {TIME_REFERENCE[timeReference]?.toLowerCase()}
    </Label>
  );
};

export default DelayPeriodLabel;
