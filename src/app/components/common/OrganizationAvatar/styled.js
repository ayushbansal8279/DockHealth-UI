import styled from 'styled-components';
import palette from 'styles/palette';
import { fontWeights } from 'styles/font';

export const AvatarWrapper = styled.div`
  position: relative;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  background: ${({ backgroundColor }) => backgroundColor || palette.coolGrey4};
  font-family: 'Montserrat', sans-serif;
  overflow: hidden;
`;

export const AvatarInitials = styled.p`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-bottom: 0;
  transform: translate(-50%, -50%);
  color: ${palette.white};
  font-size: ${({ size }) => size / 50}rem;
  font-weight: ${fontWeights.bold};
  text-transform: uppercase;
`;
