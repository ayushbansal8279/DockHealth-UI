import React from 'react';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import moment from 'moment';
import { CompletedByLabel } from './styled';

export const getCompletedByLabel = (completedBy, completedDt) => {
  const completedByName =
    `${completedBy?.firstName.charAt(0)}. ${completedBy?.lastName}`
      .trim()
      .replace(/^\.$/, '') || 'Unknown';

  return (
    <CompletedByLabel>{`Completed by ${completedByName} ${completedDt &&
      ` on ${
        completedDt ? `on ${moment(completedDt).format('MM/DD/YYYY')}` : ''
      }`}
  `}</CompletedByLabel>
  );
};

export const renderPartsWithHighlighting = (optionValue, inputValue) => {
  const matches = match(optionValue, inputValue);
  const parts = parse(optionValue, matches);
  return (
    <>
      {parts.map(part => (
        <span
          key={`${optionValue}_${part}`}
          style={{ fontWeight: part.highlight ? 700 : 400 }}
        >
          {part.text}
        </span>
      ))}
    </>
  );
};
