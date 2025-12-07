import styled from 'styled-components';
import palette, { typography } from 'styles/palette';
import { fontSizes } from 'styles/font';

export const CustomTextEditorContainer = styled.div`
  color: ${palette.mediumGrey};
`;

export const ColorIndicator = styled.div`
  display: block;
  width: 8px;
  height: 50px;
  background: ${(props) => props.color};
  position: absolute;
  left: -12px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  border-radius: 6px;
`;

export const DescriptionError = styled.p`
  margin-bottom: 0;
  color: ${palette.error};
  font-size: ${fontSizes.smallPlus};
  font-family: inherit;
`;
