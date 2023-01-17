import styled from 'styled-components';
import palette from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';

export const DescriptionTextContainer = styled.div`
  ${({ isCrossed }) => isCrossed && `text-decoration: line-through;`}
`;

export const DescriptionError = styled.p`
  margin-bottom: 0;
  color: ${palette.error};
  font-size: ${fontSizes.smallPlus};
  font-family: 'Roboto Condensed', sans-serif;
`;

export const DescriptionLabelContainer = styled.div`
  display: block;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: ${fontSizes.small};
  font-weight: ${fontWeights.light};
  color: ${palette.coolGrey1};
  text-transform: uppercase;
  background-color: #f7fafb;
  position: relative;

  & > span {
    text-transform: none;
  }
`;

export const DescriptionLabel = styled.label`
  position: absolute;
  z-index: 1;
  top: ${spacing.small};
  left: ${spacing.regular};
`;
