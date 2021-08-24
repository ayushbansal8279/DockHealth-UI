/* eslint-disable import/prefer-default-export */
import { NodeType } from 'helpers/task-template-builder-helpers';
import styled from 'styled-components';
import palette from 'styles/palette';

export const TaskNodeContainer = styled.div`
  position: relative;
  width: 230px;
  height: auto;
  background-color: ${palette.white};
  box-shadow: 0px 0px 11px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  ${({ type }) =>
    [NodeType.DECISION, NodeType.NEW_DECISION].includes(type) &&
    `
  border: 2px solid ${palette.brightBlue};
  `}

  ${({ selected }) => selected && `background-color: ${palette.coolGrey4};`}
`;
