import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';
import { Grid } from '@mui/material';

export const ChangeMobileNumberModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 544px;
  height: 444px;
  padding: ${spacing.largePlus} ${spacing.giga};
  background-color: ${palette.white};
  font-family: 'Outfit', sans-serif;
  color: ${palette.mediumGrey};
`;

export const StepContainer = styled.div`
  display: flex;
  flex: 1;
`;

export const Title = styled.h2`
  margin-bottom: ${spacing.huge};
  font-size: ${fontSizes.large};
  font-weight: ${fontWeights.bold};
  font-family: inherit;
`;

export const GridMaxHeight = styled(Grid)`
  && {
    flex: 1;
  }
`;

export const StyledForm = styled.form`
  display: flex;
  width: 100%;
  flex: 1;
`;

export const HelperText = styled.p`
  margin-bottom: ${spacing.regularPlus};
  font-family: inherit;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};

  & > button {
    color: ${palette.brightBlue};
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const LargeHelperText = styled(HelperText)`
  font-size: ${fontSizes.large};
`;
