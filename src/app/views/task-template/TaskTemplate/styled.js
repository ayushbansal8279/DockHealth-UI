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
  display: grid;
  grid-template-columns: auto auto 1fr auto auto auto;
  grid-template-rows: 30px auto;
  grid-column-gap: ${spacing.tiny};
  align-items: center;
  width: 100%;
  padding: 2px ${spacing.smallPlus};
  border: 1px solid ${palette.coolGrey3};
  background-color: ${palette.white};
  font-family: 'Roboto', sans-serif;
  font-size: ${fontSizes.smallPlus};
  animation: ${({ highlighted }) =>
    highlighted ? LightenedTaskContainer : 'none'};
  animation-duration: 3.5s;
  animation-timing-function: ease-in-out;
`;

export const ArrowButton = styled.button`
  grid-column: 2;
  grid-row: 1;
`;

export const NameInput = styled.input`
  grid-row: 1;
  grid-column: 3;
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

export const Description = styled.p`
  grid-column: 3;
  grid-row: 2;
  margin-bottom: 0;
  color: ${palette.coolGrey1};
  font-size: ${fontSizes.regular};
`;

export const MenuContainer = styled.div`
  grid-column: 5;
  grid-row: 1;
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

export const SmartFlowButton = styled.button`
  grid-column: 2;
  grid-row: 1;
`;

export const SmartFlowIndicatorIcon = styled.img`
  cursor: default;
`;

export const CheckboxPlaceholder = styled.div`
  grid-column: 1;
  grid-row: 1;
  width: 16px;
`;

export const Spacer = styled.div`
  grid-column: 4;
  grid-row: 1;
`;
