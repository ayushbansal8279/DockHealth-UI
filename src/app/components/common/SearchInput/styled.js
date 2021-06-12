import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';

const END_PADDING = 65;
const START_PADDING = 55;

export const SearchInputWrapper = styled.div`
  position: relative;
  width: 100%;
  font-family: 'Montserrat', sans-serif;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: ${spacing.regular} ${END_PADDING}px ${spacing.regular}
    ${START_PADDING}px;
  border: none;
  background: none;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regularPlus};
  color: ${palette.mediumGrey};

  &:focus {
    outline: none;
    background: ${palette.white};
  }

  &::placeholder {
    color: ${palette.coolGrey2};
    text-transform: uppercase;
  }
`;

export const InputIconWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${START_PADDING}px;
  height: 100%;
`;

export const ClearButtonWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${END_PADDING}px;
  height: 100%;
`;

export const ClearButton = styled.button`
  font-size: ${fontSizes.smallPlus};
  color: ${palette.brightBlue};
  cursor: pointer;

  &:active {
    outline: none;
  }
`;
