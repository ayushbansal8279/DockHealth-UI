import React from 'react';
import styled, { keyframes } from 'styled-components';
import palette from 'styles/palette';

const DOTS_COLORS = [
  palette.lightBlue,
  palette.brightBlue,
  palette.darkBlue,
  palette.darkGrey,
];

const itemAnimation = keyframes`
  0% { left: 6%; transform: scale(0); }
  25% { left: 6%; transform: scale(0); }
  50% { left: 6%; transform: scale(1); }
  75% { left: 40%; transform: scale(1); }
 100% { left: 74%; transform: scale(1); }
`;

const lastItemAnimation = keyframes`
  0% { transform: scale(1); left: 74%; }
  100% { transform: scale(0); left: 74%; }
`;

const lastItemColorAnimation = keyframes`
  0% { background: ${DOTS_COLORS[1]}; }
  25% { background: ${DOTS_COLORS[0]}; }
  50% { background: ${DOTS_COLORS[3]}; }
  75% { background: ${DOTS_COLORS[2]}; }
  100% { background: ${DOTS_COLORS[1]}; }
`;

const LoaderContainer = styled.div`
  position: relative;
  width: ${props => props.size}px;
  height: ${props => Math.floor(props.size / 5)}px;
`;

const LoaderItem = styled.div`
  position: absolute;
  width: ${props => Math.floor(props.size / 5)}px;
  height: ${props => Math.floor(props.size / 5)}px;
  border-radius: 50%;
  animation: ${itemAnimation} ${props => props.speed}s infinite
    cubic-bezier(0, 0.5, 0.5, 1);

  &:nth-child(1) {
    animation: ${lastItemAnimation} ${props => props.speed / 4}s infinite
        cubic-bezier(0, 0.5, 0.5, 1),
      ${lastItemColorAnimation} ${props => props.speed}s infinite step-start;
  }

  &:nth-child(2) {
    background: ${DOTS_COLORS[1]};
    animation-delay: -${props => (props.speed / 4) * 2}s;
  }

  &:nth-child(3) {
    background: ${DOTS_COLORS[2]};
    animation-delay: -${props => (props.speed / 4) * 3}s;
  }

  &:nth-child(4) {
    background: ${DOTS_COLORS[3]};
    animation-delay: -${props => (props.speed / 4) * 4}s;
  }

  &:nth-child(5) {
    background: ${DOTS_COLORS[0]};
    animation-delay: -${props => (props.speed / 4) * 5}s;
  }
`;

export default ({ size = 48, speed = 2.4 }) => {
  return (
    <LoaderContainer size={size}>
      <LoaderItem size={size} speed={speed} />
      <LoaderItem size={size} speed={speed} />
      <LoaderItem size={size} speed={speed} />
      <LoaderItem size={size} speed={speed} />
      <LoaderItem size={size} speed={speed} />
    </LoaderContainer>
  );
};
