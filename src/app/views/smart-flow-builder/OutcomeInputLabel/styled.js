import { lighten } from '@mui/material';
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

export const TextAreaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fff;
  overflow: hidden;
`;

export const EdgeLabelEditor = styled.textarea`
  border: none;
  border: 15px solid #ccc
  padding: 8px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  font-size: 14px;
  line-height: 1.4;
  min-height: 80px;
  max-height: 150px;
  overflow-y: auto;
  outline: none;
  resize: none;
  background-color: inherit;
`;

export const Footer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 4px 8px;
  background: ${palette.coolGrey3};
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  border-bottom: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
`;

export const SendButton = styled.button`
  background: #007bff;
  width: 32px;
  height: 32px;
  border: none;
  color: white;
  align-items: center;
  padding: 8px 9px;
  border-radius: 999px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
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
