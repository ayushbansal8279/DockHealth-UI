import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette, { typography } from 'styles/palette';

export const LabelsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: fit-content;
  margin: 0 auto;
`;

export const EdgeLabel = styled.div`
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
`;

export const OutcomeInput = styled.input`
  display: block;
  flex: 1;
  border: none;
  color: inherit;
  font-family: ${typography.text};
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.regular};
  background: transparent;
  outline: none;
  overflow: hidden;

  &:read-only {
    background: transparent;
    color: inherit;
    cursor: initial;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &::placeholder {
    color: ${palette.coolGrey1};
  }
`;
