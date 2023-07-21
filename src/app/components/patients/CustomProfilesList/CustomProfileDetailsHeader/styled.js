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

export const ProfileDetails = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding-left: 8px;
`;

export const ProfileDetailsInformation = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${spacing.small};
  flex-wrap: wrap;
`;

export const ProfileInfo = styled.div`
  padding: 2px ${spacing.large};
  color: ${palette.mediumGrey};
  display: flex;
`;

export const ProfileInfoDivider = styled.div`
  height: 13px; // per design
  width: 2px; // per design
  background-color: ${palette.coolGrey3};

  &:last-child {
    visibility: hidden;
  }
`;
