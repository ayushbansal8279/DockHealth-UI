import Grid from '@material-ui/core/Grid';
import styled, { keyframes } from 'styled-components';

export const HeadsUpSectionGrid = styled(Grid)`
  padding: 0.625rem 0 0.625rem 0.625rem;

  &:last-child {
    padding-right: 0.625rem;
  }
`;

export const HeadsUpSectionContainer = styled.div`
  background-color: #fff;
  border-radius: 4px;
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 170px;
`;

export const HeadsUpSectionHeader = styled.div`
  align-items: center;
  color: #2e3a43;
  display: flex;
  font-size: 20px;
  font-weight: 800;
  padding: 5px 10px;
  text-transform: uppercase;
`;

export const HeadsUpSectionDivider = styled.div`
  background-color: rgba(217, 217, 217, 0.5);
  height: 1px;
  margin: 0 0.375rem;
`;

export const HeadsUpSectionHeaderButton = styled.div`
  color: rgba(40, 31, 62, 0.5);
  cursor: pointer;
  font-size: 16px;
  font-weight: normal;
  margin-left: 30px;
  padding: 4px;
  position: relative;
  text-transform: none;

  &::after {
    background-color: #125375;
    bottom: 0;
    border-radius: 2px;
    content: '';
    height: ${props => (props.active ? 2 : 0)}px;
    left: 0;
    position: absolute;
    transition: all 0.1s linear;
    width: 100%;
  }
`;

export const HeadsUpButtonsContainer = styled.div`
  flex: 1;
  height: 7.9375rem;
  padding: 5px;
  white-space: nowrap;
`;

export const HeadsUpSectionButton = styled.div`
  align-items: center;
  background-color: #ededf0;
  border-radius: 4px;
  box-sizing: border-box;
  cursor: pointer;
  display: inline-flex;
  flex-direction: column;
  height: calc(100% - 10px);
  justify-content: center;
  margin: 5px;
  transition: all 0.25s ease-out;
  width: ${props => `calc(${100 / props.elementsCount ?? 1}% - 10px)`};

  ${props =>
    props.active &&
    'background-color: #cce5ee; box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);'}
`;

export const HeadsUpSectionButtonCount = styled.div`
  color: #2e3a43;
  font-size: 48px;
  font-weight: 800;
  pointer-events: none;
  transition: all 0.25s ease-out;

  ${props => props.active && 'color: #303538;'}
`;

export const HeadsUpSectionButtonLabel = styled.div`
  color: #281f3e;
  display: flex;
  font-size: 14px;
  justify-content: center;
  opacity: 0.5;
  overflow: hidden;
  padding: 0 0.5rem;
  pointer-events: none;
  transition: all 0.25s ease-out;
  white-space: normal;
  width: 100%;
  text-align: center;
  height: 32px;
  margin-top: -10px;
  align-items: flex-end;
  line-height: 1.2;

  ${props => props.active && 'color: #303538;'}
`;

export const HeadsUpSectionLabelOuterContainer = styled.div`
  overflow: hidden;
  width: 100%;
`;

const innerLabelAnimation = props => keyframes`
  0% {
    transform: translateX(-${props.scrollWidth ?? 0}px);
  }

  100% {
    transform: translateX(${props.scrollWidth ?? 0}px);
  }
`;

export const HeadsUpSectionLabelInnerContainer = styled.div`
  // animation-delay: 0s;
  // animation-name: ${props => innerLabelAnimation(props)};
  // animation-iteration-count: infinite;
  // animation-timing-function: linear;
  display: flex;
  justify-content: center;

  ${props =>
    props.animated &&
    `animation-duration: 3s;
    `}
`;

export const HeadsUpAreaContainer = styled.div`
  width: 1050px;
`;
