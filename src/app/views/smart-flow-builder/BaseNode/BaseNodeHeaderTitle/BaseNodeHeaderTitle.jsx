import React from 'react';
import { NodeTitle } from '../../Nodes/styled';
const BaseNodeHeaderTitle = (props) => {
  const { headerTitle } = props;

  return <NodeTitle>{headerTitle}</NodeTitle>;
};

export default BaseNodeHeaderTitle;
