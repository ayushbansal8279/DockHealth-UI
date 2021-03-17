/* eslint-disable react/no-array-index-key */
import React from 'react';
import { AlertLoader } from './styled';

const ActivityAlertsLoader = () =>
  new Array(4).fill().map((_, index) => <AlertLoader key={index} />);

export default ActivityAlertsLoader;
