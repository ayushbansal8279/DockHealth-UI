import styled from 'styled-components';
import { fontSizes } from 'styles/font';
import palette from 'styles/palette';

// eslint-disable-next-line import/prefer-default-export
export const CustomFilterOptionWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 30px;
  background-color: ${({ selected, editModeEnabled }) => {
    if (editModeEnabled && selected) return '#4577A4';
    return selected ? palette.darkBlue : palette.blueGrey;
  }};
  color: ${({ selected, disabled }) => {
    if (selected) {
      return palette.white;
    }
    if (disabled) {
      return palette.coolGrey2;
    }

    return palette.black;
  }};
  border-radius: 4px;
  font-size: ${fontSizes.small};
  padding-left: 8px;
  overflow: hidden;
  justify-content: space-between;

  & .MuiSvgIcon-root {
    color: ${({ selected }) => (selected ? palette.white : palette.black)};
    ${({ selected, disabled }) =>
      !selected &&
      !disabled &&
      `&:hover {
      background-color: ${palette.coolGrey2};
      color: white;}`};
  }

  & .MuiFilledInput-root {
    background-color: transparent !important;
  }

  & .MuiFilledInput-input {
    padding: 0;
    color: ${({ selected }) => (selected ? palette.white : palette.black)};

    font-size: ${fontSizes.small};
    &.Mui-disabled {
      cursor: initial;
    }
  }

  &:not(:last-of-type) {
    margin-bottom: 4px;
  }

  ${props =>
    !props.disabled &&
    `
      cursor: pointer;
    `}

  ${({ selected, disabled }) =>
    !selected &&
    !disabled &&
    `&:hover {
      background-color: ${palette.coolGrey2};
      color: white;}`};

  ${({ color }) => color && `border-left: 8px solid ${color};`}
`;
