import styled from 'styled-components';
import palette from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';

export const InputWrapper = styled.div`
  ${props => props.fullWidth && 'width: 100%;'}
  font-family: 'Montserrat', sans-serif;
  font-weight: ${fontWeights.regular};
`;

// Primary
export const PrimaryInputBox = styled.div`
  width: 100%;
  box-sizing: border-box;
  background-color: ${palette.coolGrey4};
  display: flex;
  flex-direction: column;
  padding: ${spacing.small} ${spacing.regular};
  height: 75px;
`;

export const PrimaryInputField = styled.input`
  background-color: ${palette.coolGrey4};
  border: none;
  color: ${palette.mediumGrey};
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regular};
  outline: none;
  padding: ${props => (props.isLabelCenterized ? '0' : `0 0 2px`)};
  height: ${props => (props.isLabelCenterized ? '0' : 'initial')};
  transition: height 0.2s, padding 0.2s;
  font-family: 'Roboto Condensed', sans-serif;

  &:disabled {
    background-color: ${palette.coolGrey4};
  }
`;

export const PrimaryInputLabel = styled.label`
  color: ${props => {
    if (props.hasError) return palette.oPlusRed;

    return props.isLabelCenterized ? palette.mediumGrey : palette.lightGrey;
  }};
  font-size: ${props =>
    props.isLabelCenterized ? fontSizes.regular : fontSizes.small};
  padding: ${props =>
    props.isLabelCenterized ? '19px 0' : `${spacing.tiny} 0`};
  transition: padding 0.2s, font-size 0.2s;
`;

export const PrimaryInputError = styled.span`
  display: block;
  padding: ${spacing.small} ${spacing.smallPlus};
  color: ${palette.oPlusRed};
  font-size: ${fontSizes.small};
  font-weight: ${fontWeights.bold};
`;

// Secondary
export const SecondaryInputBox = styled.div`
  width: 100%;
  background-color: ${palette.white};
  display: flex;
  flex-direction: column;
`;

export const SecondaryInputField = styled.input`
  background-color: ${palette.white};
  border: none;
  color: ${palette.mediumGrey};
  font-size: ${fontSizes.regular};
  font-weight: ${props =>
    props.placeholder && !props.value
      ? fontWeights.light
      : fontWeights.regular};
  outline: none;
  height: auto;
  margin: 0;
  padding: ${spacing.tiny} 0 ${spacing.small};
  border-bottom: 1px solid ${palette.coolGrey2};
  box-shadow: none;

  &:focus {
    box-shadow: none;
    border: none;
    border-bottom: 1px solid ${palette.coolGrey2};
    background: transparent;
  }

  &:disabled {
    background-color: ${palette.coolGrey4};
  }
`;

export const SecondaryInputLabel = styled.label`
  color: ${props => (props.hasError ? palette.oPlusRed : palette.lightGrey)};
  font-size: ${fontSizes.small};
  padding: ${spacing.tiny} 0;
  text-transform: uppercase;
`;

export const SecondaryInputError = styled.span`
  display: block;
  padding: ${spacing.small} 0;
  color: ${palette.oPlusRed};
  font-size: ${fontSizes.small};
  font-weight: ${fontWeights.bold};
`;

// Rest
export const RedDot = styled.span`
  color: ${palette.oPlusRed};
  margin-left: ${spacing.tiny};
`;

// Rest
export const RequiredLabel = styled.span`
  color: ${palette.coolGrey2};
  margin-left: ${spacing.tiny};
`;
