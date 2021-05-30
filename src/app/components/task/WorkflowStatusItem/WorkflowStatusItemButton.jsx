import Spacing from 'components/common/Spacing';
import Tooltip from 'components/common/Tooltip/Tooltip';
import React, { useRef } from 'react';
import {
  StatusFlag,
  StatusItemWrapper,
  StatusName,
  StatusButton,
} from './styled';

const WorkflowStatusItemButton = ({
  selected,
  status,
  colorBorder,
  onStatusClick,
}) => {
  const nameReference = useRef(null);
  const { name, color } = status || {};

  const tooltipVisible =
    nameReference.current &&
    nameReference.current.offsetWidth < nameReference.current.scrollWidth;

  return (
    <StatusButton selected={selected} onClick={onStatusClick}>
      <StatusItemWrapper>
        <StatusFlag border={colorBorder} color={color} />
        <Spacing horizontal={3} />
        <Tooltip title={name} placement="top" hideTooltip={!tooltipVisible}>
          <StatusName ref={nameReference}>{name}</StatusName>
        </Tooltip>
      </StatusItemWrapper>
    </StatusButton>
  );
};

export default WorkflowStatusItemButton;
