import React from 'react';
import { AvatarLoader, TextLoader } from './styled';

const PersonInfoLoader = () => (
  <>
    <AvatarLoader />
    {new Array(4).fill().map(() => (
      <TextLoader />
    ))}
  </>
);

export default PersonInfoLoader;
