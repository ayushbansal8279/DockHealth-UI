/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import palette from 'styles/palette';

export const TextContainer = styled.div`
  width: 100%;
  overflow: hidden;
  cursor: text;
  padding: 0 2px;
  border-radius: 4px;
  border-width: 1px;
  border-style: solid;
  border-color: ${({ withBorder }) =>
    withBorder ? palette.coolGrey2 : 'transparent'};
`;
