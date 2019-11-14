import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';

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
  display: flex;
  padding: 5px;
  flex: 1;
  flex-flow: row nowrap;
`;

export const HeadsUpSectionButton = styled.div`
  align-items: center;
  background-color: #ededf0;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  margin: 5px;
  transition: all 0.25s ease-out;

  ${props => props.active && 'box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);'}
`;

export const HeadsUpSectionButtonCount = styled.div`
  color: #2e3a43;
  font-size: 48px;
  font-weight: 800;
  pointer-events: none;
`;

export const HeadsUpSectionButtonLabel = styled.div`
  color: #281f3e;
  font-size: 14px;
  opacity: 0.5;
  pointer-events: none;
`;
