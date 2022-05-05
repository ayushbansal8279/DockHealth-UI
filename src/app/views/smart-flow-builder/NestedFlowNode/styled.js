/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import palette from 'styles/palette';

export const NestedFlowNodeStyled = styled.div`
  width: 100%;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${palette.brightBlue};
  color: ${palette.white};
`;
