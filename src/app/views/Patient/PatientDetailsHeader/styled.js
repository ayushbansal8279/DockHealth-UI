import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontWeights } from 'styles/font';
import palette from 'styles/palette';

export const PatientDetailsContainer = styled.div`
  font-family: 'Roboto Condensed', sans-serif;
  display: flex;
  background-color: white;
  flex-direction: column;
  align-items: center;
`;

export const PatientDetailsNotesContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 720px; // per design
  max-height: 240px;
  overflow-y: scroll;
  padding: ${spacing.regular} 0 ${spacing.largePlus};
`;

export const PatientDetailsNotesGroupContainer = styled.div`
  display: flex;
`;

export const PatientDetailsNoteDate = styled.div`
  color: ${palette.lightGrey};
  margin-right: ${spacing.regularPlus};
  padding: ${spacing.regular} 0 ${spacing.smallPlus};
`;

export const PatientDetailsNoteDescription = styled.div`
  padding: ${spacing.regular} 0 ${spacing.smallPlus} ${spacing.regularPlus};
  border-bottom: 1px solid ${palette.blueGrey};
  width: 100%;
`;

export const PatientDetailsInformationContainer = styled.div`
  display: flex;
  padding: ${spacing.huge};
  align-items: center;
  width: 100%;
`;

export const PatientName = styled.div`
  font-weight: ${fontWeights.bold};
  text-transform: uppercase;
`;

export const PatientInfo = styled.div`
  padding: 0 ${spacing.huge};
  color: ${palette.mediumGrey};
`;

export const PatientInfoDivider = styled.div`
  height: 13px; // per design
  width: 1px; // per design
  background-color: ${palette.mediumGrey};

  &:last-child {
    visibility: hidden;
  }
`;

export const PatientNote = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${spacing.regular};

  &:last-child {
    margin-bottom: 0;
  }
`;

export const PatientNoteAuthor = styled.span`
  color: ${palette.coolGrey2};
`;
