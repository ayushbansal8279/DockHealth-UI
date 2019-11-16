import ButtonBase from '@material-ui/core/ButtonBase';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import React from 'react';
import styled from 'styled-components';

export const TaskViewGrid = styled(Grid)`
  && {
    max-width: 1152px;
    position: relative;
  }
`;

const SwitchButton = styled(ButtonBase)`
  && {
    background-color: transparent;
    border-radius: 0.25rem;
    overflow: hidden;
    padding: 0;
    position: relative;
  }
`;

const SwitchSectionContainer = styled.div`
  align-items: center;
  background-color: #fff;
  display: flex;
  height: 2rem;
  justify-content: space-around;
  width: 6.25rem;
  padding: 0 0.25rem;
`;

const SwitchSectionActivityContainer = styled.div`
  background-color: #007cab;
  border-radius: 0.25rem;
  height: 100%;
  position: absolute;
  transition: all 0.2s ease-out;
  top: 0;
  width: 6.25rem;
  z-index: 1;

  left: ${props => (props.slimView ? 50 : 0)}%;
`;

const SwitchIconContainer = styled.div`
  height: 0.875rem;
  position: relative;
  width: 1.1875rem;
  z-index: 2;
`;

const IconBar = styled.div`
  background-color: ${props => (props.active ? '#fff' : '#303538')};
  border-radius: 0.125rem;
  height: 0.125rem;
  position: absolute;
  transition: all 0.2s ease-out;
  width: 1.1875rem;
`;

const TopSwitchIconBar = styled(IconBar)`
  top: 0%;
`;

const CenterSwitchIconBar = styled(IconBar)`
  top: 50%;
  transform: translateY(-50%);
  width: 0.8125rem;
`;

const BottomSwitchIconBar = styled(IconBar)`
  bottom: 0%;
`;

const SwitchButtonLabel = styled.span`
  color: ${props => (props.active ? '#fff' : '#303538')};
  font-size: 0.875rem;
  transition: all 0.2s ease-out;
  z-index: 2;
`;

export const StyledSlimViewSwitch = ({ slimView, ...props }) => (
  <SwitchButton {...props}>
    <SwitchSectionContainer>
      <SwitchIconContainer>
        <TopSwitchIconBar active={!slimView} />
        <CenterSwitchIconBar active={!slimView} />
        <BottomSwitchIconBar active={!slimView} />
      </SwitchIconContainer>
      <SwitchButtonLabel active={!slimView}>Full view</SwitchButtonLabel>
    </SwitchSectionContainer>
    <SwitchSectionContainer>
      <SwitchIconContainer>
        <CenterSwitchIconBar active={slimView} />
      </SwitchIconContainer>
      <SwitchButtonLabel active={slimView}>Slim view</SwitchButtonLabel>
    </SwitchSectionContainer>
    <SwitchSectionActivityContainer slimView={slimView} />
  </SwitchButton>
);

export const StyledToolbar = styled(Toolbar)`
  && {
    padding: 0 0.625rem;
  }
`;

export const ToolbarContainer = styled.div`
  & > *:not(:last-child) {
    margin-right: 1rem;
  }
`;

export const TableWrapper = styled.div`
  width: 100%;
`;

export const TaskViewContainer = styled.div`
  max-width: 1152px;
  width: 1152px;
  width: -webkit-fill-available;
  width: -moz-available;
`;
