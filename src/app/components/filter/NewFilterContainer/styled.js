import { keyframes } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import palette, { typography } from 'styles/palette';
import spacing from 'styles/spacing';
import { Typography, Button } from '@mui/material';
import { fontSizes, fontWeights } from 'styles/font';

export const Container = styled.div``;

export const aa = styled.div``;

export const FilterButtonWrapper = styled.div`
  display: flex;
  margin: 20px 0 5px 2px;
`;

export const BottomWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

export const AssigneHolder = styled.div`
  display: flex;
  border: 1px solid red;
  border-radius: 4px;
  padding: 15px 5px;
  align-items: center;
  &:active,
  &:focus {
    outline: none;
  }
`;

export const AssigneInput = styled.div`
  width: 100%;
  &:active,
  &:focus {
    outline: none;
  }
`;

export const AssigneItem = styled.div`
  margin-right: 15px;
  border-radius: 20px;
  width: 90px;
  color: #fff;
  padding: 8px 15px;
  background-color: blue;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const AssigneDropDown = styled.div`
  animation: {drop} 2s 1s ease-in;
  display: flex;
  flex-direction: column;
`;
export const AssigneDropDownItem = styled.div`
  padding: 10px 5px;
  tranition: 0.8s;

  &:hover {
    background-color: #cfcccc;
    tranition: 0.8s;
  }
`;

const dropDown = keyframes` 
from{
  opacity: 0;
  tranform: translateY(100px)
}
to{
  opacity: 1;
  tranform: translateY(0px)
}
`;

export const FilterButtonWrapper1 = styled(Button)`
  && {
    border-radius: 0;
    background-color: ${(props) =>
      props.active ? palette.newBrightBlue : palette.newDarkBlue};
    border-right: 1px solid ${palette.white};
    :hover {
      background-color: ${(props) =>
        props.active ? palette.cornFlowerBlue : palette.purpleNavy};
    }
  }
  & .MuiSvgIcon-root > path {
    fill: ${palette.white};
  }
  height: 32px;
`;

export const FilterButtonLabel = styled(Typography)`
  &&& {
    &.MuiTypography-root {
      // font-family: 'Outfit', sans-serif;
      color: ${palette.white};
      // font-weight: ${fontWeights.light};
      display: inline-block;
      margin-left: ${spacing.tiny};
      text-transform: none;
      font-family: Outfit;
      font-size: 14px;
      font-weight: 500;
      line-height: 11.19px;
      text-align: center;
    }
  }
`;

export const FilterClearButtonWrapper = styled(Button)`
  && {
    border-radius: 0;
    background-color: ${(props) =>
      props.active ? palette.cornFlowerBlue : palette.newDarkBlue};
    :hover {
      background-color: ${(props) =>
        props.active ? palette.newBrightBlue : palette.purpleNavy};
    }
  }
`;

export const FilterClearButtonLabel = styled(Typography)`
  &&& {
    &.MuiTypography-root {
      // font-family: 'Montserrat', sans-serif;
      color: ${palette.white};
      font-size: ${fontSizes.small};
      font-weight: ${fontWeights.regular};
      display: flex-start;
      margin-right: ${spacing.tiny};
      align-items: center;
      padding-right: 25px;
    }
  }
`;

export const FilterRotatableChevronButtonWrapper = styled(Button)`
  && {
    border-radius: 0;
    background-color: ${palette.newDarkBlue};
    border-right: 2px solid ${palette.white};
    :hover {
      background-color: ${palette.purpleNavy};
    }
  }
  & .MuiSvgIcon-root > path {
    fill: ${palette.white};
  }
`;

export const FilterRotatableChevronButtonLabel = styled(Typography)`
  &&& {
    &.MuiTypography-root {
      // font-family: 'Montserrat', sans-serif;
      color: ${palette.white};
      font-size: ${fontSizes.small};
      font-weight: ${fontWeights.regular};
      display: flex-start;
      margin-right: ${spacing.tiny};
      align-items: center;
      padding-right: 25px;
    }
  }
`;

export const BoxContainer = styled.div`
  display: flex;
  width: fit-content;
  border-radius: 4px;
  overflow: hidden;
`;

export const FilterLableContainer = styled.div`
  // display: flex;
  color: ${palette.white};
  font-size: 14px;
`;
export const FilterLable = styled.div`
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 11.189px;
`;

export const ClearFilter = styled.div`
  color: #8492a4;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 11.189px;
  text-align: center;
  margin: 11px;
  cursor: pointer;
`;

export const Divider = styled.hr`
  width: 550px; // This controls the width of the Pop Up
  height: 1px;
  margin: 10px 0 15px 0;
  background: ${palette.coolGrey3};
  border: none;
`;
