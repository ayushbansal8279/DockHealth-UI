/* eslint-disable react/no-array-index-key */
import Spacing from 'components/common/Spacing';
import React from 'react';
import {
  Container,
  LoaderElement,
  LoaderFillElement,
  LoaderGroup,
  LoaderRow,
} from './styled';

const DashboardSkeletonLoader = () => {
  return (
    <Container>
      {new Array(3).fill().map((group, groupIndex) => (
        <LoaderGroup key={groupIndex}>
          <LoaderElement width={108} />
          <Spacing vertical={5} />
          {new Array(4).fill().map((row, rowIndex) => (
            <LoaderRow key={rowIndex}>
              <LoaderFillElement />
              <Spacing horizontal={5} />
              <LoaderElement width={134} />
              <Spacing horizontal={4} />
              <LoaderElement width={134} />
            </LoaderRow>
          ))}
        </LoaderGroup>
      ))}
    </Container>
  );
};

export default DashboardSkeletonLoader;
