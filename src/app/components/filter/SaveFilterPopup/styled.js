import { keyframes } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import palette, { typography } from 'styles/palette';
import spacing from 'styles/spacing';
import { Typography, Button } from '@mui/material';
import { fontSizes, fontWeights } from 'styles/font';

export const Container = styled.div`
  width: 600px;
  height: 400px;
  // border: 100px solid red;
`;
export const Header = styled.div`
  width: 100%;
  text-align: center;
  margin: ${spacing.huge} 0;
`;
export const Title = styled.h5`
  font-size: ${fontSizes.regularPlus};
  text-align: center;
  font-weight: ${fontWeights.regularPlus};
`;

export const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const CheckboxDescription = styled.label`
  color: ${palette.black};
  font-family: Outfit;
  font-size: 16px;
  font-style: normal;
  font-weight: ${fontWeights.light};
  line-height: 25px; /* 156.25% */
  margin-right: 30px;
`;

export const PrivacyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  margin: 30px 40px;
`;
export const PrivacyTitle = styled.div`
  color: ${palette.offBlack};
  font-family: Outfit;
  font-size: 18px;
  font-style: normal;
  font-weight: ${fontWeights.regularPlus};
  line-height: 25px;
  text-transform: capitalize;
`;

export const InputContainer = styled.div`
  margin: 20px 32px;
`

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 60px;
  gap: 10px;
`
