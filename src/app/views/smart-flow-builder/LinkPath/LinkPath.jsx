import React from 'react';
import { getSmoothStepPath, getMarkerEnd, Position } from 'react-flow-renderer';
import palette from 'styles/palette';

const LinkPath = (props) => {
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
    onClick,
  } = props;
  let sourcePos = sourcePosition;
  let targetPos = targetPosition;

  // temporary bugfix related to wbkd/react-flow/issues/1403
  if (sourcePosition === Position.Left && targetPosition === Position.Right) {
    sourcePos = targetPosition;
    targetPos = sourcePosition;
  }

  const edgePath = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition: sourcePos,
    targetX,
    targetY,
    targetPosition: targetPos,
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
      onClick={onClick}
    />
  );
};

export default LinkPath;
