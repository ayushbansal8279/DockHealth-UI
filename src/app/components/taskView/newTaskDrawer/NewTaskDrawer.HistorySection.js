import React from 'react';
import { Grid } from '@material-ui/core';
import Spacing from 'components/common/Spacing';
import CubesLoader from 'components/common/CubesLoader';
import { RobotoTypography } from 'styles/theme';
import moment from 'moment';
import { HorizontalLabel } from './NewTaskDrawer.Styled';
import SmallSwitchChevronUp from '../../../img/small-switch-chevron-up';
import SmallSwitchChevronDown from '../../../img/small-switch-chevron-down';
import {
  PersonNameLabelContainer,
  AuditDetailsLabelContainer,
  AuditTypeLabelContainer,
  DateTimeLabelContainer,
  SectionRow,
  HistoryLabel,
} from './NewTaskDrawer.HistorySection.Styled';

import palette from '../../../styles/palette';
import initializeTaskDrawerHistorySectionHooks from './NewTaskDrawer.HistorySection.Hooks';

const renderHistoryItem = ({
  auditId,
  taskHistoryDetails,
  taskHistoryType,
  createdDateTime,
  user,
}) => {
  const userName = user?.userName ?? '';
  const createdMoment = moment(createdDateTime);

  // This is where the History Event timeDate is formated.
  const formattedDate = createdMoment.isValid()
    ? createdMoment.format('MMM D, YYYY @ h:mma')
    : '';

  // const bottomRowData = `${formattedDate} by ${userName}`.trim();

  return (
    <Grid
      container
      item
      xs={12}
      alignItems="center"
      justify="space-between"
      key={auditId}
      style={{ margin: '10px 0' }}
    >
      <Grid container xs={9} alignItems="flex-start" justify="flex-start">
        <Grid container item xs={12}>
          <PersonNameLabelContainer>
            <RobotoTypography condensed variant="h4" color="inherit">
              {userName}
            </RobotoTypography>
          </PersonNameLabelContainer>
          <Spacing horizontal={2} />
          <AuditDetailsLabelContainer>
            <RobotoTypography condensed variant="h4" color="inherit">
              {taskHistoryDetails}
            </RobotoTypography>
          </AuditDetailsLabelContainer>
        </Grid>
        <DateTimeLabelContainer>
          <RobotoTypography condensed variant="h4" color="inherit">
            {formattedDate}
          </RobotoTypography>
        </DateTimeLabelContainer>
      </Grid>
      <Grid container item xs={3} alignItems="flex-end" justify="flex-end">
        <AuditTypeLabelContainer>
          <RobotoTypography condensed variant="h4" color="inherit">
            {taskHistoryType}
          </RobotoTypography>
        </AuditTypeLabelContainer>
      </Grid>
    </Grid>
    // <HistoryItemContainer key={auditId}>
    //   <HistoryLabel>{auditEventTypeDescription}</HistoryLabel>
    //   {bottomRowData && <HistorySublabel>{bottomRowData}</HistorySublabel>}
    // </HistoryItemContainer>
  );
};

const renderEmptyHistory = () => (
  <HistoryLabel>No history available</HistoryLabel>
);

const renderHistory = history => {
  if (history?.length === 0) {
    return renderEmptyHistory();
  }
  return history?.map(renderHistoryItem);
};

const HistorySection = ({ selectedTask }) => {
  const {
    currentUser,
    isHistoryShown,
    isHistoryLoading,
    history,
    onToggleHistoryButtonClicked,
    getFormattedEventDate,
  } = initializeTaskDrawerHistorySectionHooks({ selectedTask });

  const todaysDateString = getFormattedEventDate(new Date());

  const createdByUser = selectedTask ? selectedTask?.creator : currentUser;
  const createdDateTime = selectedTask
    ? getFormattedEventDate(new Date(selectedTask.createdDateTime))
    : todaysDateString;

  return (
    <>
      <Spacing vertical={2} />
      <Grid container item xs={12} alignItems="center" justify="space-between">
        <Grid
          container
          item
          xs={6}
          alignItems="flex-start"
          justify="flex-start"
        >
          <div
            onClick={
              isHistoryLoading ? undefined : onToggleHistoryButtonClicked
            }
          >
            <HorizontalLabel>HISTORY</HorizontalLabel>
            <Spacing horizontal={4} />
            {isHistoryShown ? (
              <SmallSwitchChevronUp color={palette.orangeJulius} />
            ) : (
              <SmallSwitchChevronDown color={palette.orangeJulius} />
            )}
          </div>
        </Grid>
        <Grid container item xs={6} alignItems="flex-end" justify="flex-end" />
      </Grid>
      <Spacing vertical={2} />
      {!isHistoryShown && (
        <Grid
          container
          item
          xs={12}
          alignItems="center"
          justify="space-between"
        >
          <Grid container xs={9} alignItems="flex-start" justify="flex-start">
            <Grid container item xs={12}>
              <PersonNameLabelContainer>
                <RobotoTypography condensed variant="h4" color="inherit">
                  {createdByUser?.firstName} {createdByUser?.lastName}
                </RobotoTypography>
              </PersonNameLabelContainer>
              <Spacing horizontal={2} />
              <AuditDetailsLabelContainer>
                <RobotoTypography condensed variant="h4" color="inherit">
                  created a task
                </RobotoTypography>
              </AuditDetailsLabelContainer>
            </Grid>
            <DateTimeLabelContainer>
              <RobotoTypography condensed variant="h4" color="inherit">
                {createdDateTime}
              </RobotoTypography>
            </DateTimeLabelContainer>
          </Grid>
          <Grid container item xs={3} alignItems="flex-end" justify="flex-end">
            <AuditTypeLabelContainer>
              <RobotoTypography condensed variant="h4" color="inherit">
                CREATED
              </RobotoTypography>
            </AuditTypeLabelContainer>
          </Grid>
        </Grid>
      )}
      {isHistoryShown && (
        <SectionRow>
          {/* <SectionLabel /> */}
          {/* <SectionButtonContainer> */}
          {isHistoryLoading ? (
            <CubesLoader size={16} />
          ) : (
            renderHistory(history)
          )}
          {/* </SectionButtonContainer> */}
        </SectionRow>
      )}
    </>
  );
};

export default HistorySection;
