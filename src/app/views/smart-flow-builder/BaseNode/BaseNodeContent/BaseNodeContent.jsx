import React from 'react';
import { NodeContentWrapper } from '../styled';
const BaseNodeContent = (props) => {
  const { content } = props;
  return (
    <>
      <NodeContentWrapper>{content}</NodeContentWrapper>
    </>
  );
};

export default BaseNodeContent;
