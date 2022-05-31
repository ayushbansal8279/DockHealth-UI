/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import palette from 'styles/palette';

export const Label = styled.div`
  align-items: center;

  width: ${({ fixedWidth }) => (fixedWidth ? '160px' : 'fit-content')};
  height: fit-content;
  padding-right: 10px;
  padding-left: 10px;
  border-radius: 15px;
  background-color: ${palette.brightBlue};
  color: ${palette.white};
`;
