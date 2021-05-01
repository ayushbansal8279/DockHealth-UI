/* eslint-disable react/no-array-index-key */
import Spacing from 'components/common/Spacing';
import React from 'react';
import {
  LoaderElement,
  LoaderFillElement,
  LoaderRow,
  CircleLoaderElement,
} from './styled';

const TasksSkeletonLoader = ({ rows = 1 }) => {
  return (
    <>
      {new Array(rows).fill().map((_, rowIndex) => (
        <LoaderRow key={rowIndex}>
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
      ))}
    </>
  );
};

export default TasksSkeletonLoader;
