import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontWeights } from 'styles/font';
import palette from 'styles/palette';

export const PatientDetailsContainer = styled.div`
  font-family: 'Roboto Condensed', sans-serif;
  display: flex;
  background-color: white;
  flex-direction: column;
`;

export const PatientDetailsNotesContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 720px; // per design
  padding: ${spacing.regular} 0 ${spacing.largePlus};
`;

export const PatientDetailsNotesGroupContainer = styled.div`
  display: flex;
`;

export const PatientDetailsNotesGroups = styled.div`
  max-height: 240px;
  overflow: scroll;

  &::-webkit-scrollbar {
    -webkit-appearance: none;
  }
  &::-webkit-scrollbar:vertical {
    width: 11px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    border: 2px solid white;
    background-color: rgba(0, 0, 0, 0.5);
  }
  &::-webkit-scrollbar-track {
    background-color: #fff;
    border-radius: 8px;
  }
`;

export const PatientDetailsNoteDate = styled.div`
  color: ${palette.lightGrey};
  margin-right: ${spacing.regularPlus};
  padding: ${spacing.regular} 0 ${spacing.smallPlus};
  width: 100px;
`;

export const PatientDetailsNoteDescription = styled.div`
  border-bottom: 1px solid ${palette.blueGrey};
  width: 100%;
`;

export const PatientDetailsInformationContainer = styled.div`
  display: flex;
  padding: ${spacing.huge} ${spacing.largePlus};
  justify-content: center;
  flex-direction: column;
  width: 100%;
  border-bottom: 3px solid #f5f8fa;
`;

export const PatientName = styled.div`
  font-weight: ${fontWeights.bold};
  text-transform: uppercase;
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

export const PatientDetails = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${spacing.small};
`;
