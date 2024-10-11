import React, { useRef } from 'react';
import { StatusButton, StatusLabel, StatusTooltip, StatusWrapper } from './styled';

const WorkflowStatusItemButton = ({ selected, status, onStatusClick }) => {
  const nameReference = useRef(null);
  const { name, color } = status || {};

  const isTextTruncated = (element) => {
    if (!element) return false;
    const { scrollWidth, clientWidth } = element;
    return scrollWidth > clientWidth;
  };

  return (
    <StatusButton width={140} selected={selected} onClick={onStatusClick}>
        <StatusWrapper color={color}>
          <StatusLabel
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            ref={nameReference}
          >
            {name}
          </StatusLabel>
          {isTextTruncated(nameReference.current) && (
            <StatusTooltip>
              {name}
            </StatusTooltip>
          )}
        </StatusWrapper>
    </StatusButton>
  );
};

export default WorkflowStatusItemButton;
