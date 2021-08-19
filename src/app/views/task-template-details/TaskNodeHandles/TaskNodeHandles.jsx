import React from 'react';
import { Box } from '@material-ui/core';
import useBoolean from 'hooks/useBoolean';
import { Handle } from 'react-flow-renderer';
import palette from 'styles/palette';
import {
  NodeSourceHandle,
  NodeTargetHandle,
} from 'helpers/task-template-builder-helpers';
import { AddIcon } from './styled';

function validateConnection({ source, target, sourceHandle, targetHandle }) {
  console.log('connection', sourceHandle, targetHandle);
  if (source === target) return false;

  return true;
}

const TaskNodeHandles = ({ children, targetVisible, isConnectable }) => {
  const [isHovered, setHovered, unsetHovered] = useBoolean(false);

  const nodeHandleSize = isHovered ? 14 : 0;

  const targetHandleStyles = {
    width: '100%',
    height: '100%',
    top: 0,
    visibility: targetVisible ? 'visible' : 'hidden',
    borderRadius: 0,
    border: 'none',
    background: 'transparent',
    zIndex: 1,
  };

  const sourceHandleStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: nodeHandleSize,
    width: nodeHandleSize,
    borderRadius: nodeHandleSize / 2,
    backgroundColor: palette.brightBlue,
    visibility: isHovered ? 'visible' : 'hidden',
  };

  return (
    <Box
      position="relative"
      onMouseEnter={setHovered}
      onMouseLeave={unsetHovered}
    >
      <Handle
        id={NodeTargetHandle.TARGET_A}
        type="target"
        position="top"
        style={{ left: '50%', ...targetHandleStyles }}
        isConnectable={isConnectable}
      />
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
        <AddIcon />
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
        <AddIcon />
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
        <AddIcon />
      </Handle>
    </Box>
  );
};

export default TaskNodeHandles;
