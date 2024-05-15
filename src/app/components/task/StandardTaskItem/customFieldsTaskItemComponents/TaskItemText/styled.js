import styled from 'styled-components';
import palette, { typography } from 'styles/palette';
import { fontSizes } from 'styles/font';

export const TextContainer = styled.div`
  width: 100%;
  overflow: hidden;
  cursor: text;
  padding: 0 2px;
  border-color: transparent;
  ${(props) =>
    props.shouldHover
      ? `  &:hover {
    border-radius: 2px;
    border-width: 1px;
    border-style: solid;
    border-color: ${palette.coolGrey2};
  }`
      : ''}
`;

export const AddPlaceholder = styled.div`
  color: ${palette.lightGrey};
  opacity: 0;

  &:hover {
    color: ${palette.brightBlue};
  }
`;

export const TextValue = styled.div`
  font-family: inherit;
  width: 100%;
  &:hover {
    & ${AddPlaceholder} {
      opacity: 1;
    }
  }
`;
