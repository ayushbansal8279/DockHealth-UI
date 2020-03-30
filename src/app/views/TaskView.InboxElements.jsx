import React from 'react';
import styled from 'styled-components';
import Spacing from '../components/common/Spacing';
import TipsContentHeader from '../components/common/TipsContentHeader';
import InboxNoMessagesIcon from '../img/envelope-new.svg';
import { MontserratTypography } from '../theme-montserrat';

const InboxNoMessagesOuterContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const InboxNoMessagesContainer = styled.div`
  align-items: center;
  border: 0.3125rem solid #c1ccda;
  border-radius: 6.375rem;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  height: 6.375rem;
  min-height: 6.375rem;
  min-width: 6.375rem;
  padding: 2rem;
  text-align: center;
  width: 6.375rem;

  > img {
    cursor: default;
    height: 2.75rem;
    min-height: 2.75rem;
    min-width: 2.75rem;
    width: 2.75rem;
  }
`;

export const InboxNoMessagesAvailable = () => (
  <InboxNoMessagesOuterContainer>
    <InboxNoMessagesContainer>
      <img src={InboxNoMessagesIcon} alt="Mailbox" />
    </InboxNoMessagesContainer>
    <Spacing vertical={4} />
    <MontserratTypography variant="h3" gutterBottom>
      YOUR INBOX IS EMPTY
    </MontserratTypography>
  </InboxNoMessagesOuterContainer>
);

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

const HeaderContainer = styled.div`
  color: #000000;
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

export const InboxHelpPanel = ({ arrowAnchorElement, closeInboxHelpPanel }) => (
  <TipsContentHeader
    label={
      <HeaderContainer>
        <MontserratTypography color="inherit" variant="h4">
          Turn an email into a task on Dock by forwarding to:{' '}
          <b>Task@DockHealth.email.</b>
        </MontserratTypography>
      </HeaderContainer>
    }
    arrowAnchorElement={arrowAnchorElement?.current}
    closeHeader={closeInboxHelpPanel}
  >
    <Spacing vertical={1} />
    <MontserratTypography variant="h4" style={{ color: '#ffffff' }}>
      Add any or all special characters into the subject line of the email
    </MontserratTypography>
    <Spacing vertical={2} />
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
  </TipsContentHeader>
);
