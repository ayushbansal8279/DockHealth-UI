import styled from 'styled-components';
import palette, { typography } from 'styles/palette';

export const NewTaskWrapper = styled.div`
  width: 100%;
  padding: 12px 0 12px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;

  & button {
    transition: opacity 0.3s linear;
  }

  &:hover button {
    opacity: 1;
  }
`;

export const NewTaskInput = styled.input`
  padding: 15px 0;
  font-family: inherit;
  border: none;
  outline: none;
  color: ${palette.mediumGrey};
  background: transparent;

  &:placeholder {
    color: ${palette.coolGrey2};
  }
`;
