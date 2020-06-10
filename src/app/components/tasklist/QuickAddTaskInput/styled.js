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
    border-color: ${palette.coolGrey3};
    font-size: 1em;

    &:focus {
      box-shadow: none;
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
    font-size: 1em;
  }
`;

export default {
  AddTaskInputWrapper,
};
