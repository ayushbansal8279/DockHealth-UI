import React, { useState } from 'react';
import moment from 'moment';
import {
  Container,
  DescriptionContainer,
  Description,
  DateText,
  TypeText,
  DescriptionContent,
  DescriptionTooltipText,
  HistoryContainer,
} from './styled';
import Tooltip from '../../common/Tooltip/Tooltip';
import { processMarkdownValue } from '../Comment/helpers';
import { Divider, IconButton, Popover } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import {
  ActivityDescription,
  CommentContainer,
  CommentDetails,
  CommentText,
  CommentTextWrapper,
} from '../../patients/PatientActivityHistoryDrawer/ActivityTimeline/styled';

const HistoryItem = (props) => {
  const {
    date,
    type,
    currentState,
    previousState,
    auditEventType,
    userName,
    taskHistoryDetails,
  } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const handleClick = (event, contextualData) => {
    setAnchorEl(event.currentTarget);
    setSelectedData(contextualData);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setSelectedData(null);
  };

  const open = Boolean(anchorEl);

  const momentDate = moment(date);
  const formattedDate = momentDate.isValid()
    ? momentDate.format('MMM D, YYYY @ h:mma')
    : '';
  const description =
    auditEventType === 'UPDATE_TASK_DETAILS'
      ? `${userName} ${'updated task details'}`
      : `${userName} ${taskHistoryDetails}`;
  return (
    <Container>
      <DescriptionContainer>
        <Description>{description}</Description>
        {['UPDATE_TASK_DESCRIPTION', 'UPDATE_TASK_DETAILS'].includes(
          auditEventType,
        ) && (
          <ActivityDescription>
            <HistoryContainer>
              <Tooltip
                placement={'top'}
                title={
                  <DescriptionTooltipText>
                    {processMarkdownValue(currentState) || 'N/A'}
                  </DescriptionTooltipText>
                }
              >
                <DescriptionContent>
                  {processMarkdownValue(currentState)}
                </DescriptionContent>
              </Tooltip>
              <Tooltip title="More Info">
                <IconButton
                  sx={{ padding: '1px' }}
                  onClick={(e) =>
                    handleClick(e, { currentState, previousState })
                  }
                >
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </HistoryContainer>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              PaperProps={{
                sx: {
                  width: '475px',
                  maxWidth: '100%',
                },
              }}
            >
              <CommentContainer>
                <CommentDetails>
                  <strong>Current:</strong>
                  <CommentTextWrapper>
                    <CommentText>
                      {processMarkdownValue(selectedData?.currentState)}
                    </CommentText>
                  </CommentTextWrapper>
                </CommentDetails>
                <Divider />
                <CommentDetails>
                  <strong>Previous:</strong>
                  <CommentTextWrapper>
                    <CommentText>
                      {processMarkdownValue(selectedData?.previousState)}
                    </CommentText>
                  </CommentTextWrapper>
                </CommentDetails>
              </CommentContainer>
            </Popover>
          </ActivityDescription>
        )}
        {['UPDATE_COMMENT', 'CREATE_COMMENT', 'DELETE_COMMENT']?.includes(
          auditEventType,
        ) && (
          <ActivityDescription>
            <HistoryContainer>
              <Tooltip
                placement={'top'}
                title={
                  <DescriptionTooltipText>
                    {processMarkdownValue(currentState) || 'N/A'}
                  </DescriptionTooltipText>
                }
              >
                <DescriptionContent>
                  {processMarkdownValue(currentState)}
                </DescriptionContent>
              </Tooltip>
              {auditEventType === 'UPDATE_COMMENT' && (
                <Tooltip title="More Info">
                  <IconButton
                    sx={{ padding: '1px' }}
                    onClick={(e) =>
                      handleClick(e, { currentState, previousState })
                    }
                  >
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </HistoryContainer>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              PaperProps={{
                sx: {
                  width: '475px',
                  maxWidth: '100%',
                },
              }}
            >
              <CommentContainer>
                <CommentDetails>
                  <strong>Current:</strong>
                  <CommentTextWrapper>
                    <CommentText>
                      {processMarkdownValue(selectedData?.currentState)}
                    </CommentText>
                  </CommentTextWrapper>
                </CommentDetails>
                <Divider />
                <CommentDetails>
                  <strong>Previous:</strong>
                  <CommentTextWrapper>
                    <CommentText>
                      {processMarkdownValue(selectedData?.previousState)}
                    </CommentText>
                  </CommentTextWrapper>
                </CommentDetails>
              </CommentContainer>
            </Popover>
          </ActivityDescription>
        )}
        <DateText>{formattedDate}</DateText>
      </DescriptionContainer>
      <TypeText>{type}</TypeText>
    </Container>
  );
};

export default HistoryItem;
