import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';

export const ChangePasswordModalContainer = styled.div`
  position: relative;
  width: 490px;
  padding: ${spacing.largePlus} ${spacing.giga};
  background-color: ${palette.white};
  font-family: 'Montserrat', sans-serif;
  color: ${palette.mediumGrey};
`;

export const Title = styled.h2`
  margin-bottom: ${spacing.huge};
  font-size: ${fontSizes.large};
  font-weight: ${fontWeights.bold};
  font-family: inherit;
`;

export const StyledForm = styled.form`
  width: 100%;
`;

export const HelperText = styled.p`
  margin-bottom: ${spacing.small};
  margin-left: ${spacing.regularPlus};
  font-family: inherit;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
`;
