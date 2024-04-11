import { keyframes } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import palette, { typography } from 'styles/palette';
import spacing from 'styles/spacing';


export const Container = styled.div``;

export const aa = styled.div``;

export const FilterButtonWrapper = styled.div`
  display: flex;
`;

export const BottomWrapper = styled.div`
  display: flex;
`;

export const Title = styled.div`
  margin: 10px 0 5px 2px;
  color: #3D4858;
  font-family: Outfit;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const AssigneHolder = styled.div`
  display: flex;
  width: 95%;
  min-height: 48px;
  height: 48px;
  // height: 100%;
  border: 2px solid ${palette.crystalBlue};
  border-radius: 4px;
  padding: 15px 5px;
  align-items: center;
  &:active, &:focus{
    outline: none;
  }
`;


export const AssigneInput = styled.div`
width: 100%;
&:active, &:focus{
  outline: none;
}
`

export const AssigneItem = styled.div`
  // margin-right: 15px;
  border-radius: 8px;
  min-width: fit-content;
  width: fit-content;
  display: flex;
  // justify-content: space-between;
  align-items: center;
  display: flex;
  height: 40px;
  padding: 8px 0 8px 8px;
  align-items: center;
  // gap: 9px;
  
  // background: blue;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &: hover {
    background: #DAEFFF;
  }
`;
export const AssigneDropDown = styled.div`
  animation: {drop} 2s 1s ease-in;
  display: flex;
  flex-direction: column;
`;
export const AssigneDropDownItem = styled.div`
  padding: 10px 5px;
  tranition: 0.8s;

  &:hover{
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
