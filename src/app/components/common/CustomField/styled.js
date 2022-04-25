/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import palette from 'styles/palette';

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
