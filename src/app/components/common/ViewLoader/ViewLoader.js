import React from 'react';
import Loader from 'components/common/Loader/Loader';
import { FadeContainer, StyledFade } from './styled';

const ViewLoader = ({ children, isFetchingData, padding }) =>
  isFetchingData ? (
    <FadeContainer padding={padding}>
      <StyledFade in unmountOnExit>
        <Loader />
      </StyledFade>
    </FadeContainer>
  ) : (
    children
  );

export default ViewLoader;
