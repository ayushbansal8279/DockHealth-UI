import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';

export const ButtonsContainer = styled.div`
  display: none;

  & > button {
    color: ${palette.white};
  }
`;

export const EdgeLabel = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin: 0 auto;
  height: 100%;
  width: 120px;
  max-width: 100%;
  padding: 0 10px;
  background: ${({ hasOutcome }) =>
    hasOutcome ? palette.brightBlue : palette.coolGrey2};
  color: ${({ hasOutcome }) =>
    hasOutcome ? palette.white : palette.mediumGrey};
  border-radius: 999px;
  transition: width 0.2s linear;

  ${({ hasOutcome }) =>
    hasOutcome &&
    `
    &:hover {
      width: 100%;

      & > ${ButtonsContainer} {
        display: flex;
      }
    } 
  `}
`;

export const OutcomeInput = styled.input`
  display: block;
  flex: 1;
  border: none;
  color: inherit;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.regular};
  background: transparent;
  outline: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:read-only {
    background: transparent;
    color: inherit;
    cursor: initial;
  }

  &::placeholder {
    color: ${palette.coolGrey1};
  }
`;
