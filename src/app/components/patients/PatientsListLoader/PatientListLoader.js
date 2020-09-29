import React from 'react';
import { LoaderContainer, LoaderRow, LoaderCell } from './styled';

const PatientListLoader = () => (
  <LoaderContainer>
    {new Array(15).fill().map(() => (
      <LoaderRow>
        {new Array(6).fill().map(() => (
          <LoaderCell />
        ))}
      </LoaderRow>
    ))}
  </LoaderContainer>
);

export default PatientListLoader;
