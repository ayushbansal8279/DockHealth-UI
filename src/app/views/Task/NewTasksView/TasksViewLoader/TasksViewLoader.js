import React from 'react';
import { Fade } from '@material-ui/core';
import CubesLoader from 'components/common/CubesLoader';
import { FadeContainer } from './styled';

const TasksViewLoader = ({ children, isFetchingData }) => (
  <>
    {isFetchingData ? (
      <FadeContainer>
        <Fade
          in
          unmountOnExit
          style={{
            transitionDelay: '800ms',
          }}
        >
          <CubesLoader size={40} />
        </Fade>
      </FadeContainer>
    ) : (
      children
    )}
  </>
);

export default TasksViewLoader;
