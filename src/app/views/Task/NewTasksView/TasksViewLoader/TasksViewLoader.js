import React from 'react';
import CubesLoader from 'components/common/CubesLoader';
import { FadeContainer, StyledFade } from './styled';

const TasksViewLoader = ({ children, isFetchingData }) =>
  isFetchingData ? (
    <FadeContainer>
      <StyledFade in unmountOnExit>
        <CubesLoader size={40} />
      </StyledFade>
    </FadeContainer>
  ) : (
    children
  );

export default TasksViewLoader;
