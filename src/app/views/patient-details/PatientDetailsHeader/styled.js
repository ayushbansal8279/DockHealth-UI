import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import Button from '@material-ui/core/Button';

export const ButtonContainer = styled(Button)``;
export const IconWrapper = styled.a`
  margin-left: 10px;
  margin-right: 10px;
  cursor: pointer;
  align-items: center;
  display: flex;
`;

export const ContactContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const PatientInfoRow = styled.div`
  display: flex;
`;
export const PatientDetailsContainer = styled.div`
  font-family: 'Roboto Condensed', sans-serif;
  display: flex;
  background-color: white;
  flex-direction: column;
`;

export const PatientDetailsInformationContainer = styled.div`
  display: flex;
  padding: ${spacing.huge} ${spacing.largePlus};
  justify-content: space-between;
  width: 100%;
  border-bottom: 3px solid #f5f8fa;
`;

export const PatientDetailsBio = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const PatientName = styled.div`
  font-weight: ${fontWeights.bold};
  font-size: ${fontSizes.regularPlus};
  text-transform: uppercase;
  position: relative;
`;

export const PatientInfo = styled.div`
  padding: 0 ${spacing.large};
  color: ${palette.mediumGrey};

  &:first-child {
    padding-left: 0;
  }
`;

export const PatientInfoDivider = styled.div`
  height: 13px; // per design
  width: 2px; // per design
  background-color: ${palette.coolGrey3};

  &:last-child {
    visibility: hidden;
  }
`;

export const PatientDetailsInformations = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${spacing.small};
`;

export const PatientDetails = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
`;

export const NavigationBackIcon = styled.img`
  position: absolute;
  left: -${spacing.regularPlus};
  top: 50%;
  transform: translateY(-50%);
`;

export const PatientDetailsLabel = styled.div`
  color: ${palette.brightBlue};
  text-transform: none;
`;

export const PatientDetailsButtonContainer = styled.div`
  color: ${palette.brightBlue};
`;

export const ArrowBox = styled.div`
  display: flex;
  align-items: flex-end;
`;

export const ArrowBoxIndicator = styled.div`
  height: fit-content;
`;
