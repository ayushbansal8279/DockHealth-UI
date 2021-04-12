import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const TemplateBanerContainer = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr 246px;
  align-items: center;
  column-gap: 24px;
  width: 100%;
  padding: ${spacing.smallPlus} 55px ${spacing.smallPlus} ${spacing.large};
  text-align: left;
  border: 1px solid ${palette.brightBlue};
  background-color: ${palette.white};
`;

export const BanerCircleBackground = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 55px;
  width: 55px;
  border-radius: 50%;
  background-color: ${palette.brightBlue};
  color: ${palette.white};
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  color: ${palette.coolGrey1};
`;

export const TextContainer = styled.div`
  width: 100%;
  max-width: 790px;
  font-family: 'Montserrat', sans-serif;
`;

export const Title = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.bold};
`;

export const Description = styled.p`
  margin-bottom: 0;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
`;
