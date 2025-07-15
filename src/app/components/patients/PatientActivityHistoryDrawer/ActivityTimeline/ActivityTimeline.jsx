import React, { useState } from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineContent,
} from '@mui/lab';
import { CardContent, Box, Popover, IconButton, Divider } from '@mui/material';
import { Assignment, Note, AttachFile, Person } from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import {
  ActivityDescription,
  ActivityName,
  ActivityWrapper,
  CommentContainer,
  CommentDetails,
  CommentText,
  CommentTextWrapper,
  Container,
  DateAndTime,
  FilterIcons,
  MembersContainer,
  NotesHistoryContainer,
  PatientNoteDescription,
  TimelineCenterIcon,
  TimelineCenterLine,
  TimelineLeftSideContent,
  TitleName,
  WorkflowIconContainer,
  PatientNoteTooltipText,
} from './styled';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { OutfitTypography } from '@/app/styles/theme';
import Tooltip from '@/app/components/common/Tooltip/Tooltip';
import { getIconFromContentType } from '@/app/components/attachments/AttachmentButton/helpers';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AttachmentPreview from '@/app/components/attachments/AttachmentPreview/AttachmentPreview';
import TemplatesIcon from 'img/navigation/TemplatesIcon';
import { useActivityTimeline } from './hooks';
import InfoIcon from '@mui/icons-material/Info';

const ActivityTimeline = ({ activities }) => {
  const {
    sortedActivities,
    selectedFilters,
    toggleFilter,
    openPreview,
    hideAttachmentPreview,
    previewedAttachment,
    attachmentsSources,
    isAttachmentPreviewOpen,
    attachmentsLoading,
    processMarkdownValue,
    activityLabels,
    activityPerformedType,
  } = useActivityTimeline(activities);

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

  const iconMapping = {
    PATIENT: <Person fontSize="verysmall" />,
    TASK: <TaskAltIcon fontSize="verysmall" />,
    PATIENT_NOTE: <Note fontSize="verysmall" />,
    ATTACHMENT: <AttachFile fontSize="verysmall" />,
    TASK_GROUP: (
      <WorkflowIconContainer>
        <TemplatesIcon size={21} />
      </WorkflowIconContainer>
    ),
    PATIENT_META_DATA: <Person fontSize="verysmall" />,
  };

  const activityFilters = [
    {
      type: 'TASK',
      icon: <TaskAltIcon fontSize="verysmall" />,
      label: 'Tasks',
    },
    {
      type: 'PATIENT_NOTE',
      icon: <Note fontSize="verysmall" />,
      label: 'Notes',
    },
    {
      type: 'ATTACHMENT',
      icon: <AttachFile fontSize="verysmall" />,
      label: 'Attachments',
    },
    {
      type: 'PATIENT',
      icon: <Person fontSize="verysmall" />,
      label: 'Patients',
    },
    {
      type: 'TASK_GROUP',
      icon: (
        <WorkflowIconContainer filterIcon>
          <TemplatesIcon size={22} />
        </WorkflowIconContainer>
      ),
      label: 'Workflow',
    },
  ];

  const AttachmentIcon = ({ contentType, fileType }) => {
    if (fileType === 'FOLDER') {
      return (
        <Box mt="-2px" mr={0.5}>
          <FolderOpenIcon fontSize="small" />
        </Box>
      );
    }
    const IconComponent = getIconFromContentType({
      contentType: contentType || 'image',
    });
    return (
      <Box mt="-2px" mr={0.5}>
        <IconComponent color="inherit" fontSize="small" />
      </Box>
    );
  };

  return (
    <Box sx={{ pt: '12px' }}>
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <TitleName>Filter By:</TitleName>
        <Box display="flex" alignItems="center" gap={1}>
          {activityFilters.map((filter) => (
            <Tooltip key={filter.type} title={filter.label}>
              <FilterIcons
                onClick={() => toggleFilter(filter.type)}
                selected={selectedFilters.includes(filter.type)}
              >
                {filter.icon}
              </FilterIcons>
            </Tooltip>
          ))}
        </Box>
      </Box>

      <Timeline sx={{ padding: 0, ml: '-15px' }}>
        {sortedActivities.map((activity, index) => (
          <TimelineItem key={index} sx={{ height: 'auto' }}>
            <TimelineLeftSideContent>
              <DateAndTime>
                {format(parseISO(activity.activityDateTime), 'MMM dd, yyyy')}
              </DateAndTime>
              <DateAndTime>
                {format(parseISO(activity.activityDateTime), '@ h:mma')}
              </DateAndTime>
            </TimelineLeftSideContent>

            <TimelineSeparator>
              <TimelineCenterIcon>
                {iconMapping[activity.targetType] || <Assignment />}
              </TimelineCenterIcon>
              {index !== sortedActivities.length - 1 && <TimelineCenterLine />}
            </TimelineSeparator>

            <TimelineContent sx={{ flex: 0.83, mt: '-13px', ml: '-12px' }}>
              <ActivityWrapper>
                <CardContent sx={{ p: 1, '&:last-child': { pb: 2 } }}>
                  {activity.targetType === 'ATTACHMENT' && (
                    <>
                      <ActivityName>
                        {activityLabels[activity?.actionType] || ''}
                      </ActivityName>
                      <Box mb={0.5} />
                      {(activity.isGroupedAttachment
                        ? activity.groupedAttachments
                        : [activity]
                      ).map((attachment, index) => (
                        <Tooltip
                          title={
                            attachment?.description ||
                            `${
                              attachment?.contextualData?.state?.current || 'NA'
                            } (current) ⟵
                         ${
                           attachment?.contextualData?.state?.previous || 'NA'
                         } (previous)`
                          }
                        >
                          <Container
                            key={attachment.targetTypeIdentifier || index}
                            onClick={() => {
                              if (attachment.contextualData?.contentType) {
                                openPreview(
                                  attachment.contextualData,
                                  attachment,
                                );
                              }
                            }}
                          >
                            <AttachmentIcon
                              contentType={
                                attachment.contextualData?.contentType
                              }
                              fileType={attachment.contextualData?.fileType}
                            />
                            <OutfitTypography
                              condensed
                              variant="h4"
                              weight="500"
                              noWrap
                            >
                              {attachment?.description ||
                                attachment?.contextualData?.state?.current}
                            </OutfitTypography>
                          </Container>
                        </Tooltip>
                      ))}

                      <ActivityDescription>
                        <span>
                          <strong>
                            {activityPerformedType(activity?.actionType)}
                          </strong>
                          {activity.activityPerformedBy?.userName}
                        </span>
                      </ActivityDescription>
                    </>
                  )}
                  {(activity.targetType === 'TASK' ||
                    activity.targetType === 'TASK_GROUP') && (
                    <>
                      <ActivityName>
                        {activityLabels[activity?.actionType] || ''}
                      </ActivityName>
                      <ActivityDescription>
                        <Tooltip title={activity?.description}>
                          <span>
                            <strong>
                              {activity?.targetType === 'TASK'
                                ? 'Task Name: '
                                : 'Workflow Name: '}
                            </strong>
                            {activity?.description}
                          </span>
                        </Tooltip>
                        <Tooltip
                          title={activity.contextualData?.taskListName || 'N/A'}
                        >
                          <span>
                            <strong>List:</strong>{' '}
                            {activity.contextualData?.taskListName || 'N/A'}
                          </span>
                        </Tooltip>
                      </ActivityDescription>
                      {activity?.contextualData?.assignedToName && (
                        <ActivityDescription>
                          <Tooltip
                            title={activity?.contextualData?.assignedToName}
                          >
                            <span>
                              <strong>Assigned To: </strong>
                              {activity?.contextualData?.assignedToName}
                            </span>
                          </Tooltip>
                          <span>
                            <strong>Assigned By: </strong>
                            {activity?.activityPerformedBy?.userName}
                          </span>
                        </ActivityDescription>
                      )}
                      {!activity?.contextualData?.assignedToName && (
                        <ActivityDescription>
                          <span>
                            <strong>
                              {activityPerformedType(activity?.actionType)}
                            </strong>{' '}
                            {activity?.activityPerformedBy?.userName}
                          </span>
                        </ActivityDescription>
                      )}
                    </>
                  )}
                  {activity?.targetType === 'PATIENT_NOTE' && (
                    <>
                      <ActivityName>
                        {activityLabels[activity?.actionType] || ''}
                      </ActivityName>
                      {activity?.actionType === 'UPDATE_PATIENT_NOTE' && (
                        <ActivityDescription>
                          <NotesHistoryContainer>
                            <Tooltip
                              placement={'left-start'}
                              title={
                                <PatientNoteTooltipText>
                                  {processMarkdownValue(
                                    activity?.contextualData?.state?.current,
                                  ) || 'N/A'}
                                </PatientNoteTooltipText>
                              }
                            >
                              <PatientNoteDescription>
                                {processMarkdownValue(
                                  activity?.contextualData?.state?.current,
                                )}
                              </PatientNoteDescription>
                            </Tooltip>
                            <Tooltip title="More Info">
                              <IconButton
                                sx={{ padding: '1px' }}
                                onClick={(e) =>
                                  handleClick(e, activity?.contextualData)
                                }
                              >
                                <InfoIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </NotesHistoryContainer>
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
                                    {processMarkdownValue(
                                      selectedData?.state?.current,
                                    )}
                                  </CommentText>
                                </CommentTextWrapper>
                              </CommentDetails>
                              <Divider />
                              <CommentDetails>
                                <strong>Previous:</strong>
                                <CommentTextWrapper>
                                  <CommentText>
                                    {processMarkdownValue(
                                      selectedData?.state?.previous,
                                    )}
                                  </CommentText>
                                </CommentTextWrapper>
                              </CommentDetails>
                            </CommentContainer>
                          </Popover>
                        </ActivityDescription>
                      )}
                      <ActivityDescription>
                        <Tooltip
                          placement={'left-start'}
                          title={
                            <PatientNoteTooltipText>
                              {processMarkdownValue(activity.description) ||
                                'N/A'}
                            </PatientNoteTooltipText>
                          }
                        >
                          <PatientNoteDescription>
                            {processMarkdownValue(activity.description)}
                          </PatientNoteDescription>
                        </Tooltip>
                      </ActivityDescription>
                      <ActivityDescription>
                        <span>
                          <strong>
                            {activityPerformedType(activity?.actionType)}
                          </strong>
                          {activity?.activityPerformedBy?.userName}
                        </span>
                      </ActivityDescription>
                    </>
                  )}
                  {activity.activityType === 'PATIENT' && (
                    <>
                      <ActivityName>
                        {activity.description
                          ? 'Patient Created'
                          : 'Patient Updated'}
                      </ActivityName>
                      {activity.description && (
                        <ActivityDescription>
                          <Tooltip title={activity.description}>
                            <span>
                              <strong>Patient Name:</strong>{' '}
                              {activity.description}
                            </span>
                          </Tooltip>
                        </ActivityDescription>
                      )}
                      {Object.entries(activity.contextualData || {}).map(
                        ([key, value]) =>
                          value && (
                            <>
                              <ActivityDescription key={key}>
                                <Tooltip
                                  title={`${key}: ${
                                    value.current
                                  } (current) ⟵ ${
                                    value.previous || 'NA'
                                  } (previous)`}
                                >
                                  <span>
                                    <strong>{key}:</strong> {value.current}
                                  </span>
                                </Tooltip>
                              </ActivityDescription>
                            </>
                          ),
                      )}
                      <ActivityDescription>
                        <span>
                          <strong>
                            {[
                              'UPDATE_PATIENT',
                              'SAVE_PATIENT_META_DATA',
                            ].includes(activity.actionType)
                              ? 'Updated By:'
                              : 'Created By:'}
                          </strong>{' '}
                          {activity?.activityPerformedBy?.userName}
                        </span>
                      </ActivityDescription>
                    </>
                  )}
                </CardContent>
              </ActivityWrapper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
      {isAttachmentPreviewOpen && (
        <AttachmentPreview
          attachment={previewedAttachment}
          attachmentsSources={attachmentsSources}
          hideAttachmentPreview={hideAttachmentPreview}
          isAttachmentPreviewOpen={isAttachmentPreviewOpen}
          attachmentsLoading={attachmentsLoading}
        />
      )}
    </Box>
  );
};

export default ActivityTimeline;
