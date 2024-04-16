import styled from 'styled-components';
import { fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  visibility: hidden;
`;

// eslint-disable-next-line import/prefer-default-export
export const CustomFilterOptionWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 150px;
  height: 30px;
  background-color: ${({ selected }) => {
    return selected ? '#E7EAFF' : palette.whiteSmoke;
  }};
  border-radius: 4px;
  font-size: ${fontSizes.small};
  padding-left: 8px;
  cursor: ${({ disabled }) => (disabled ? 'initial' : 'pointer')};

  & .MuiFilledInput-root {
    background-color: transparent !important;
  }
  & .MuiInputBase-input {
    cursor: pointer !important;
  }

  & .MuiFilledInput-input {
    padding: 0;
    color: ${({ selected }) =>
      selected ? palette.newBrightBlue : palette.coolGrey1};

    font-size: ${fontSizes.small};
    &.Mui-disabled {
      cursor: initial;
    }
  }

  &:not(:last-of-type) {
    margin-bottom: 4px;
  }

  ${(props) =>
    !props.disabled &&
    `
      cursor: pointer;
    `}

  ${({ selected, disabled }) =>
    !selected &&
    !disabled &&
    `&:hover {
      background-color: ${palette.whiteSmoke};
      color: white;}`};

  ${({ color }) => color && `border-left: 8px solid ${color};`}

  ${({ selected }) =>
    selected &&
    `& ${IconContainer} {
    visibility: visible;
  }`}



  &:hover {
    & ${IconContainer} {
      visibility: visible;
    }
  }
`;
