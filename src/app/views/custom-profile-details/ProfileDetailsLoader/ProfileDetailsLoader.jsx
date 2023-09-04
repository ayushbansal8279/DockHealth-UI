/* eslint-disable react/no-array-index-key */
import Spacing from 'components/common/Spacing';
import React from 'react';
import { LoaderText, LoaderRow } from './styled';

const ProfileDetailsLoader = () => (
  <>
    <LoaderText width={288} />
    <Spacing vertical={3} />
    <LoaderRow>
      {new Array(4).fill().map((_, index) => (
        <LoaderText key={index} />
      ))}
    </LoaderRow>
  </>
);

export default ProfileDetailsLoader;
