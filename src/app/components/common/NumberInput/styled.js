import styled from 'styled-components';
import palette, { typography } from 'styles/palette';
import spacing from 'styles/spacing';

export const InputWrapper = styled.div`
  position: relative;
  width: fit-content;
`;

export const NumberInput = styled.input`
  width: 52px;
  height: 27px;
  margin: 0;
  padding: ${spacing.tiny} ${spacing.regular} ${spacing.tiny} ${spacing.small};
  background-color: ${palette.blueGrey};
  border-radius: 4px;
  border: none;
  box-shadow: none;
  font-family: inherit;
  color: ${palette.mediumGrey};
  text-align: center;

  &:focus,
  &:active {
    border: none;
    box-shadow: none;
    background-color: ${palette.blueGrey};
  }

  -webkit-appearance: textfield;
  -moz-appearance: textfield;
  appearance: textfield;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
`;

export const ArrowsWrapper = styled.div`
  position: absolute;
  right: 8px;
  top: 50%;
  height: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transform: translate(50%, -50%);
`;

export const UpArrow = styled.button`
  display: block;
  border-bottom: 6px solid ${palette.mediumGrey};
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: none;
`;

export const DownArrow = styled(UpArrow)`
  transform: rotate(-180deg);
`;
