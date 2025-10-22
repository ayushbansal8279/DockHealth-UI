import { BaseEdge, getBezierPath } from '@xyflow/react';
import React from 'react';

const ConnectionLineComponent = ({
  fromX,
  fromY,
  toX,
  toY,
  connectionLineStyle,
}) => {
  const [edgePath] = getBezierPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
  });

  return (
    <>
      <g>
        <BaseEdge
          path={edgePath}
          markerEnd="url(#arrowhead)"
          style={{
            stroke: undefined,
            strokeWidth: 2,
            strokeDasharray: 10,
            strokeDashoffset: 10,
            animation: 'dashmove 0.5s linear infinite',
          }}
        />
      </g>
    </>
  );
};

export default ConnectionLineComponent;
