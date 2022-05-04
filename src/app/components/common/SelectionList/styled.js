/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import palette from 'styles/palette';

export const ListWrapper = styled.div`
  height: 100%;
  width: 100%;
  border: 1px solid ${palette.coolGrey2};
  overflow-y: auto;
  overflow-x: hidden;
`;
