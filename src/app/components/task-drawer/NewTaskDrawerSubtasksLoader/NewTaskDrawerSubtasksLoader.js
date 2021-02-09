/* eslint-disable react/no-array-index-key */
import Spacing from 'components/common/Spacing';
import React from 'react';
import {
  LoaderElement,
  LoaderFillElement,
  LoaderRow,
  CircleLoaderElement,
} from './styled';

const NewTaskDrawerSubtasksLoader = ({ rows }) => {
  return (
    <div>
      <Spacing vertical={2} />
      {new Array(rows).fill().map((row, rowIndex) => (
        <LoaderRow key={rowIndex}>
          <LoaderFillElement />
          <Spacing horizontal={5} />
          <CircleLoaderElement />
          <Spacing horizontal={5} />
          <LoaderElement width={19} />
        </LoaderRow>
      ))}
    </div>
  );
};

export default NewTaskDrawerSubtasksLoader;
