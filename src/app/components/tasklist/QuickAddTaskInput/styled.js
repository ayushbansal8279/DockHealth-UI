import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const AddTaskInputWrapper = styled.div`
  position: relative;
  margin-bottom: ${spacing.small};
  font-size: ${fontSizes.smallPlus};

  & > input {
    height: auto;
    padding: ${spacing.regular} ${spacing.huge};
    margin-bottom: 0;
    border-color: ${props =>
      props.hasError ? palette.red : palette.coolGrey3};
    font-size: ${fontSizes.regular};

    &:focus {
      box-shadow: none;
      border-color: ${props => props.hasError && palette.red};
    }
  }

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

export const ErrorLabel = styled.div`
  color: ${palette.red};
  font-size: ${fontSizes.smallPlus};
`;

export default {
  AddTaskInputWrapper,
};
