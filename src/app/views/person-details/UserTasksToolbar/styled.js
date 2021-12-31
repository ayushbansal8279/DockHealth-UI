/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import palette from 'styles/palette';

export const ToolbarContainer = styled.div`
  display: block;
  background-color: ${palette.coolGrey4};
  color: ${palette.coolGrey1};
  width: calc(100vw - 83px);
  position: sticky;
  left: 0px;
  display: flex;
  justify-content: flex-end;
  padding: 18px 24px;
`;
