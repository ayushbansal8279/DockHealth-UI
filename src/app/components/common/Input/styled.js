import styled from 'styled-components';
import palette from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';

// Primary
export const PrimaryInputBox = styled.div`
  background-color: ${palette.coolGrey4};
  display: flex;
  flex-direction: column;
  padding: ${spacing.small} ${spacing.regular};
  ${props => props.fullWidth && 'width: 100%;'}
`;

export const PrimaryInputField = styled.input`
  background-color: ${palette.coolGrey4};
  border: none;
  color: ${palette.mediumGrey};
  font-size: ${fontSizes.regular};
  font-weight: ${props =>
    props.placeholder && !props.value ? fontWeights.light : fontWeights.bold};
  outline: none;
  padding: ${spacing.tiny} 0 ${spacing.small};

  &:disabled {
    background-color: ${palette.coolGrey4};
  }
`;

export const PrimaryInputLabel = styled.label`
  color: ${palette.lightGrey};
  font-size: ${fontSizes.small};
  padding: ${spacing.tiny} 0;
`;

export const PrimaryInputError = styled.span`
  color: ${palette.oPlusRed};
  font-size: ${fontSizes.small};
`;

// Secondary
export const SecondaryInputBox = styled.div`
  background-color: ${palette.white};
  display: flex;
  flex-direction: column;
  padding: ${spacing.small} ${spacing.smallPlus};
  ${props => props.fullWidth && 'width: 100%;'}
`;

export const SecondaryInputField = styled.input`
  background-color: ${palette.white};
  border: none;
  color: ${palette.mediumGrey};
  font-size: ${fontSizes.regular};
  font-weight: ${props =>
    props.placeholder && !props.value ? fontWeights.light : fontWeights.bold};
  outline: none;
  padding: ${spacing.tiny} 0 ${spacing.small};
  border-bottom: 1px solid ${palette.coolGrey2};

  &:disabled {
    background-color: ${palette.coolGrey4};
  }
`;

export const SecondaryInputLabel = styled.label`
  color: ${palette.lightGrey};
  font-size: ${fontSizes.small};
  padding: ${spacing.tiny} 0;
  text-transform: uppercase;
`;

export const SecondaryInputError = styled.span`
  color: ${palette.oPlusRed};
  font-size: ${fontSizes.small};
`;

// Rest
export const RedDot = styled.span`
  color: ${palette.oPlusRed};
  margin-left: ${spacing.tiny};
`;
