import styled from 'styled-components';
import palette from 'styles/palette';
import {
  NodeType,
  TASK_NODE_WIDTH,
} from '@/app/helpers/smart-flow-builder-helpers';

export const OptionsContainer = styled.div`
  opacity: 0;
  transition: opacity 0.3s linear;
  position: absolute;
  top: 0px;
  right: -50px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 9999;
`;

export const BaseNodeWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: ${({ width }) => (width ? `${width}px` : `${TASK_NODE_WIDTH}px`)};
  height: 200px;
  background-color: ${palette.white};
  box-shadow: 0px 0px 11px rgba(0, 0, 0, 0.15);
  overflow: visible;
  border: 3px solid ${palette.brightBlue};
  border-radius: 14px;
  ${({ type }) =>
    [
      NodeType.NEW_WORKFLOW_LINK,
      NodeType.NEW_STANDARD,
      NodeType.NEW_DECISION,
      NodeType.NEW_AUTOMATION,
    ].includes(type) && `border: 3px solid ${palette.coolGrey3};`}

  ${({ selected }) => selected && `background-color: #ddedf8;`}

  &:hover {
    ${OptionsContainer} {
      opacity: 1;
    }
  }
`;

export const GrowButton = styled.div`
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.3s ease, transform 0.3s ease;
  transition-delay: ${({ index }) => index * 0.18}s;

  ${BaseNodeWrapper}:hover & {
    opacity: 1;
    transform: scale(1);
  }
`;

export const NodeHeaderWrapper = styled.div`
  width: 100%;
  height: 25%;
  padding: 0 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${palette.coolGrey3};
`;

export const NodeFooterWrapper = styled.div`
  width: 100%;
  height: 25%;
  padding: 0 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid ${palette.coolGrey3};
`;

export const NodeContentWrapper = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
