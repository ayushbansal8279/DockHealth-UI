import React from 'react';
import styled from 'styled-components';
import { fontWeights, fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const PatientMainContainer = styled.div`
  display: flex;
  margin-left: 10px;
`;

export const Title = styled.div`
  margin-right: 40px;
  color: ${palette.coolGrey1};
  font-family: Outfit;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  display: flex;
  align-items: center;
`;

export const AddPatient = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
  padding: 10px;
`;

export const PatientContainer = styled.div`
  margin-left: 10px;
  display: flex;
  align-items: center;
  gap: 15px;
  height: 40px;
  padding: 3px 10px;
  border-radius: 8px;
  background: #F8F8F9;

  &:hover{
    background: #DAEFFF;
  }
`;

export const PatientName = styled.div`
  color: ${palette.black};
  font-family: Outfit;
`;

