/* eslint-disable react/no-array-index-key */
import React from 'react';
import { LoaderContainer, LoaderRow, LoaderCell } from './styled';

const PatientListLoader = () => (
  <LoaderContainer>
    {new Array(15).fill().map((row, rowIndex) => (
      <LoaderRow key={rowIndex}>
        {new Array(6).fill().map((cell, cellIndex) => (
          <LoaderCell key={cellIndex} />
        ))}
      </LoaderRow>
    ))}
  </LoaderContainer>
);

export default PatientListLoader;
