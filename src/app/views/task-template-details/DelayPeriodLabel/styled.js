/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import palette from 'styles/palette';

export const Label = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
  height: 30px;
  margin-right: -10px;
  padding-right: 26px;
  padding-left: 16px;
  border-radius: 15px;
  background-color: ${palette.brightBlue};
  color: ${palette.white};
`;
