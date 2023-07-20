import React from 'react';
import VerticalScrollContainer from 'components/common/HorizontalScroll/HorizontalScrollContainer';
import { Container } from './styled';

const HorizontallyScrolledViewLayout = (props) => {
  const { header, children } = props;
  return (
    <>
      {header}
      <VerticalScrollContainer>
        <Container>{children}</Container>
      </VerticalScrollContainer>
    </>
  );
};

export default HorizontallyScrolledViewLayout;
