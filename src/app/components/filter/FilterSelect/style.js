import { keyframes } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import palette, { typography } from 'styles/palette';
import spacing from 'styles/spacing';

export const Container = styled.div``;

export const FilterButtonWrapper = styled.div`
  display: flex;
`;

export const BottomWrapper = styled.div`
  display: flex;
`;

export const Title = styled.div`
  margin: 10px 0 5px 2px;
  color: #3d4858;
  font-family: Outfit;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const OptionHolder = styled.div`
  display: flex;
  width: 517px;
  min-height: 52px;
  flex-wrap: wrap;
  align-items: center;
  border: 2px solid ${palette.crystalBlue};
  border-radius: 4px;
  padding: 2px 5px;
  align-items: center;
`;

export const OptionInput = styled.div`
  width: 100px;
  margin: 3px 12px;
  &:active,
  &:focus {
    outline: none;
  }
`;

export const OptionItem = styled.div`
  margin-right: 15px;
  border-radius: 8px;
  min-width: fit-content;
  width: fit-content;
  display: flex;
  align-items: center;
  display: flex;
  height: 40px;
  padding: 8px 0 8px 8px;
  margin: 2px;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &: hover {
    background: #daefff;
  }
`;
export const OptionDropDown = styled.div`
  animation: {drop} 2s 1s ease-in;
  display: flex;
  flex-direction: column;
`;
export const OptionDropDownItem = styled.div`
  padding: 5px 5px;
  tranition: 0.8s;
  width: 517px;

  &:hover {
    background-color: #cfcccc;
    tranition: 0.8s;
  }
`;

export const dropDown = keyframes` 
from{
  opacity: 0;
  tranform: translateY(100px)
}
to{
  opacity: 1;
  tranform: translateY(0px)
}
`;

export const DisplayValue = styled.div`
  display: flex;
`;

export const AvatarContainer = styled.div`
  margin-right: 15px;
`;

export const Lable = styled.div`
  display: flex;
  align-items: center;
`;

export const CloseIconContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 5px;
  cursor: pointer;
`;
