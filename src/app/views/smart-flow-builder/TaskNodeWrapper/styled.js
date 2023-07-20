import { NodeType, TASK_NODE_WIDTH } from 'helpers/smart-flow-builder-helpers';
import styled from 'styled-components';
import palette from 'styles/palette';

export const TaskNodeContainer = styled.div`
  position: relative;
  width: ${({ width }) => (width ? `${width}px` : `${TASK_NODE_WIDTH}px`)};
  height: auto;
  background-color: ${palette.white};
  box-shadow: 0px 0px 11px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  ${({ type }) =>
    [NodeType.DECISION, NodeType.NEW_DECISION].includes(type) &&
    `
  border: 2px solid ${palette.brightBlue};
  `}

  ${({ selected }) => selected && `background-color: #ddedf8;`}
  overflow: hidden;
`;

export const TaskNodeEllipsis = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    0deg,
    rgba(0, 162, 229, 1) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
`;
