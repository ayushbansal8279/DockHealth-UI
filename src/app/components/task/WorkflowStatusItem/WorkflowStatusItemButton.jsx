import React, { useRef } from 'react';
import { StatusButton, StatusWrapper } from './styled';

const WorkflowStatusItemButton = ({ selected, status, onStatusClick }) => {
  const nameReference = useRef(null);
  const { name, color } = status || {};

  return (
    <StatusButton width={140} selected={selected} onClick={onStatusClick}>
      <StatusWrapper color={color}>
        <div
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          ref={nameReference}
        >
          {name}
        </div>
      </StatusWrapper>
    </StatusButton>
  );
};

export default WorkflowStatusItemButton;
