import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontWeights } from 'styles/font';

export const ColumnDisplayContainer = styled.div`
  background-color: white;
  padding: ${spacing.regularPlus};
  width: 230px;
  box-shadow: 0px 4px 11px grey;
`;

export const ColumnDisplayHeader = styled.div`
  color: ${palette.darkGrey};
  font-weight: ${fontWeights.bold};
  margin-bottom: ${spacing.large};
`;

export const ColumnDisplayOption = styled.div`
  display: flex;
  margin-left: ${spacing.small};
  padding-bottom: ${spacing.regular};
  align-items: center;
  cursor: ${({ isDisabled }) => (isDisabled ? 'initial' : 'pointer')};
  opacity: ${({ isDisabled }) => (isDisabled ? 0.6 : 1)};
  & > button {
    margin-top: 6px;
  }
`;

export const ColumnDisplayLabel = styled.label`
  color: ${palette.darkGrey};
  font-weight: ${fontWeights.bold};
  margin-left: ${spacing.small};
  cursor: inherit;
`;

export const ColumnDisplayIcon = styled.img`
  cursor: pointer;
  height: 28px;
  margin-top: 0px;
`;
