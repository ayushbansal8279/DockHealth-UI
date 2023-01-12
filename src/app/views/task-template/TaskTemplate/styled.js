import styled, { keyframes } from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

const LightenedTaskContainer = keyframes`
0% { background-color: ${palette.brightBlueWithAlpha}; }
100% { background-color: ${palette.white}; }
`;

export const TaskTemplateContainer = styled.div`
  width: 100%;
  margin-bottom: ${spacing.smallPlus};
  text-align: left;
`;

export const TaskTemplateHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding-left: ${spacing.smallPlus};
  border: 1px solid ${palette.coolGrey3};
  background-color: ${palette.white};
  font-family: 'Roboto Condensed', sans-serif;
  font-size: ${fontSizes.smallPlus};
  animation: ${({ highlighted }) =>
    highlighted ? LightenedTaskContainer : 'none'};
  animation-duration: 3.5s;
  animation-timing-function: ease-in-out;
`;

export const ArrowButton = styled.button``;

export const NameInput = styled.input`
  flex: 1;
  margin-bottom: 0;
  padding: ${spacing.small};
  color: ${({ error }) => (error ? palette.error : palette.mediumGrey)};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  background-color: transparent;
  border: 1px solid
    ${({ error }) => (error ? palette.error : palette.coolGrey2)};
  border-radius: 5px;
  background: ${palette.coolGrey4};
  font-weight: ${fontWeights.regular};

  &[readonly] {
    background-color: transparent;
    cursor: initial;
    outline: none;
    border: none;
  }

  &:focus {
    outline: none;
  }
`;

export const MenuContainer = styled.div`
  padding: 0 ${spacing.small};
  overflow: hidden;
  color: ${palette.coolGrey2};
`;

export const QuickAddInputWrapper = styled.div`
  margin-top: -1px;
`;

export const ArrowButtonContainer = styled.div`
  display: flex;
  width: 26px;
  justify-content: center;
  margin-left: ${spacing.small};
`;

export const SmartFlowIndicatorContainer = styled.div`
  display: flex;
  width: 20px;
  justify-content: center;
  margin-left: ${spacing.small};
`;

export const SmartFlowButton = styled.button``;

export const SmartFlowIndicatorIcon = styled.img`
  cursor: default;
`;

export const CheckboxPlaceholder = styled.div`
  width: 16px;
`;

export const Spacer = styled.div``;
