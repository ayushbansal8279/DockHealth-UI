import styled from 'styled-components';
import { Grid } from '@mui/material';
import spacing from 'styles/spacing';
import palette, { typography } from 'styles/palette';
import { fontSizes } from 'styles/font';

export const TopSectionGrid = styled(Grid)`
  padding-bottom: ${spacing.largePlus};
  padding: ${spacing.regularPlus} 12px ${spacing.regularPlus} 4px;
`;

export const InputWrapper = styled.div`
  width: 645px;
  margin-left: 20px;
`;

export const CheckboxDescription = styled.label`
  display: inline;
  font-family: inherit;
  font-size: ${fontSizes.regular};
  color: ${palette.scrollbarGrey};
`;

export const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const ButtonWrapper = styled.div`
  color: ${palette.white};
  height: 40px;
  width: 80px;
  text-align: center;
  padding-top: 7px;
  margin-left: 15px;
  border-radius: 4px;
  background-color: ${palette.newDarkBlue};

  :hover {
    background-color: ${palette.purpleNavy};
  }

  @media print {
    display: none;
  }
`;
