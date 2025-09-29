import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';

const END_PADDING = 65;
const START_PADDING = 55;

export const SearchInputWrapper = styled.div`
  // position: relative;
  // width: 100%;
  // font-family: 'Outfit', sans-serif;

  display: flex;
  align-items: center;
  padding: 8px;
  flex-basis: ${({ wide, isPatientSearchInput }) =>
    isPatientSearchInput ? (wide ? 780 : 190) : wide ? 580 : 106}px;
  // flex-direction: row;
  transition: flex-basis 0.25s ease-out;
  border: 1px solid ${palette.zinc};
  color: ${palette.coolGrey1};
  height: 32px;
  border-radius: 4px;
  @media print {
    display: none;
  }
  background: ${palette.white};
`;

export const StyledInput = styled.input`
  // width: 100%;
  // padding: ${spacing.regular} ${END_PADDING}px ${spacing.regular}
  //   ${START_PADDING}px;
  // border: 1px solid ${palette.coolGrey3};
  // background: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%),
  //   #ffffff;
  // font-size: ${fontSizes.regular};
  // font-weight: ${fontWeights.regularPlus};
  // color: ${palette.mediumGrey};

  // &:focus {
  //   outline: none;
  // }

  // &::placeholder {
  //   color: ${palette.coolGrey2};
  // }

  flex: 1;
  // padding: 2px 0;
  color: ${palette.mediumGrey};
  outline: none;
  border: none;
  font-family: Roboto;
  font-weight: 400;
  line-height: 18.75px;
  font-size: ${fontSizes.regular};
  // width: 80px;
  height: 19px;
  background: transparent;

  &::placeholder {
    color: ${palette.coolGrey2};
    // text-transform: uppercase;
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
