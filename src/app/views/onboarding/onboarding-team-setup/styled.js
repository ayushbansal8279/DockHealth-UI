import styled from 'styled-components';
import palette from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';

export const ViewContainer = styled.div`
  color: ${palette.mediumGrey};
  font-family: 'Montserrat', sans-serif;
`;

export const Title = styled.h2`
  margin-bottom: 0;
  font-size: ${fontSizes.huge};
  font-weight: ${fontWeights.bold};
  font-family: inherit;
  text-transform: uppercase;
`;

export const Description = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.regularPlus};
  font-weight: ${fontWeights.light};
  font-family: inherit;
`;

export const StyledForm = styled.form`
  width: 100%;
`;

export const AddPersonButton = styled.button`
  color: ${palette.brightBlue};
  font-weight: ${fontWeights.regular};
  font-size: ${fontSizes.regularPlus};
  font-family: inherit;
  cursor: pointer;
`;
