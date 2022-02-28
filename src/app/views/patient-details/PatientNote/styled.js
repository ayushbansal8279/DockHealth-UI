import styled from 'styled-components';
import spacing from 'styles/spacing';
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

  overflow-y: auto;

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
  padding-right: ${spacing.regular};
`;

export const NoteContainer = styled.div`
  display: flex;
  align-items: flex-start;
  padding: ${spacing.regular} ${spacing.largePlus};
  background-color: ${props => (props.isEdited ? '#F5F8FA' : 'transparent')};
`;

export const PatientNoteAuthor = styled.div`
  color: ${palette.coolGrey2};
`;

export const PatientNoteDescription = styled.div`
  border: none;
  background-color: transparent;
  outline: none;
  padding: 0;
  word-break: break-all;
`;

export const PatientNoteTextarea = styled.textarea`
  border: none;
  box-shadow: none;
  background-color: transparent;
  outline: none;
  border: none;
  padding: 5px;
  min-height: ${props =>
    props.textareaHeight > 100 ? `${props.textareaHeight}px` : '100px'};
  max-height: ${props =>
    props.textareaHeight > 180 ? '180px' : `${props.textareaHeight}px`};
  line-height: 24px;
  resize: none;

  &:focus {
    background-color: transparent;
    border: 1px ${palette.coolGrey2} solid;
    box-shadow: none;
    outline: none;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  width: 200px;
`;
