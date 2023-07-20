import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const AddTaskInputWrapper = styled.div`
  position: relative;
  height: auto;
  padding: ${spacing.small} ${spacing.huge} ${spacing.none} ${spacing.huge};
  border: 1px solid
    ${(props) => (props.hasError ? palette.red : palette.coolGrey3)};
  font-size: ${fontSizes.smallPlus};
  background-color: ${palette.white};
  text-align: left;
  color: ${palette.mediumGrey};

  &:before {
    margin-top: -2px;
    position: absolute;
    top: 50%;
    left: ${spacing.regularPlus};
    display: block;
    content: '+';
    transform: translateY(-50%);
    color: ${(props) => props.iconColor || palette.orange};
    font-size: ${fontSizes.regular};
  }

  @media print {
    display: none;
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
