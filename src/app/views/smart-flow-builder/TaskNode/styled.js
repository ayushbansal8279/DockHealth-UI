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
  // margin: 4px 0 5px 10px;
  align-items: center;
  width: 38px;
  height: 28px;
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
  padding: 5px 10px 1px;
  width: 100%;
  height: 100%;
  text-align: center;
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

export const TaskDescriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  margin: 5px;
  padding: 0px 5px 0px 18px;
`;

export const TaskDescription = styled.p`
  font-family: inherit;
  font-weight: ${fontWeights.bold};
  font-size: 16px;
  color: #555;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* Limit to 2 lines */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-word;
`;

export const TaskDescriptionInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  margin: 5px;
  padding: 0px 17px;
`;

export const TaskDescriptionInput = styled.input`
  width: 100%;
  border: none;
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
