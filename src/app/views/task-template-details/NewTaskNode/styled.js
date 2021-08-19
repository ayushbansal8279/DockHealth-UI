/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import palette from 'styles/palette';

export const NewTaskInput = styled.input`
  padding: 15px;
  font-family: 'Roboto Condensed', sans-serif;
  border: none;
  outline: none;
  color: ${palette.mediumGrey};
  background: transparent;

  &:placeholder {
    color: ${palette.coolGrey2};
  }
`;
