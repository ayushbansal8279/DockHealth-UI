/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import palette from 'styles/palette';
import PinIcon from 'img/pin';
import spacing from 'styles/spacing';

export const PatientNotesWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  background: ${palette.white};
  padding: 12px;
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

export const RichTextInputContainer = styled.div`
  background-color: ${palette.coolGrey4};
  border: 1px solid ${palette.coolGrey3};
  box-shadow: none;
  transition: box-shadow 0.5s, border-color 0.25s ease-in-out;
  color: ${palette.mediumGrey};
  font-family: 'Roboto Condensed', sans-serif;
  margin: 0;
  outline: 12px;
  padding: ${spacing.regular};
  overflow: hidden;
  min-height: 60px;
  overflow-y: auto;
`;
