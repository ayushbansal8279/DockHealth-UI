/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';

import { fontSizes } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const EditableLabelContainer = styled.div`
  align-items: center;
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: 1fr auto auto;
  justify-content: space-between;
  width: 100%;
  height: 30px;
`;

export const LabelActionButton = styled.div`
  color: ${palette.coolGrey1};
  font-size: ${fontSizes.smallPlus};

  &:hover {
    color: ${palette.darkGrey};
    text-decoration: underline;
  }
`;

export const LabelContainer = styled.div`
  margin-right: ${spacing.small};
  overflow: hidden;
  text-overflow: ellispis;
  white-space: nowrap;
  color: ${palette.darkGrey};
`;

export const LabelInputContainer = styled.div`
  align-items: center;
  background-color: ${palette.white};
  border: 1px solid ${palette.coolGrey2};
  border-radius: 3px;
  display: grid;
  grid-column-end: span 3;
  grid-gap: 0.5rem;
  grid-template-columns: 1fr auto;
  padding: ${spacing.small};
`;

export const LabelInput = styled.div`
  background-color: transparent;
  border: 0;
  color: ${palette.darkGrey};
  font-family: 'Roboto Condensed', sans-serif;
  outline: none;
  padding: 0;

  &::after {
    color: ${palette.darkGrey};
    content: '|';
  }
`;
