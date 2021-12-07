/* eslint-disable react/no-array-index-key */
import React from 'react';
import { bool, number } from 'prop-types';
import { LoaderRow, LoaderRowContainer } from './styled';

const ListSkeletonLoader = ({ header, rows }) => (
  <>
    {header && <LoaderRow height={29} />}
    {new Array(rows).fill().map((_, index) => (
      <LoaderRowContainer key={index}>
        <LoaderRow />
      </LoaderRowContainer>
    ))}
  </>
);

ListSkeletonLoader.propTypes = {
  rows: number,
  header: bool,
};

ListSkeletonLoader.defaultProps = {
  rows: 16,
  header: false,
};

export default ListSkeletonLoader;
