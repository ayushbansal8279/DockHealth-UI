import styled from 'styled-components';
import { fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const DescriptionTextContainer = styled.div`
  ${({ isCrossed }) => isCrossed && `text-decoration: line-through;`}
`;

export const DescriptionError = styled.p`
  margin-bottom: 0;
  color: ${palette.error};
  font-size: ${fontSizes.smallPlus};
  font-family: 'Roboto Condensed', sans-serif;
`;
