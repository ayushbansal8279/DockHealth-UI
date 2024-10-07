import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette, { typography } from 'styles/palette';
import spacing from 'styles/spacing';
import { Popover } from '@mui/material';

export const ReminderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin-bottom: ${spacing.tiny};
  transition: opacity 0.4s ease-out;
  font-family: inherit;
  margin-left: 135px;
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
  font-family: inherit;
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

export const StyledPopover = styled(Popover)`
  .MuiPopover-paper {
    border: none;
    box-shadow: none;
    width: ${({ width }) => width};
    overflow: visible;
  }
`;

export const DateViewText = styled.div`
  font-family: Outfit;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.light};
`;
