import React from 'react';
import Spacing from 'components/common/Spacing';
import { SkeletonLoaderTextRow, SkeletonLoaderText } from './styled';

const PatientCardDetailsLoader = () => (
  <>
    <SkeletonLoaderTextRow width={162}>
      <SkeletonLoaderText />
    </SkeletonLoaderTextRow>
    <Spacing vertical={3} />
    <SkeletonLoaderTextRow width={334}>
      <SkeletonLoaderText />
      <Spacing horizontal={3} />
      <SkeletonLoaderText />
    </SkeletonLoaderTextRow>
    <Spacing vertical={2} />
    <SkeletonLoaderTextRow width={334}>
      <SkeletonLoaderText />
    </SkeletonLoaderTextRow>
    <Spacing vertical={2} />
    <SkeletonLoaderTextRow width={334}>
      <SkeletonLoaderText />
      <Spacing horizontal={3} />
      <SkeletonLoaderText />
    </SkeletonLoaderTextRow>
  </>
);

export default PatientCardDetailsLoader;
