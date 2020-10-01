import Spacing from 'components/common/Spacing';
import React from 'react';
import {
  CircleLoaderElement,
  Container,
  LoaderElement,
  LoaderFillElement,
  LoaderGroup,
  LoaderRow,
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

const ListSkeletonLoader = () => {
  return (
    <Container>
      <LoaderGroup>
        <LoaderElement width={108} />
        <Spacing vertical={4} />
        {new Array(5).fill().map((_, index) => renderLoaderRow(index))}
      </LoaderGroup>
      <LoaderGroup>
        <LoaderElement width={108} />
        <Spacing vertical={4} />
        {new Array(3).fill().map((_, index) => renderLoaderRow(index))}
      </LoaderGroup>
    </Container>
  );
};

export default ListSkeletonLoader;
