/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import palette from 'styles/palette';

export const NewTaskWrapper = styled.div`
  width: 100%;
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  & button {
    transition: opacity 0.3s linear;
    opacity 0;
  }

  &:hover button {
    opacity: 1;
  }
`;

export const NewTaskInput = styled.input`
  padding: 15px 0;
  font-family: 'Roboto Condensed', sans-serif;
  border: none;
  outline: none;
  color: ${palette.mediumGrey};
  background: transparent;

  &:placeholder {
    color: ${palette.coolGrey2};
  }
`;
