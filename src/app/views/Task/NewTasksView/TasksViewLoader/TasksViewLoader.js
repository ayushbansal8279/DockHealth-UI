import React from 'react';
import Loader from 'components/common/Loader/Loader';
import { FadeContainer, StyledFade } from './styled';

const TasksViewLoader = ({ children, isFetchingData }) =>
  isFetchingData ? (
    <FadeContainer>
      <StyledFade in unmountOnExit>
        <Loader size={40} />
      </StyledFade>
    </FadeContainer>
  ) : (
    children
  );

export default TasksViewLoader;
