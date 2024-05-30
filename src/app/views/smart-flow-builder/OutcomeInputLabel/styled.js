import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette, { typography } from 'styles/palette';

export const EdgeLabel = styled.div`
  display: flex;
  // align-items: center;
  text-align: center;
  justify-content: center;
  flex-direction: inherit;
  margin: 0 auto;
  width: auto;
  max-width: 120px;
  padding: 10px;
  background: ${({ hasOutcome }) =>
    hasOutcome ? palette.brightBlue : palette.coolGrey2};
  color: ${({ hasOutcome }) =>
    hasOutcome ? palette.white : palette.mediumGrey};
  border-radius: 999px;
  transition: width 0.2s linear;
  font-family: inherit;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.regular};
  user-select: none;
  overflow: hidden;
  white-space: normal;
  word-wrap: break-word;
  line-height: 1.2;
`;

export const OutcomeInput = styled.input`
  display: block;
  flex: 1;
  border: none;
  color: inherit;
  background: transparent;
  outline: none;
  overflow: hidden;
  width: ${({ isEditorActive }) => (isEditorActive ? '200px' : `0`)};
  transition: width 250ms cubic-bezier(0.65, 0, 0.35, 1);

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
