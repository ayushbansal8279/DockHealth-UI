import styled from 'styled-components';
import palette, { typography } from 'styles/palette';

export const NewTaskWrapper = styled.div`
  width: 100%;
  margin: 5px;
  padding: 0px 18px;

  & button {
    transition: opacity 0.3s linear;
  }

  &:hover button {
    opacity: 1;
  }
`;

export const NewTaskInput = styled.input`
  font-family: inherit;
  font-size: 16px;
  border: none;
  outline: none;
  color: ${palette.mediumGrey};
  background: transparent;

  &:placeholder {
    color: ${palette.coolGrey2};
  }
`;
