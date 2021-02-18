import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const ReminderSelectContainer = styled.div`
  position: relative;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regular};
  font-family: 'Roboto Condensed', sans-serif;
  color: ${palette.mediumGrey};
`;

export const ReminderSelectInput = styled.input`
  width: ${({ width }) => width}px;
  padding: ${spacing.tiny} ${spacing.largePlus} ${spacing.tiny} ${spacing.small};
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  border: none;
  box-shadow: none;
  border-radius: 4px;
  background-color: ${palette.blueGrey};

  &:focus,
  &:active {
    outline: none;
  }

  &[readonly] {
    background-color: ${palette.blueGrey};
    cursor: pointer;
  }
`;

export const ArrowImg = styled.img`
  position: absolute;
  top: 50%;
  right: ${spacing.small};
  transform: translateY(-45%);
  cursor: pointer;
  pointer-events: none;
`;
