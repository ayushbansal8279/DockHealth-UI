/* eslint-disable react/no-array-index-key */
import Spacing from 'components/common/Spacing';
import React from 'react';
import {
  Container,
  LoaderElement,
  LoaderFillElement,
  LoaderRow,
} from './styled';

const SubtasksSkeletonLoader = ({ rows }) => {
  return (
    <Container>
      {new Array(rows).fill().map((row, rowIndex) => (
        <LoaderRow key={rowIndex}>
          <LoaderFillElement />
          <Spacing horizontal={5} />
          <LoaderElement width={134} />
          <Spacing horizontal={4} />
          <LoaderElement width={134} />
        </LoaderRow>
      ))}
    </Container>
  );
};

export default SubtasksSkeletonLoader;
