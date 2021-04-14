import styled from 'styled-components';
import { fontSizes } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const TaskTemplateContainer = styled.div`
  width: 100%;
  margin-bottom: ${spacing.smallPlus};
  text-align: left;
`;

export const TaskTemplateHeader = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: 30px auto;
  grid-column-gap: ${spacing.regularPlus};
  align-items: center;
  width: 100%;
  padding: ${spacing.small} ${spacing.large};
  border: 1px solid ${palette.coolGrey3};
  background-color: ${palette.white};
  font-family: 'Roboto Condensed', sans-serif;
`;

export const ArrowButton = styled.button`
  grid-column: 1;
  grid-row: 1;
`;

export const NameInput = styled.input`
  max-width: 400px;
  grid-row: 1;
  grid-column: 2;
  margin-bottom: 0;
  padding: ${spacing.small};
  color: ${palette.mediumGrey};
  font-size: ${fontSizes.regularPlus};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  background-color: transparent;
  border: 1px solid ${palette.coolGrey2};
  border-radius: 5px;
  background: ${palette.coolGrey4};

  &[readonly] {
    background-color: transparent;
    cursor: initial;
    outline: none;
    border: none;
  }

  &:focus {
    outline: none;
  }
`;

export const Description = styled.p`
  grid-column: 2;
  grid-row: 2;
  margin-bottom: 0;
  color: ${palette.coolGrey1};
  font-size: ${fontSizes.regular};
`;

export const MenuContainer = styled.div`
  grid-column: 3;
  grid-row: 1;
  overflow: hidden;
  color: ${palette.coolGrey2};
`;
