import React from 'react';
import { NodeFooterWrapper } from '../styled';
const BaseNodeFooter = (props) => {
  const { footerContent } = props;
  return (
    <>
      <NodeFooterWrapper>{footerContent}</NodeFooterWrapper>
    </>
  );
};

export default BaseNodeFooter;
