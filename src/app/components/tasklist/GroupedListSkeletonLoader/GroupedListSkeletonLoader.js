/* eslint-disable no-shadow */
/* eslint-disable react/no-array-index-key */
import Spacing from 'components/common/Spacing';
import React from 'react';
import TasksSkeletonLoader from 'components/task/TasksSkeletonLoader/TasksSkeletonLoader';
import { Container, LoaderElement, LoaderGroup } from './styled';

const GroupedListSkeletonLoader = ({ numberOfGroups = 2 }) => {
  return (
    <Container>
      {new Array(numberOfGroups).fill().map((_, index) => (
        <LoaderGroup key={index}>
          <LoaderElement width={108} />
          <Spacing vertical={4} />
          <TasksSkeletonLoader
            rows={index === numberOfGroups - 1 && numberOfGroups !== 1 ? 3 : 5}
          />
        </LoaderGroup>
      ))}
    </Container>
  );
};

export default GroupedListSkeletonLoader;
