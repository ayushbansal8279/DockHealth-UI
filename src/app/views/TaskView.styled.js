import ButtonBase from '@material-ui/core/ButtonBase';
import styled from 'styled-components';
import React from 'react';

const SwitchButton = styled(ButtonBase)`
  && {
    align-items: center;
    background-color: #e6ecf0;
    border-radius: 4px;
    height: 32px;
    margin-right: 8px;
    padding: 0 8px;

    > img {
      align-items: center;
      display: flex;
      height: 16px;
      justify-content: center;
      margin-right: 4px;
    }
  }
`;

const SwitchIconContainer = styled.div`
  height: 14px;
  margin-right: 8px;
  position: relative;
  width: 19px;
`;

const TopSwitchIconBar = styled.div`
  background-color: #303538;
  border-radius: 2px;
  height: 2px;
  position: absolute;
  top: 0%;
  transition: all 0.2s ease-out;
  width: 19px;

  ${props =>
    props.slimView &&
    `
    top: 50%;
    transform: translateY(-50%);
    width: 13px;
  `}
`;

const CenterSwitchIconBar = styled.div`
  background-color: #303538;
  border-radius: 2px;
  height: 2px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 13px;
`;

const BottomSwitchIconBar = styled.div`
  background-color: #303538;
  border-radius: 2px;
  bottom: 0%;
  height: 2px;
  position: absolute;
  transition: all 0.2s ease-out;
  width: 19px;

  ${props =>
    props.slimView &&
    `
    bottom: 50%;
    transform: translateY(50%);
    width: 13px;
  `}
`;

const SwitchButtonLabel = styled.span`
  color: #303538;
  font-size: 16px;
`;

export const StyledSlimViewSwitch = ({ slimView, ...props }) => (
  <SwitchButton {...props}>
    <SwitchIconContainer>
      <TopSwitchIconBar slimView={slimView} />
      <CenterSwitchIconBar />
      <BottomSwitchIconBar slimView={slimView} />
    </SwitchIconContainer>
    <SwitchButtonLabel>
      {slimView ? 'Slim view' : 'Full view'}
    </SwitchButtonLabel>
  </SwitchButton>
);
