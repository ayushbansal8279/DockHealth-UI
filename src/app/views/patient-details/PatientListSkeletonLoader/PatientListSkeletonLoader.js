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

const renderLoaderRow = index => (
  <LoaderRow key={index}>
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

const renderLoaderHeader = index => (
  <LoaderHeaderRow key={index}>
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
          {new Array(5).fill().map((_, index) => renderLoaderRow(index))}
        </>
      </LoaderGroup>
      <LoaderGroup>
        <>
          {renderLoaderHeader()}
          {new Array(3).fill().map((_, index) => renderLoaderRow(index))}
        </>
      </LoaderGroup>
    </Container>
  );
};

export default PatientListSkeletonLoader;
