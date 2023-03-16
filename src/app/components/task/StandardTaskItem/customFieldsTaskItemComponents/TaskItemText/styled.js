/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import palette from 'styles/palette';

export const TextContainer = styled.div`
  width: 100%;
  overflow: hidden;
  cursor: text;
  padding: 0 2px;
  border-color: transparent;
  ${props =>
    props.shouldHover
      ? `  &:hover {
    border-radius: 2px;
    border-width: 1px;
    border-style: solid;
    border-color: ${palette.coolGrey2};
  }`
      : ''}
`;
