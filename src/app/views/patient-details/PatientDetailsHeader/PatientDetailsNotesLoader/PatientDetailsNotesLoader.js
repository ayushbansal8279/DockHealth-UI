/* eslint-disable react/no-array-index-key */
import Spacing from 'components/common/Spacing';
import React from 'react';
import { LoaderText, LoaderContainer } from './styled';

const PatientDetailsNotesLoader = () => (
  <LoaderContainer>
    <LoaderText />
    <Spacing vertical={4} />
    {new Array(3).fill().map((_, index) => (
      <div key={index}>
        <LoaderText width={547} />
        <Spacing vertical={2} />
        <LoaderText width={237} />
        <Spacing vertical={4} />
      </div>
    ))}
    <Spacing vertical={4} />
    <LoaderText />
  </LoaderContainer>
);

export default PatientDetailsNotesLoader;
