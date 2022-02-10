import React, { useContext } from 'react';
import { Context } from 'components/common/HorizontalScroll/HorizontalScrollContainer';
import { StickyWrapper } from './styled';

const StickyContainer = ({ children, ...restProps }) => {
  const parentContainerWidth = useContext(Context);

  return (
    <StickyWrapper width={parentContainerWidth} {...restProps}>
      {children}
    </StickyWrapper>
  );
};

export default StickyContainer;
