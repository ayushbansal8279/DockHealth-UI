import React from 'react';
import { getSmoothStepPath, getMarkerEnd } from 'react-flow-renderer';
import palette from 'styles/palette';

const LinkPath = props => {
  const {
    id,
    selected,
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    markerEndId,
  } = props;
  const edgePath = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const markerEnd = getMarkerEnd('arrowclosed', markerEndId);

  return (
    <path
      id={id}
      style={{
        stroke: selected ? palette.brightBlue : undefined,
        strokeWidth: '3px',
      }}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={markerEnd}
    />
  );
};

export default LinkPath;
