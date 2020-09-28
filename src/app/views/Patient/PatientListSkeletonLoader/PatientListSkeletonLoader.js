import Spacing from 'components/common/Spacing';
import React from 'react';
import {
  CircleLoaderElement,
  Container,
  LoaderElement,
  LoaderFillElement,
  LoaderGroup,
  LoaderHeaderRow,
  LoaderRow,
  MembersSection,
} from './styled';

const renderLoaderRow = () => (
  <LoaderRow>
    <LoaderFillElement />
    <Spacing horizontal={4} />
    <LoaderElement width={134} />
    <Spacing horizontal={4} />
    <LoaderElement width={87} />
    <Spacing horizontal={4} />
    <LoaderElement width={191} />
    <Spacing horizontal={4} />
    <CircleLoaderElement />
  </LoaderRow>
);

const renderLoaderHeader = () => (
  <LoaderHeaderRow>
    <LoaderElement width={203} />
    <MembersSection>
      <CircleLoaderElement />
      <Spacing horizontal={4} />
      <CircleLoaderElement />
      <Spacing horizontal={4} />
      <CircleLoaderElement />
      <Spacing horizontal={4} />
      <CircleLoaderElement />
    </MembersSection>
  </LoaderHeaderRow>
);

const PatientListSkeletonLoader = () => {
  return (
    <Container>
      <LoaderGroup>
        <>
          {renderLoaderHeader()}
          {new Array(5).fill().map(() => renderLoaderRow())}
        </>
      </LoaderGroup>
      <LoaderGroup>
        <>
          {renderLoaderHeader()}
          {new Array(3).fill().map(() => renderLoaderRow())}
        </>
      </LoaderGroup>
    </Container>
  );
};

export default PatientListSkeletonLoader;
