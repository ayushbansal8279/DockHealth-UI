/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import palette from 'styles/palette';
import PinIcon from 'img/pin';
import spacing from 'styles/spacing';

export const PatientNotesWrapper = styled.div`
  width: 100%;
  max-width: 800px;
`;

export const PinnedNotesWrapper = styled.div`
  position: relative;
  background-color: ${palette.coolGrey4};
  border: 1px solid ${palette.coolGrey3};

  &:before {
    content: url(${PinIcon});
    position: absolute;
    top: 9px;
    left: 6px;
  }
`;

export const NoteInput = styled.input`
  height: 52px;
  width: 100%;
  margin: ${spacing.regular} 0;
  background-color: ${palette.coolGrey4};
  border: 1px solid ${palette.coolGrey3};
  box-shadow: none;
  color: ${palette.mediumGrey};
  padding: ${spacing.regular};

  &:focus,
  &:active {
    background-color: ${palette.coolGrey4};
    border: 1px solid ${palette.coolGrey3};
    box-shadow: none;
    outline: none;
  }
`;
