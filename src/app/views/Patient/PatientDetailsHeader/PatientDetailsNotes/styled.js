import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontWeights, fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const PatientDetailsNotesContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 716px; // per design
  padding: ${spacing.regular} 0 ${spacing.largePlus};
`;

export const PatientDetailsNotesListContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 225px;

  overflow-y: scroll;

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
  padding: ${spacing.regular} ${spacing.regular};
  margin: 0 ${spacing.regularPlus};
  justify-content: space-between;
  background-color: ${props => (props.isEditable ? '#F5F8FA' : 'white')};
  border-bottom: 1px solid #c1ccda;

  &:last-child {
    margin-bottom: 0;
    border-bottom: 0;
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
  padding: 0;

  &:disabled {
    border: none;
    background-color: transparent;
    outline: none;
    cursor: default;
  }
`;

export const AddNotePlaceholder = styled.div`
  color: ${palette.coolGrey2};
  text-transform: uppercase;
  font-weight: ${fontWeights.regularPlus};
  padding: ${spacing.regularPlus} ${spacing.large} 0;
  cursor: pointer;

  &:hover {
    color: ${palette.brightBlue};
  }

  &::first-letter {
    color: ${palette.orange};
  }
`;
