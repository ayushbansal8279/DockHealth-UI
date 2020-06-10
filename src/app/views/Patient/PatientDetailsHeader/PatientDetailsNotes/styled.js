import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontWeights, fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const PatientDetailsNotesContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 800px; // per design
  padding: ${spacing.regular} 0 ${spacing.largePlus};
  margin-left: 110px; //per design
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
  width: 100px; // per design
`;

export const PatientDetailsNoteDescription = styled.div`
  border-bottom: 1px solid ${palette.blueGrey};
  width: 100%;
`;

export const PatientNoteInformation = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const PatientNoteOptions = styled.div`
  display: flex;
`;

export const PatientNoteOption = styled.label`
  color: ${palette.lightGrey};
  font-size: ${fontSizes.small};
  opacity: 0;

  &:first-child {
    margin-right: 16px;
  }

  &:hover {
    color: #1e2e40;
    text-decoration-line: underline;
    cursor: pointer;
  }
`;

export const PatientNote = styled.div`
  display: flex;
  flex-direction: row;
  padding: ${spacing.regular} ${spacing.regular} ${spacing.small};
  justify-content: space-between;
  background-color: ${props => (props.isEditable ? '#F5F8FA' : 'white')};

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    & ${PatientNoteOption} {
      opacity: 1;
    }
  }

  &:focus {
    outline: none;
  }
`;

export const PatientNoteAuthor = styled.div`
  color: ${palette.coolGrey2};
`;

export const PatientNoteDescription = styled.input`
  border: none;
  background-color: transparent;
  outline: none;
  width: 100%;

  &:disabled {
    border: none;
    background-color: transparent;
    outline: none;
    cursor: default;
  }
`;

export const AddNotePlaceholder = styled.div`
  color: ${palette.brightBlue};
  text-transform: uppercase;
  font-weight: ${fontWeights.regularPlus};
  margin-top: ${spacing.largePlus};
  margin-left: 100px; // per design
  padding: ${spacing.smallPlus} ${spacing.regularPlus};
  cursor: pointer;

  &::first-letter {
    color: ${palette.orange};
  }
`;
