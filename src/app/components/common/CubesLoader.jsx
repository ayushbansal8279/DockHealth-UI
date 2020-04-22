import React from 'react';
import styled, { keyframes } from 'styled-components';
import palette from 'app/palette';

const LoaderContainer = styled.div`
  height: ${props => props.size || 48}px;
  position: relative;
  width: ${props => props.size || 48}px;
`;

const animation1 = keyframes`
  0% { left: 0%; top: 0%; }
  25% { left: 0%; top: 0%; }
  50% { left: 50%; top: 0%; }
  75% { left: 50%; top: 0%; }
  100% { left: 50%; top: 0%; }
`;

const animation2 = keyframes`
  0% { left: 50%; top: 0%; }
  25% { left: 50%; top: 50%; }
  50% { left: 50%; top: 50%; }
  75% { left: 50%; top: 50%; }
  100% { left: 0%; top: 50%; }
`;

const animation3 = keyframes`
  0% { left: 0%; top: 50%; }
  25% { left: 0%; top: 50%; }
  50% { left: 0%; top: 50%; }
  75% { left: 0%; top: 0%; }
  100% { left: 0%; top: 0%; }
`;

const CubeContainer = styled.div`
  animation: ${props => props.animation} 0.5s linear 0s infinite;
  box-sizing: border-box;
  height: 50%;
  padding: 10%;
  position: absolute;
  width: 50%;
`;

const CubeElement = styled.div`
  background-color: ${props => props.color ?? palette.cyanBlue};
  border-radius: 10%;
  height: 100%;
  width: 100%;
`;

const Cube = ({ animation, color }) => (
  <CubeContainer animation={animation}>
    <CubeElement color={color} />
  </CubeContainer>
);

export default ({ color, size }) => (
  <LoaderContainer size={size}>
    <Cube color={color} animation={animation1} />
    <Cube color={color} animation={animation2} />
    <Cube color={color} animation={animation3} />
  </LoaderContainer>
);
