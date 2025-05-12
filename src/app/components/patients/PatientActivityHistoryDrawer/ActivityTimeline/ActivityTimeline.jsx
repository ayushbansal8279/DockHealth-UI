import React, { useState } from "react";
import { Timeline, TimelineItem, TimelineSeparator, TimelineContent } from "@mui/lab";
import { CardContent, Box, Popover, Typography, IconButton, Divider,} from "@mui/material";
import { Assignment, Note, AttachFile, Person } from "@mui/icons-material";
import { format, parseISO } from "date-fns";
import { 
  ActivityDescription, 
  ActivityName, 
  ActivityWrapper, 
  CommentContainer, 
  CommentDetails, 
  Container, 
  DateAndTime, 
  EditorWrapper, 
  FilterIcons, 
  MembersContainer, 
  NotesHistoryContainer, 
  TimelineCenterIcon, 
  TimelineCenterLine, 
  TimelineLeftSideContent, 
  TitleName,
  WorkflowIconContainer,
} from "./styled";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { OutfitTypography } from "@/app/styles/theme";
import Tooltip from "@/app/components/common/Tooltip/Tooltip";
import { getIconFromContentType } from "@/app/components/attachments/AttachmentButton/helpers";
import TaskItemMembers from "@/app/components/task/StandardTaskItem/TaskItemComponents/TaskItemMembers";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AttachmentPreview from "@/app/components/attachments/AttachmentPreview/AttachmentPreview";
import TemplatesIcon from 'img/navigation/TemplatesIcon';
import { useActivityTimeline } from "./hooks";
import CommentIcon from "@/app/components/task/TaskIcon/icons/CommentIcon";
import InfoIcon from '@mui/icons-material/Info';
import RichTextEditor from "@/app/components/common/RichTextEditor/RichTextEditor";

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
  } = useActivityTimeline(activities);
  
  const iconMapping = {
    PATIENT: <Person fontSize="verysmall" />,
    TASK: <TaskAltIcon fontSize="verysmall"/>,
    PATIENT_NOTE: <Note fontSize="verysmall"/>,
    ATTACHMENT: <AttachFile fontSize="verysmall"/>,
    TASK_GROUP: <WorkflowIconContainer><TemplatesIcon size={21} /></WorkflowIconContainer>,
    PATIENT_META_DATA: <Person fontSize="verysmall" />,
  };
  
  const activityFilters = [
    { type: "TASK", icon:  <TaskAltIcon fontSize="verysmall"/>, label: "Tasks" },
    { type: "PATIENT_NOTE", icon: <Note fontSize="verysmall" />, label: "Notes" },
    { type: "ATTACHMENT", icon: <AttachFile fontSize="verysmall" />, label: "Attachments" },
    { type: "PATIENT", icon: <Person fontSize="verysmall" />, label: "Patients" },
    { type: "TASK_GROUP", 
      icon: <WorkflowIconContainer filterIcon ><TemplatesIcon size={22} /></WorkflowIconContainer>, 
      label: "Workflow"
    }
  ];

  const AttachmentIcon = ({ contentType, fileType }) => {
    if (fileType === 'FOLDER') {
      return (
        <Box mt="-2px" mr={.5}>
          <FolderOpenIcon />
        </Box>
      );
    }
    const IconComponent = getIconFromContentType({ contentType: contentType || 'image' });
    return (
      <Box mt="-2px" mr={.5}>
        <IconComponent color="inherit" fontSize="small" />
      </Box>
    );
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedData, setSelectedData] = useState(null);

  const handleClick = (event, contextualData) => {
    setAnchorEl(event.currentTarget);
    console.log(contextualData)
    setSelectedData(contextualData)
  
    // const matchingActivity = sortedActivities.find(
    //   (act) =>
    //     act.targetTypeIdentifier === targetTypeIdentifier 
    // );
  
    // if (matchingActivity) {
    //   console.log("MATCH FOUND:", matchingActivity);
    // } else {
    //   console.log("No matching UPDATE_PATIENT_NOTE found.");
    // }
  };
  

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedData(null);
  };

  const open = Boolean(anchorEl);

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
                {format(parseISO(activity.activityDateTime), "MMM dd, yyyy")}
              </DateAndTime>
              <DateAndTime>
                {format(parseISO(activity.activityDateTime), "@ h:mma")}
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
                  {activity.targetType === "ATTACHMENT" && (
                    <>
                      {(activity.isGroupedAttachment ? activity.groupedAttachments : [activity]).map((attachment, index) => (
                        <Container
                          key={attachment.targetTypeIdentifier || index}
                          onClick={() => {
                            if(attachment.contextualData?.contentType){
                              openPreview(attachment.contextualData, attachment)
                            }}
                          }
                        >
                          <AttachmentIcon
                            contentType={attachment.contextualData?.contentType}
                            fileType={attachment.contextualData?.fileType}
                          />
                          <OutfitTypography condensed variant="h4" weight="bold" noWrap>
                            {attachment.description}
                          </OutfitTypography>
                        </Container>
                      ))}

                      <ActivityDescription>
                        <span><strong>Added By:</strong> {activity.activityPerformedBy?.userName}</span>
                      </ActivityDescription>
                    </>
                  )}
                  {(activity.targetType === "TASK" || activity.targetType === 'TASK_GROUP')  && (
                    <>
                      <ActivityName>{activity.description}</ActivityName>
                      <ActivityDescription>
                        { activity.targetType === "TASK" && 
                          <span><strong>Status:</strong> {activity.contextualData?.status || "Unknown"}</span>
                        }
                        <Tooltip title={activity.contextualData?.taskListName || "N/A"}>
                          <span><strong>List:</strong> {activity.contextualData?.taskListName || "N/A"}</span>
                        </Tooltip>
                      </ActivityDescription>
                      {activity?.contextualData?.assignedTo && (<MembersContainer>
                      <strong>Assigned To:</strong>
                        <TaskItemMembers
                          readOnly={true}
                          assignedToUsers={activity?.contextualData?.assignedTo}
                          maxIconDisplay={4}
                        />
                      </MembersContainer>)}
                    </>
                  )}
                  {activity?.targetType === "PATIENT_NOTE" && (
                    <>
                      <ActivityName>Note</ActivityName>
                      {activity?.actionType === 'UPDATE_PATIENT_NOTE' &&
                        <ActivityDescription>
                          <NotesHistoryContainer>
                            <Tooltip title={activity?.contextualData?.state?.current || "N/A"}>
                              {activity?.contextualData?.state?.current}                
                            </Tooltip>
                            <Tooltip title='More Info'>
                              <IconButton sx={{padding: '1px'}} onClick={(e)=>handleClick(e,activity?.contextualData)}>
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
                        >
                            <CommentContainer>
                              <CommentDetails>
                                <strong>Current:</strong>
                                <EditorWrapper>
                                <RichTextEditor
                                  readonly={true}
                                  value={selectedData?.state?.current}
                                  disableToolbar={true}
                                  showToolbar = {false}
                                />
                                </EditorWrapper>
                              </CommentDetails>
                              <Divider />
                              <CommentDetails>
                                <strong>Previous:</strong>
                                <EditorWrapper>
                                <RichTextEditor
                                  readonly={true}
                                  value={selectedData?.state?.previous}
                                  disableToolbar={true}
                                  showToolbar = {false}
                                />
                                </EditorWrapper>
                              </CommentDetails>
                            </CommentContainer>
                        </Popover>
                      </ActivityDescription>
                      }
                      <ActivityDescription>
                        <Tooltip title={activity.description || "N/A"}>
                          <span>{activity.description}</span>
                        </Tooltip>
                      </ActivityDescription>
                      <ActivityDescription>
                      <span>
                        <strong>{activity.actionType === "UPDATE_PATIENT_NOTE" ? "Updated By: " : "Created By: "}</strong>
                        {activity?.activityPerformedBy?.userName}
                      </span>
                      </ActivityDescription>
                    </>
                  )}
                  {activity.activityType === "PATIENT" && (
                    <>
                      <ActivityName>{activity.description || 'Patient Updated'}</ActivityName>
                      {Object.entries(activity.contextualData || {}).map(([key, value]) => (
                        value && (
                          <> 
                          <ActivityDescription key={key}>
                            <Tooltip title={`${key}: ${value.current} (current) ⟵ ${value.previous || 'NA'} (previous)`}>
                              <span><strong>{key}:</strong> {value.current}</span>
                            </Tooltip>
                          </ActivityDescription></>
                        )
                      ))}
                      <ActivityDescription>
                        <span>
                          <strong>{activity.actionType === "UPDATE_PATIENT" ? "Updated By:" : "Created By:"}</strong>{" "}
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