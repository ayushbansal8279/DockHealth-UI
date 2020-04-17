import { Grid } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import Spacing from '../components/common/Spacing';
import TipsContentHeader from '../components/common/TipsContentHeader';
import InboxNoMessagesIcon from '../img/envelope-new.svg';
import TipsPencilIcon from '../img/tip-pencil-icon.svg';
import InboxTip from '../img/tips/inbox/inbox-1.svg';
import palette from '../palette';
import { RobotoTypography } from '../theme';
import { MontserratTypography } from '../theme-montserrat';

const InboxNoMessagesOuterContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const InboxNoMessagesContainer = styled.div`
  align-items: center;
  border: 0.3125rem solid ${palette.coolGrey2};
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

const MainInboxContainer = styled.div`
  color: ${palette.white};
  max-width: 842px;
  min-width: 574px;
  padding: 1rem;
`;

const SmallRobotoTypography = styled(RobotoTypography)`
  && {
    font-size: 0.625rem;
    line-height: 1.0625rem !important;
  }
`;

export const InboxHelpPanel = ({ arrowAnchorElement }) => (
  <TipsContentHeader arrowAnchorElement={arrowAnchorElement.current}>
    <MainInboxContainer>
      <Grid container alignItems="center" wrap="nowrap">
        <img alt="pencil" src={TipsPencilIcon} />
        <Spacing horizontal={3} />
        <SmallRobotoTypography variant="h4" weight="bold">
          Forward your emails to Dock and put them to work.
        </SmallRobotoTypography>
      </Grid>
      <Spacing vertical={4} />
      <MontserratTypography variant="h4" weight="bold">
        Turn an email into a task on Dock by forwarding it to:
        Task@DockHealth.email
      </MontserratTypography>
      <Spacing vertical={4} />
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <SmallRobotoTypography variant="h4" weight="500">
            Add any or all special characters below into the subject line of the
            email you are forwarding and Dock will organize them accordingly.
          </SmallRobotoTypography>
          <Spacing vertical={5} />
          <MontserratTypography variant="h4">
            <span>Subject line: </span>
            <b>#ListName</b>
          </MontserratTypography>
          <SmallRobotoTypography variant="h4" weight="500">
            Add the list name after # to send an email directly to that list.
          </SmallRobotoTypography>
          <Spacing vertical={4} />
          <MontserratTypography variant="h4">
            <span>Subject line: </span>
            <b>*High</b>
          </MontserratTypography>
          <SmallRobotoTypography variant="h4" weight="500">
            To make the task a high priority task, put #High in the subject
            line.
          </SmallRobotoTypography>
          <Spacing vertical={4} />
          <MontserratTypography variant="h4">
            <span>Subject line: </span>
            <b>!Date</b>
          </MontserratTypography>
          <SmallRobotoTypography variant="h4" weight="500">
            Add a due date to a task by adding a date after ! (e.g. !02-28-2020)
          </SmallRobotoTypography>
          <Spacing vertical={4} />
          <MontserratTypography variant="h4">
            <span>Subject line: </span>
            <b>@FirstLast</b>
          </MontserratTypography>
          <SmallRobotoTypography variant="h4" weight="500">
            Assign the task to a user within a list (user must be a member of
            this list, e.g. @ElonMusk)
          </SmallRobotoTypography>
        </Grid>
        <Grid item xs={7}>
          <img alt="pointing" src={InboxTip} />
        </Grid>
      </Grid>
    </MainInboxContainer>
  </TipsContentHeader>
);
