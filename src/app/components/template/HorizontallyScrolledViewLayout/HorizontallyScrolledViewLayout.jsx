import React from 'react';
import VerticalScrollContainer from 'components/common/HorizontalScroll/HorizontalScrollContainer';
import { Container } from './styled';

const HorizontallyScrolledViewLayout = React.memo((props) => {
  const { header, children, noOuterScroll } = props;
  return (
    <>
      {header}
      <VerticalScrollContainer noOuterScroll={noOuterScroll}>
        <Container>{children}</Container>
      </VerticalScrollContainer>
    </>
  );
});

export default HorizontallyScrolledViewLayout;
