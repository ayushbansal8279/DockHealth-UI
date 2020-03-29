import { Button } from '@material-ui/core';
import { Add, Close } from '@material-ui/icons';
import React from 'react';
import { useToggle } from 'react-use';
import styled from 'styled-components';
import Spacing from '../components/common/Spacing';
import InboxNoMessagesIcon from '../img/inbox-no-messages-icon.svg';
import { MontserratTypography } from '../theme-montserrat';

const InboxNoMessagesOuterContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const InboxNoMessagesContainer = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  line-height: 1.5;
  min-width: 48rem;
  padding: 2rem;
  text-align: center;
  width: 48rem;
`;

export const InboxNoMessagesAvailable = () => (
  <InboxNoMessagesOuterContainer>
    <InboxNoMessagesContainer>
      <img src={InboxNoMessagesIcon} alt="Mailbox" />
      <Spacing vertical={4} />
      <MontserratTypography variant="h3" gutterBottom>
        YOUR INBOX IS EMPTY
      </MontserratTypography>
      <Spacing vertical={4} />
      <MontserratTypography variant="h4">
        <div>
          You can forward an email to Dock and we’ll turn that email into a
          task.
        </div>
        <Spacing vertical={4} />
        <div>
          To forward an email into Dock and automatically create a task, simply
          forward an email to{' '}
          <a href="mailto:task@dockhealth.email">
            <b>Task@DockHealth.email</b>
          </a>
          {'. '}
          We’ll drop it into your inbox here on Dock for you.
        </div>
      </MontserratTypography>
    </InboxNoMessagesContainer>
  </InboxNoMessagesOuterContainer>
);

const InboxHelpPanelContainer = styled.div`
  background-color: #c1ccda;
  border: 1px solid #e5e9f2;
  margin: 0.5rem;
  padding: 1rem;
  width: 100%;
`;

const InboxHelpTopContainer = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: 1fr auto;
`;

const InboxHelpBottomContainer = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: repeat(4, 1fr);
`;

const SpecialLabelPanelContainer = styled.div`
  background-color: #f9fafc;
  min-height: 4.5rem;
  padding: 0.5rem 1.5rem;
  width: 100%;
`;

const InboxHelpPanelLabel = styled(MontserratTypography)`
  && {
    color: #074a86;
  }
`;

const CloseButtonContainer = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  flex-flow: row nowrap;
`;

const InboxHiddenPanelOuterContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const InboxHiddenPanelContainer = styled(InboxHelpPanelContainer)`
  width: auto;
`;

const SpecialLabelHelpPanel = ({ label, children }) => (
  <SpecialLabelPanelContainer>
    <InboxHelpPanelLabel>
      <b>{label}</b>
    </InboxHelpPanelLabel>
    <Spacing vertical={2} />
    <MontserratTypography variant="h4" style={{ color: '#000000' }}>
      {children}
    </MontserratTypography>
  </SpecialLabelPanelContainer>
);

export const InboxHelpPanel = () => {
  const [isPanelOpen, togglePanel] = useToggle(true);

  return isPanelOpen ? (
    <InboxHelpPanelContainer>
      <InboxHelpTopContainer>
        <MontserratTypography variant="h4">
          Turn an email into a task on Dock by forwarding to:{' '}
          <b>Task@DockHealth.email.</b>
        </MontserratTypography>
        <Button
          variant="text"
          size="small"
          onClick={togglePanel}
          style={{ color: '#ffffff' }}
        >
          <CloseButtonContainer>
            <MontserratTypography variant="h4">Close</MontserratTypography>
            <Spacing horizontal={3} />
            <Close />
          </CloseButtonContainer>
        </Button>
        <MontserratTypography variant="h4" style={{ color: '#ffffff' }}>
          Add any or all special characters into the subject line of the email
        </MontserratTypography>
      </InboxHelpTopContainer>
      <Spacing vertical={4} />
      <InboxHelpBottomContainer>
        <SpecialLabelHelpPanel label="#ListName">
          Add the list name after # and send it directly to that list
        </SpecialLabelHelpPanel>
        <SpecialLabelHelpPanel label="*High">
          Add a flag to make this task a high priority
        </SpecialLabelHelpPanel>
        <SpecialLabelHelpPanel label="!Date">
          Add a due date to a task using format !MM-DD-YYYY (e.g. 12-28-2020)
        </SpecialLabelHelpPanel>
        <SpecialLabelHelpPanel label="@FirstLast">
          Assign the task to a user within a list (user must be a member of this
          list, e.g. @ElonMusk)
        </SpecialLabelHelpPanel>
      </InboxHelpBottomContainer>
    </InboxHelpPanelContainer>
  ) : (
    <InboxHiddenPanelOuterContainer>
      <InboxHiddenPanelContainer>
        <Button
          variant="text"
          size="small"
          onClick={togglePanel}
          style={{ color: '#ffffff' }}
        >
          <CloseButtonContainer>
            <MontserratTypography variant="h4">Open Tips</MontserratTypography>
            <Spacing horizontal={3} />
            <Add />
          </CloseButtonContainer>
        </Button>
      </InboxHiddenPanelContainer>
    </InboxHiddenPanelOuterContainer>
  );
};
