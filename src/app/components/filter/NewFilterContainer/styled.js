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

export const FilterOptionsList = styled.div`
  width: 257px;
  max-height: 600;
  overflow-y: auto;
  margin-top: 5px;
  margin-bottom: 5px;

  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    background-color: white;
  }
  ::-webkit-scrollbar-thumb {
    background-color: ${palette.coolGrey3};
    border-radius: 17px;
  }
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

export const AddFilterButtonContainer = styled(Button)`
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

export const AddFilterButtonLabel = styled(Typography)`
  &&& {
    &.MuiTypography-root {
      font-family: Outfit;
      font-size: 14px;
      font-weight: 500;
      line-height: 11.19px;
      text-align: center;
      color: ${palette.white};
      text-transform: none;
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

export const AddFilterRotatableChevronButtonWrapper = styled(Button)`
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

export const AddFilterRotatableChevronButtonLabel = styled(Typography)`
  &&& {
    &.MuiTypography-root {
      // font-family: 'Montserrat', sans-serif;
      color: ${palette.white};
      font-size: ${fontSizes.small};
      font-weight: ${fontWeights.regular};
      display: flex-start;
      margin-right: ${spacing.largePlus};
      align-items: center;
      // padding-right: 25px;
    }
  }
`;

export const BoxContainer = styled.div`
  display: flex;
  width: 142px;
  border-radius: 4px;
  overflow: hidden;
  height: 32px;
  margin-top: 4px;
  // z-index: 11;
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
  font-family: Outfit;
  margin-top: 14px;
  margin-left: 20px;
`;

export const ClearFilterButton = styled.div`
  width: 97px;
  height: 32px;
  // top: 175px;
  // left: 34px;
  // padding: 20px 16px 22px 16px;
  gap: 10px;
  border-radius: 7px;
  border: 1px solid #ec4f3e;
  opacity: 0px;
  cursor: pointer;
`;

export const ClearFilterLabel = styled.div`
  font-family: Outfit;
  font-size: 12px;
  font-weight: 500;
  line-height: 11.19px;
  text-align: center;
  color: #ec4f3e;
  margin-top: 10px;
`;

export const Divider = styled.hr`
  width: 550px; // This controls the width of the Pop Up
  height: 1px;
  margin: 10px 0 15px 0;
  background: ${palette.coolGrey3};
  border: none;
`;

export const SelectOptionsContainer = styled.div`
  // width: 257px;
  // max-height: 400;
  // overflow: auto;
`;

export const FilterOptionsListContainer = styled.div`
  width: 257px;
  // height: 240px;
  // overflow: hidden;
`;
