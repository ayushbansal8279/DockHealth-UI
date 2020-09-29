import Spacing from 'components/common/Spacing';
import React from 'react';
import { LoaderText, LoaderContainer } from './styled';

const PatientDetailsNotesLoader = () => (
  <LoaderContainer>
    <LoaderText />
    <Spacing vertical={4} />
    {new Array(3).fill().map(() => (
      <>
        <LoaderText width={547} />
        <Spacing vertical={2} />
        <LoaderText width={237} />
        <Spacing vertical={4} />
      </>
    ))}
    <Spacing vertical={4} />
    <LoaderText />
  </LoaderContainer>
);

export default PatientDetailsNotesLoader;
