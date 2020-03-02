import ButtonBase from '@material-ui/core/ButtonBase';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import InboxNoMessagesIcon from '../img/inbox-no-messages-icon.svg';

export const FadeContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 100px;
`;

export const TaskListContainer = styled.div`
  display: flex;
  flex: 1;
  flex-flow: column wrap;
  min-width: 569px;
`;

export const StyledButton = styled(ButtonBase)`
  && {
    display: flex;
    margin: 2rem auto;
    background: #0ca1c7;
    border-radius: 1rem;
    height: 2rem;
    padding: 0.5rem 2.25rem;
    font-size: 0.875rem;
    color: #fff;
  }
`;
export const StyledButtonLabel = styled.div`
  && {
    display: flex;
    margin: 2rem auto;
    background: #0ca1c7;
    border-radius: 1rem;
    height: 2rem;
    padding: 0.25rem 2.25rem;
    font-size: 0.875rem;
    color: #fff;
  }
`;

export const TaskViewGrid = styled(Grid)`
  && {
    width: 1050px;
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
    width: 1050px;
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
  max-width: 1050px;
  width: 1050px;
  width: -webkit-fill-available;
  width: -moz-available;
`;

export const FilterByTextContainer = styled(motion.div)`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-flow: row nowrap;
  padding: 0 0.625rem 0.625rem;

  > *:not(:last-child) {
    margin-right: 0.25rem;
  }
`;

export const FilterByLabel = styled.div`
  color: #5e6366;
  font-size: 0.875rem;
`;

export const FilterByBoldLabel = styled(FilterByLabel)`
  font-weight: bold;
`;

export const FilterByLinkLabel = styled(FilterByLabel)`
  color: #487ba8;
  cursor: pointer;
  transition: filter 0.25s ease-out;

  &:hover {
    filter: brightness(1.25);
  }
`;

const InboxNoMessagesOuterContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const InboxNoMessagesContainer = styled.div`
  align-items: center;
  background-color: #fff;
  box-sizing: border-box;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  max-width: 48rem;
  min-width: 36.1875rem;
  padding: 2.5rem 6rem;
`;

const InboxNoMessagesLabel = styled.div`
  font-size: 1rem;
  padding-top: 1.5rem;
  text-align: center;

  > a {
    font-weight: 600;
    margin-left: 0.5ch;
  }
`;

const InboxNoMessagesBoldLabel = styled(InboxNoMessagesLabel)`
  font-size: 1.5rem;
`;

export const InboxNoMessagesAvailable = () => (
  <InboxNoMessagesOuterContainer>
    <InboxNoMessagesContainer>
      <img src={InboxNoMessagesIcon} alt="Mailbox" />
      <InboxNoMessagesBoldLabel>Your inbox is empty</InboxNoMessagesBoldLabel>
      <InboxNoMessagesLabel>
        Your inbox is a place you can forward emails that you want to turn into
        tasks here on Dock.
        <InboxNoMessagesLabel>
          To forward an email into Dock and automatically create a task, simply
          forward an email to
          <a href="mailto:task@dockhealth.email">
            task@dockhealth.email
          </a>
        </InboxNoMessagesLabel>
        <InboxNoMessagesLabel>
          We’ll drop it into your inbox here on Dock for you.
        </InboxNoMessagesLabel>
      </InboxNoMessagesLabel>
    </InboxNoMessagesContainer>
  </InboxNoMessagesOuterContainer>
);

export const SideClickListener = styled.div`
  flex: 1;
  ${props => props.heightMax && 'height: 100%;'}
`;

export const CompletedButtonRowContainer = styled.div`
  align-items: center;
  display: flex;
  height: 70px;
  flex-direction: row wrap;
  justify-content: center;
`;

export const TaskListContainerWrapper = styled.div`
  flex: 2;
  padding: 4px;
`;

export const TaskListHeader = styled.div`
  display: flex;
  position: relative;
  height: 67px;
  background: #2a4a70;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.24), 0 0 4px 0 rgba(0, 0, 0, 0.12);
  color: #fff;
  font-size: 1.5rem;
  font-weight: bold;
  padding: 15px 13.5px 19px 27px;
`;

export const TaskListSectionContainer = styled.div`
  margin-bottom: 1.5rem;
`;

export const TaskListSectionHeader = styled(Grid)`
  background-color: #fff;
  margin-bottom: 0.25rem;
  padding: 0.25rem 0.75rem;
`;

export const TaskListSectionHeading = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #0ca1c7;
`;

export const TasklistCount = styled.div`
  color: #2e3a43;
  font-size: 16px;
  font-weight: normal;
  margin-bottom: 0.5rem;
`;
