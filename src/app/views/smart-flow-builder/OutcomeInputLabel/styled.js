import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette, { typography } from 'styles/palette';

export const EdgeLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 0 auto;
  max-width: 200px;
  min-width: 100px;
  padding: 10px;
  background: ${({ hasOutcome }) =>
    hasOutcome ? palette.brightBlue : palette.coolGrey2};
  color: ${({ hasOutcome }) =>
    hasOutcome ? palette.white : palette.mediumGrey};
  border-radius: 8px;
  font-family: inherit;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.regular};
  user-select: none;
`;

export const EdgeLabelText = styled.span`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  white-space: normal;
  word-break: break-word;
  line-height: 1.2;
  max-height: calc(1.2em * 2);
`;

export const EdgeLabelEditor = styled.input`
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  width: 250px;
  outline: none;
  background-color: inherit;

  &:focus {
    border-color: ${palette.coolGrey1};
    background-color: #fff;
  }
`;

export const OutcomeInput = styled.input`
  display: block;
  // flex: 1;
  border: none;
  color: inherit;
  background: transparent;
  outline: none;
  overflow: hidden;
  width: ${({ isEditorActive }) => (isEditorActive ? '300px' : '0px')};
  // transition: width 250ms cubic-bezier(0.65, 0, 0.35, 1);
  text-align: center;
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
