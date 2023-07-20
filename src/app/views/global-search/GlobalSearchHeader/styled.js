import styled from 'styled-components';
import { Grid } from '@mui/material';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontSizes } from 'styles/font';

export const TopSectionGrid = styled(Grid)`
  padding-bottom: ${spacing.largePlus};
  padding: ${spacing.regularPlus} 12px ${spacing.regularPlus} 4px;
`;

export const InputWrapper = styled.div`
  width: 645px;
`;

export const CheckboxDescription = styled.label`
  display: inline;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: ${fontSizes.regular};
  color: ${palette.scrollbarGrey};
`;

export const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  width: 130px;
  height: 56px;
  padding: 0 ${spacing.smallPlus};
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  background: ${palette.coolGrey4};
`;
