import {
  NodeType,
  TASK_NODE_WIDTH,
} from '@/app/helpers/smart-flow-builder-helpers';
import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette, { typography } from 'styles/palette';

export const DecisionTaskIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 4px 0 5px 10px;
  align-items: center;
  width: 40px;
  height: 30px;
  border-radius: 4px;
  color: ${palette.white};
  background-color: ${palette.brightBlue};
`;

export const OptionsContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  opacity: 0;
  transition: opacity 0.3s linear;
`;

export const TaskInfoWrapper = styled.div`
  padding: 5px 10px 12px;
  width: 100%;
  height: 100%;
`;

export const TaskDescription = styled.p`
  margin-bottom: 0;
  padding: 12px 0 12px 10px;
  font-family: inherit;
  font-weight: ${fontWeights.bold};
  font-size: 16px;
  width: 100%;
  color: ${palette.mediumGrey};
`;

export const TaskDescriptionInput = styled.input`
  width: 100%;
  border: none;
  padding: 12px 0 12px 10px;
  font-family: inherit;
  font-weight: ${fontWeights.regular};
  color: ${palette.mediumGrey};
  background: transparent;

  &[readonly] {
    background: transparent;
    cursor: inherit;
  }

  &:focus {
    outline: none;
  }
`;

export const ContentWrapper = styled.div`
  padding: 4px;

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

  ${ContentWrapper}:hover & {
    opacity: 1;
    transform: scale(1);
  }
`;

export const SubtasksLabel = styled.div`
  display: flex;
  align-items: center;
  padding: 0 10px;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.bold};
  color: ${palette.coolGrey1};
  background: ${palette.coolGrey4};
  border-radius: 9px;
`;
