import styled from 'styled-components';
import { fontWeights, fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const StyledInitialsInput = styled.input`
  display: block;
  height: ${({ size }) => size || 60}px;
  width: ${({ size }) => size || 60}px;
  outline: none;
  border: none;
  text-transform: uppercase;
  font-family: inherit;
  font-weight: ${fontWeights.bold};
  font-size: ${fontSizes.regular};
  box-sizing: border-box;
  background: ${({ backgroundColor }) => backgroundColor || palette.coolGrey4};
  color: ${({ backgroundColor }) =>
    backgroundColor ? palette.white : palette.mediumGrey};
  text-align: center;

  &::placeholder {
    color: ${palette.coolGrey2};
  }
`;
