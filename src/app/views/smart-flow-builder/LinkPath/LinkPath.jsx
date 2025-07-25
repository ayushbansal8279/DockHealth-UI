import React from 'react';
import { BaseEdge, getSmoothStepPath, Position } from 'reactflow';
import palette from 'styles/palette';
import './AnimatedEdge.css';

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
    markerEnd,
    onClick,
  } = props;
  let sourcePos = sourcePosition;
  let targetPos = targetPosition;

  // temporary bugfix related to wbkd/react-flow/issues/1403
  // if (sourcePosition === Position.Left && targetPosition === Position.Right) {
  //   sourcePos = targetPosition;
  //   targetPos = sourcePosition;
  // }

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition: sourcePos,
    targetX,
    targetY,
    targetPosition: targetPos,
  });
  // const markerEnd = getMarkerEnd('arrowclosed', markerEndId);

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={{
        stroke: selected ? palette.brightBlue : undefined,
        strokeWidth: 4,
        fill: 'none',
        ...(selected
          ? {}
          : {
              strokeDasharray: 10,
              strokeDashoffset: 10,
              animation: 'dashmove 0.5s linear infinite',
            }),
      }}
      markerEnd={markerEnd}
      onClick={onClick}
    />
  );
};

export default LinkPath;
