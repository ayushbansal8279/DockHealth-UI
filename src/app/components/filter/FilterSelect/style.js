import { keyframes } from '@mui/material';
import styled from 'styled-components';
import palette from 'styles/palette';

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
  min-height: 63px;
  flex-wrap: wrap;
  align-items: center;
  border: 2px solid ${palette.crystalBlue};
  border-radius: 4px;
  padding: 2px 5px;
  align-items: center;
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
  padding: 8px 15px 8px 0px;
  margin: 2px;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &: hover {
    background: #daefff;
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
  width: 100%;
`;

export const AvatarContainer = styled.div`
  margin-right: 15px;
`;

export const PatientOptionsContainer = styled.div`
  display: grid;
  grid-template-columns: 40% 20% 40%;
  gap: 10px;
  width: 100%;
  overflow:hidden;
`;

export const PatientName = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
export const PatientTableHeader = styled.div`
  margin-left: 32px;
  font-weight: 700;
  font-size: 18px;
  height: 32px;
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

