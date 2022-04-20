/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';

export const ColorIndicator = styled.div`
  display: block;
  width: 6px;
  height: 100%;
  background: ${props => props.color};
  position: absolute;
  left: 0px;
`;
