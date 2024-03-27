import Spacing from 'components/common/Spacing';
import Tooltip from 'components/common/Tooltip/Tooltip';
import React, { useRef } from 'react';
import { StatusButton, StatusWrapper } from './styled';

const WorkflowStatusItemButton = ({
  selected,
  status,
  onStatusClick,
  width,
}) => {
  const nameReference = useRef(null);
  const { name, color } = status || {};

  const tooltipVisible =
    nameReference.current &&
    nameReference.current.offsetWidth < nameReference.current.scrollWidth;

  return (
    <StatusButton
      width={width * 3 + 120}
      selected={selected}
      onClick={onStatusClick}
    >
      <StatusWrapper color={color}>
        <div ref={nameReference}>{name}</div>
      </StatusWrapper>
    </StatusButton>
  );
};

export default WorkflowStatusItemButton;
