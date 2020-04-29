import styled from 'styled-components';
import palette from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';

export const InputBox = styled.div`
  background-color: ${palette.coolGrey4};
  display: flex;
  flex-direction: column;
  padding: ${spacing.small} ${spacing.regular};
  ${props => props.fullWidth && 'width: 100%;'}
`;

export const InputField = styled.input`
  background-color: ${palette.coolGrey4};
  border: none;
  color: ${palette.mediumGrey};
  font-size: ${fontSizes.regular};
  font-weight: ${props =>
    props.placeholder && !props.value ? fontWeights.light : fontWeights.bold};
  outline: none;
  padding: ${spacing.tiny} 0 ${spacing.small};
`;

export const InputLabel = styled.label`
  color: ${palette.lightGray};
  font-size: ${fontSizes.smallPlus};
  padding: ${spacing.tiny} 0;
`;

export const RedDot = styled.span`
  color: ${palette.oPlusRed};
  margin-left: ${spacing.tiny};
`;

export const InputError = styled.span`
  color: ${palette.oPlusRed};
  font-size: ${fontSizes.smallPlus};
`;
