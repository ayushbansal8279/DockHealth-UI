import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import Button from '@mui/material/Button';

export const ButtonContainer = styled(Button)``;

export const ProfileDetailsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: ${spacing.regular} ${spacing.regular};
  font-family: 'Roboto Condensed', sans-serif;
  background-color: ${palette.white};
`;

export const ProfileName = styled.div`
  font-weight: ${fontWeights.bold};
  font-size: ${fontSizes.regularPlus};
  text-transform: uppercase;
  position: relative;
`;

export const ProfileDetailsLabel = styled.div`
  color: ${palette.brightBlue};
  text-transform: none;
`;
