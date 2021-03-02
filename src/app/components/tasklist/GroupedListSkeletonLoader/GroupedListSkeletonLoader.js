/* eslint-disable no-shadow */
/* eslint-disable react/no-array-index-key */
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

const GroupedListSkeletonLoader = ({ numberOfGroups = 2 }) => {
  return (
    <Container>
      {new Array(numberOfGroups).fill().map((_, index) => (
        <LoaderGroup key={index}>
          <LoaderElement width={108} />
          <Spacing vertical={4} />
          {new Array(
            index === numberOfGroups - 1 && numberOfGroups !== 1 ? 3 : 5,
          )
            .fill()
            .map((_, index) => renderLoaderRow(index))}
        </LoaderGroup>
      ))}
    </Container>
  );
};

export default GroupedListSkeletonLoader;
