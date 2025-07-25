import React, { useCallback, useState } from 'react';
import { Box } from '@mui/material';
import { useBoolean } from 'hooks/useBoolean';
import { Handle, Position, useNodeId, useReactFlow } from 'reactflow';
import palette from 'styles/palette';
import {
  NodeSourceHandle,
  NodeTargetHandle,
} from 'helpers/smart-flow-builder-helpers';
import { AddIcon, targetHandleStyles, TargetHandlesWrapper } from './styled';

function validateConnection({ source, target }) {
  return source !== target;
}
const TaskNodeHandles = (props) => {
  const {
    children,
    isConnectable,
    isConnecting,
    onTargetHandleHover,
    draggedEdgeSourceId,
  } = props;
  const [isHovered, setHovered, unsetHovered] = useBoolean(false);
  const [isHoveredOnTargetHandle, setIsHoveredOnTargetHandle] = useState(false);
  const [isValidHandle, setIsValidHandle] = useState(true);
  const [hoveredTargetHandleName, setHoveredTargetHandleName] = useState(null);
  const currentNodeId = useNodeId();
  const { getEdges } = useReactFlow();
  const edges = getEdges();
  const nodeHandleSize = isHovered ? 14 : 0;

  const sourceHandleStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: nodeHandleSize,
    width: nodeHandleSize,
    borderRadius: nodeHandleSize / 2,
    backgroundColor: palette.brightBlue,
    visibility: isHovered && !isConnecting ? 'visible' : 'hidden',
  };

  const iconStyles = {
    pointerEvents: 'none',
    color: 'white',
    width: '12px',
  };

  const validateTargetHandle = useCallback(
    (event) => {
      const { source, target } = event;

      if (
        source === target ||
        (source === 'START_INDICATOR' && target === 'END_INDICATOR') ||
        source === 'END_INDICATOR' ||
        target === 'START_INDICATOR'
      ) {
        return false;
      }
      const edgeExists = edges?.some((edge) => {
        return (
          (edge.source === source && edge.target === target) ||
          (edge.source === target && edge.target === source)
        );
      });
      return !edgeExists;
    },
    [edges],
  );

  const handleMouseEnter = useCallback(
    (handleId) => {
      setIsHoveredOnTargetHandle(true);
      setHoveredTargetHandleName(handleId);
      const isValid = validateTargetHandle({
        source: draggedEdgeSourceId,
        target: currentNodeId,
      });
      setIsValidHandle(isValid);
    },
    [validateTargetHandle, currentNodeId, draggedEdgeSourceId],
  );

  const handleMouseLeave = () => {
    setIsHoveredOnTargetHandle(false);
    setIsValidHandle(true);
    setHoveredTargetHandleName(null);
  };

  return (
    <Box
      position="relative"
      onMouseEnter={setHovered}
      onMouseLeave={unsetHovered}
    >
      <TargetHandlesWrapper visible={isConnecting}>
        <Handle
          id={NodeTargetHandle.TARGET_A}
          type="target"
          position={Position.Top}
          style={{
            ...targetHandleStyles,
            top: isConnecting ? 0 : 5,
            left: '50%',
            background:
              isHoveredOnTargetHandle &&
              hoveredTargetHandleName === NodeTargetHandle.TARGET_A
                ? isValidHandle
                  ? palette.parrotGreen
                  : palette.red
                : palette.white,
          }}
          isConnectable={isConnectable}
          onMouseEnter={() => {
            onTargetHandleHover(Position.Top);
            handleMouseEnter(NodeTargetHandle.TARGET_A);
          }}
          onMouseLeave={handleMouseLeave}
        />
        <Handle
          id={NodeTargetHandle.TARGET_B}
          type="target"
          position={Position.Bottom}
          style={{
            ...targetHandleStyles,
            bottom: isConnecting ? -12 : -7,
            left: '50%',
            background:
              isHoveredOnTargetHandle &&
              hoveredTargetHandleName === NodeTargetHandle.TARGET_B
                ? isValidHandle
                  ? palette.parrotGreen
                  : palette.red
                : palette.white,
          }}
          isConnectable={isConnectable}
          onMouseEnter={() => {
            onTargetHandleHover(Position.Bottom);
            handleMouseEnter(NodeTargetHandle.TARGET_B);
          }}
          onMouseLeave={handleMouseLeave}
        />
        <Handle
          id={NodeTargetHandle.TARGET_C}
          type="target"
          position={Position.Left}
          style={{
            ...targetHandleStyles,
            left: isConnecting ? 0 : 5,
            top: '50%',
            background:
              isHoveredOnTargetHandle &&
              hoveredTargetHandleName === NodeTargetHandle.TARGET_C
                ? isValidHandle
                  ? palette.parrotGreen
                  : palette.red
                : palette.white,
          }}
          isConnectable={isConnectable}
          onMouseEnter={() => {
            onTargetHandleHover(Position.Left);
            handleMouseEnter(NodeTargetHandle.TARGET_C);
          }}
          onMouseLeave={handleMouseLeave}
        />
        <Handle
          id={NodeTargetHandle.TARGET_D}
          type="target"
          position={Position.Right}
          style={{
            ...targetHandleStyles,
            right: isConnecting ? -12 : -7,
            top: '50%',
            background:
              isHoveredOnTargetHandle &&
              hoveredTargetHandleName === NodeTargetHandle.TARGET_D
                ? isValidHandle
                  ? palette.parrotGreen
                  : palette.red
                : palette.white,
          }}
          isConnectable={isConnectable}
          onMouseEnter={() => {
            onTargetHandleHover(Position.Right);
            handleMouseEnter(NodeTargetHandle.TARGET_D);
          }}
          onMouseLeave={handleMouseLeave}
        />
      </TargetHandlesWrapper>
      {children}
      <Handle
        id={NodeSourceHandle.SOURCE_A}
        type="source"
        position="bottom"
        style={{
          left: '50%',
          bottom: -nodeHandleSize / 2,
          ...sourceHandleStyles,
        }}
        isValidConnection={validateConnection}
        isConnectable={isConnectable}
      >
        <AddIcon style={iconStyles} />
      </Handle>
      <Handle
        id={NodeSourceHandle.SOURCE_B}
        type="source"
        position="left"
        style={{
          top: '50%',
          left: -nodeHandleSize / 2,
          ...sourceHandleStyles,
        }}
        isValidConnection={validateConnection}
        isConnectable={isConnectable}
      >
        <AddIcon style={iconStyles} />
      </Handle>
      <Handle
        id={NodeSourceHandle.SOURCE_C}
        type="source"
        position="right"
        style={{
          top: '50%',
          right: -nodeHandleSize / 2,
          ...sourceHandleStyles,
        }}
        isValidConnection={validateConnection}
        isConnectable={isConnectable}
      >
        <AddIcon style={iconStyles} />
      </Handle>
    </Box>
  );
};

export default TaskNodeHandles;
