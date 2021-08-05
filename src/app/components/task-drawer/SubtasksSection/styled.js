import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const Container = styled.div`
  padding: 42px ${spacing.huge};
  border-top: 1px solid ${palette.coolGrey2};
`;

export const Title = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regularPlus};
`;

export const AddSubtaskInputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: auto;
  margin-bottom: ${spacing.small};
  padding: 6px ${spacing.huge} 6px ${spacing.regular};
  font-size: ${fontSizes.smallPlus};
  background-color: ${palette.white};
  text-align: left;
  border: 1px solid transparent;

  &:before {
    position: absolute;
    top: 50%;
    left: 0;
    display: block;
    content: '+';
    transform: translateY(-50%);
    color: ${palette.brightBlue};
    font-size: ${fontSizes.regular};
  }

  &:focus-within {
    border: 1px solid
      ${props => (props.hasError ? palette.red : palette.coolGrey3)};

    &:before {
      visibility: hidden;
    }
  }

  &:after {
    position: absolute;
    top: 50%;
    left: ${spacing.regular};
    content: 'ADD A SUBTASK';
    display: block;
    transform: translateY(-50%);
    color: ${palette.coolGrey1};
    font-family: 'Montserrat', sans-serif;
    font-weight: ${fontWeights.bold};
    font-size: ${fontSizes.smallPlus};
    text-transform: uppercase;
    pointer-events: none;
  }

  ${({ hidePlaceholder }) =>
    hidePlaceholder &&
    `
      &:after {
        visibility: hidden;
  `}

  &:focus-within {
    &:after {
      visibility: hidden;
    }
  }
`;

export const QuickAddHint = styled.p`
  margin-bottom: 0;
  color: ${palette.coolGrey1};
  font-size: ${fontSizes.smallPlus};
  white-space: nowrap;
`;

export const MentionsEditorContainer = styled.div`
  flex: 1;
  overflow: hidden;
`;

export const ErrorLabel = styled.div`
  color: ${palette.red};
  font-size: ${fontSizes.smallPlus};
`;
