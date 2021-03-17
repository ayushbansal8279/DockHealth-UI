import { Grid } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import Spacing from 'components/common/Spacing';
import TipsPencilIcon from 'img/tip-pencil-icon.svg';
import InboxTip from 'img/tips/inbox/inbox-1.svg';
import palette from 'styles/palette';
import { MontserratTypography } from 'styles/theme-montserrat';
import { RobotoTypography } from 'styles/theme';

const MainInboxContainer = styled.div`
  color: ${palette.white};
  max-width: 842px;
  min-width: 574px;
  padding: 1rem;
`;

const SmallRobotoTypography = styled(RobotoTypography)`
  && {
    font-size: 0.875rem;
    line-height: 1.0625rem !important;
  }
`;

const InboxHelpPanel = () => (
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
      <Grid item xs={7}>
        <SmallRobotoTypography variant="h4" weight="500">
          Add any or all special characters below into the subject line of the
          email you are forwarding and Dock will organize them accordingly.
        </SmallRobotoTypography>
        <Spacing vertical={5} />
        <MontserratTypography variant="h4">
          <span>Subject line: </span>
          <b>&gt;ListName</b>
        </MontserratTypography>
        <SmallRobotoTypography variant="h4" weight="500">
          Add the list name after &gt; to send an email directly to that list
        </SmallRobotoTypography>
        <Spacing vertical={4} />
        <MontserratTypography variant="h4">
          <span>Subject line: </span>
          <b>^ListGroup</b>
        </MontserratTypography>
        <SmallRobotoTypography variant="h4" weight="500">
          Add the task to an existing task group in the list specified
        </SmallRobotoTypography>
        <Spacing vertical={4} />
        <MontserratTypography variant="h4">
          <span>Subject line: </span>
          <b>*High</b>
        </MontserratTypography>
        <SmallRobotoTypography variant="h4" weight="500">
          To make the task a high priority task, put #High in the subject line.
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
          Assign the task to a user within a list (user must be a member of this
          list, e.g. @ElonMusk)
        </SmallRobotoTypography>
        <Spacing vertical={4} />
        <MontserratTypography variant="h4">
          <span>Subject line: </span>
          <b>#FirstLast</b>
        </MontserratTypography>
        <SmallRobotoTypography variant="h4" weight="500">
          Assign an existing patient to the task (e.g. #JohnDoe)
        </SmallRobotoTypography>
        <Spacing vertical={4} />
        <MontserratTypography variant="h4">
          <span>Subject line: </span>
          <b>+LabelName</b>
        </MontserratTypography>
        <SmallRobotoTypography variant="h4" weight="500">
          Add an existing label to the task
        </SmallRobotoTypography>
        <Spacing vertical={4} />
        <MontserratTypography variant="h4">
          <span>Subject line: </span>
          <b>:Status</b>
        </MontserratTypography>
        <SmallRobotoTypography variant="h4" weight="500">
          Set a default task status
        </SmallRobotoTypography>
      </Grid>
      <Grid item xs={5}>
        <img alt="pointing" src={InboxTip} />
      </Grid>
    </Grid>
  </MainInboxContainer>
);

export default InboxHelpPanel;
