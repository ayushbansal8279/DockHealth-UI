import styled from 'styled-components';
import { fontWeights } from 'styles/font';
import palette, { typography } from 'styles/palette';
import spacing from 'styles/spacing';

export const ReminderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin-top: ${spacing.large};
  margin-bottom: ${spacing.tiny};
  transition: opacity 0.4s ease-out;
  font-family: ${typography.text};
`;

export const Description = styled.p`
  display: inline-block;
  margin-bottom: 0;
  opacity: ${({ isDisabled }) => (isDisabled ? 0.4 : 1)};
`;

export const ReminderTypeSelectOption = styled.div`
  width: 100%;
  padding: ${spacing.smallPlus};
  text-align: left;
  font-family: ${typography.text};
  color: ${palette.coolGrey1};
  background-color: ${({ isActive }) =>
    isActive ? palette.coolGrey4 : 'transparent'};
  font-weight: ${({ isActive }) =>
    isActive ? fontWeights.bold : fontWeights.light};
`;

export const SelectArrowImg = styled.img`
  height: 7px;
  cursor: pointer;
  pointer-events: none;
`;
