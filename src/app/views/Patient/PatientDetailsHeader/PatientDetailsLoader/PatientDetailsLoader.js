import Spacing from 'components/common/Spacing';
import React from 'react';
import { LoaderText, LoaderRow } from './styled';

const PatientDetailsLoader = () => (
  <>
    <LoaderText width={288} />
    <Spacing vertical={3} />
    <LoaderRow>
      {new Array(4).fill().map(() => (
        <LoaderText />
      ))}
    </LoaderRow>
  </>
);

export default PatientDetailsLoader;
