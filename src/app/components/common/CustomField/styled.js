import styled from 'styled-components';
import palette from 'styles/palette';
import { fontSizes } from 'styles/font';

export const CustomTextEditorContainer = styled.div`
  color: ${palette.mediumGrey};
`;

export const ColorIndicator = styled.div`
  display: block;
  width: 6px;
  height: 100%;
  background: ${props => props.color};
  position: absolute;
  left: 0px;
  z-index: 1;
`;

export const DescriptionError = styled.p`
  margin-bottom: 0;
  color: ${palette.error};
  font-size: ${fontSizes.smallPlus};
  font-family: 'Roboto Condensed', sans-serif;
`;
