import React from 'react';

import { StartIndicatorNodeWrapper } from './styled';
import TaskNodeHandles from '../TaskNodeHandles/TaskNodeHandles';

const IndicatorNode = React.memo((props) => {
  const { id, data } = props;

  return (
    <TaskNodeHandles
      isConnectable
      isConnecting={data.draggedEdgeSourceId}
      onTargetHandleHover={data.onTargetHandleHover}
      draggedEdgeSourceId={data?.draggedEdgeSourceId}
    >
      <StartIndicatorNodeWrapper>
        {id === 'START_INDICATOR' && 'Start'}
        {id === 'END_INDICATOR' && 'End'}
      </StartIndicatorNodeWrapper>
    </TaskNodeHandles>
  );
});

export default IndicatorNode;
