import React from 'react';
import moment from 'moment';
import { CompletedByLabel } from './styled';

export const getCompletedByLabel = (completedBy, completedDt) => {
  const completedByName =
    `${completedBy?.firstName.charAt(0)}. ${completedBy?.lastName}${
      completedBy?.credentials ? `, ${completedBy?.credentials}` : ''
    }`
      .trim()
      .replace(/^\.$/, '') || 'Unknown';

  return (
    <CompletedByLabel>{`Completed by ${completedByName} ${
      completedDt &&
      ` on ${
        completedDt ? `on ${moment(completedDt).format('MM/DD/YYYY')}` : ''
      }`
    }
  `}</CompletedByLabel>
  );
};
