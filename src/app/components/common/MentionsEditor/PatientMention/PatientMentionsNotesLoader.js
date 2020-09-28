import React from 'react';
import Spacing from 'components/common/Spacing';
import {
  PatientNotesSection,
  Divider,
  NoteDivider,
  SkeletonLoaderTextRow,
  SkeletonLoaderText,
} from './styled';

const PatientMentionsNotesLoader = () => (
  <>
    <Divider />
    <PatientNotesSection>
      {new Array(2).fill().map(() => (
        <>
          <SkeletonLoaderTextRow width={162}>
            <SkeletonLoaderText />
          </SkeletonLoaderTextRow>
          <Spacing vertical={3} />
          <SkeletonLoaderTextRow width={334}>
            <SkeletonLoaderText />
          </SkeletonLoaderTextRow>
          <Spacing vertical={2} />
          <SkeletonLoaderTextRow width={334}>
            <SkeletonLoaderText />
          </SkeletonLoaderTextRow>
          <Spacing vertical={2} />
          <SkeletonLoaderTextRow width={334}>
            <SkeletonLoaderText />
          </SkeletonLoaderTextRow>
          <Spacing vertical={4} />
          <NoteDivider />
          <Spacing vertical={3} />
        </>
      ))}
      <SkeletonLoaderTextRow width={162}>
        <SkeletonLoaderText />
      </SkeletonLoaderTextRow>
      <Spacing vertical={3} />
      <SkeletonLoaderTextRow width={334}>
        <SkeletonLoaderText />
      </SkeletonLoaderTextRow>
      <Spacing vertical={2} />
      <SkeletonLoaderTextRow width={334}>
        <SkeletonLoaderText />
      </SkeletonLoaderTextRow>
    </PatientNotesSection>
  </>
);

export default PatientMentionsNotesLoader;
