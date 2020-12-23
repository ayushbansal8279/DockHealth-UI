import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const AddTaskInputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: auto;
  margin-bottom: ${spacing.small};
  padding: ${spacing.small} ${spacing.huge};
  border: 1px solid
    ${props => (props.hasError ? palette.red : palette.coolGrey3)};
  font-size: ${fontSizes.smallPlus};
  background-color: ${palette.white};
  box-shadow: inset 0 1px 2px rgba(46, 58, 67, 0.1);
  text-align: left;

  &:before {
    position: absolute;
    top: 50%;
    left: ${spacing.regularPlus};
    display: block;
    content: '+';
    transform: translateY(-50%);
    color: ${palette.orange};
    font-size: ${fontSizes.regular};
  }

  &:focus-within:before {
    visibility: hidden;
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
  margin-bottom: ${spacing.small};
  color: ${palette.red};
  font-size: ${fontSizes.smallPlus};
`;
