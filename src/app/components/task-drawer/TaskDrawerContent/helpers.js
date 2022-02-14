/* eslint-disable import/prefer-default-export */
import React from 'react';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

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
