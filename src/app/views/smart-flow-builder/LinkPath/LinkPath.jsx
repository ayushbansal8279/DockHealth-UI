import React from 'react';
import {
  BaseEdge,
  getSmoothStepPath,
  Position,
  useReactFlow,
} from '@xyflow/react';
import palette from 'styles/palette';
import './AnimatedEdge.css';
import { getEdgeParams } from './helpers';

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
    source,
    target,
  } = props;
  const { getNodes } = useReactFlow();
  const nodes = getNodes();
  const sourceNode = nodes.find((n) => n.id === source);
  const targetNode = nodes.find((n) => n.id === target);
  if (!sourceNode || !targetNode) return null;
  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode,
  );

  // let sourcePos = sourcePosition;
  // let targetPos = targetPosition;

  // temporary bugfix related to wbkd/react-flow/issues/1403
  // if (sourcePosition === Position.Left && targetPosition === Position.Right) {
  //   sourcePos = targetPosition;
  //   targetPos = sourcePosition;
  // }

  const [edgePath] = getSmoothStepPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetX: tx,
    targetY: ty,
    targetPosition: targetPos,
  });
  // const markerEnd = getMarkerEnd('arrowclosed', markerEndId);

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={{
        stroke: selected ? palette.brightBlue : undefined,
        strokeWidth: 2,
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
