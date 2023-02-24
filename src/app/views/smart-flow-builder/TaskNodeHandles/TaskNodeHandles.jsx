import React from 'react';
import { Box } from '@mui/material';
import { useBoolean } from 'hooks/useBoolean';
import { Handle, Position } from 'react-flow-renderer';
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
  const { children, isConnectable, isConnecting, onTargetHandleHover } = props;
  const [isHovered, setHovered, unsetHovered] = useBoolean(false);

  const nodeHandleSize = isHovered ? 14 : 0;

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

  const iconStyles = {
    pointerEvents: 'none',
    color: 'white',
    width: '12px',
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
            gridColumnStart: 2,
            gridColumnEnd: 4,
            gridRow: 1,
          }}
          isConnectable={isConnectable}
          onMouseEnter={() => onTargetHandleHover(Position.Top)}
        />
        <Handle
          id={NodeTargetHandle.TARGET_B}
          type="target"
          position={Position.Bottom}
          style={{
            ...targetHandleStyles,
            gridColumnStart: 2,
            gridColumnEnd: 4,
            gridRow: 2,
          }}
          isConnectable={isConnectable}
          onMouseEnter={() => onTargetHandleHover(Position.Bottom)}
        />
        <Handle
          id={NodeTargetHandle.TARGET_C}
          type="target"
          position={Position.Left}
          style={{
            ...targetHandleStyles,
            gridColumn: 1,
            gridRowStart: 1,
            gridRowEnd: 3,
          }}
          isConnectable={isConnectable}
          onMouseEnter={() => onTargetHandleHover(Position.Left)}
        />
        <Handle
          id={NodeTargetHandle.TARGET_D}
          type="target"
          position={Position.Right}
          style={{
            ...targetHandleStyles,
            gridColumn: 4,
            gridRowStart: 1,
            gridRowEnd: 3,
          }}
          isConnectable={isConnectable}
          onMouseEnter={() => onTargetHandleHover(Position.Right)}
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
