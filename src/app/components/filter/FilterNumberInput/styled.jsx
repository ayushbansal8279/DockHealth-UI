import styled from 'styled-components';
import palette from 'styles/palette';
import { fontSizes } from 'styles/font';

export const NumberInput = styled.input`
  display: block;
  width: 100%;
  padding: 0 6px;
  border-width: 1px;
  border-style: solid;
  border-color: ${(props) =>
    props.hasError ? palette.red : palette.coolGrey2};
  border-radius: 2px;
  overflow: auto;
  color: ${palette.coolGrey2};
  font-size: ${fontSizes.small};
  height: 25px;

  ${({ value }) => value && `color: ${palette.mediumGrey};`}

  ${({ hasError }) => hasError && `color: ${palette.red};`}

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type='number'] {
    -moz-appearance: textfield;
  }
`;

