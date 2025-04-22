import React, { useState, useMemo } from "react";
import { Timeline, TimelineItem, TimelineSeparator, TimelineContent } from "@mui/lab";
import { CardContent, Box,} from "@mui/material";
import { Assignment, Note, AttachFile, Person } from "@mui/icons-material";
import { format, parseISO } from "date-fns";
import { 
  ActivityDescription, 
  ActivityName, 
  ActivityWrapper, 
  Container, 
  DateAndTime, 
  FilterIcons, 
  MembersContainer, 
  TimelineCenterIcon, 
  TimelineCenterLine, 
  TimelineLeftSideContent, 
  TitleName 
} from "./styled";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { OutfitTypography } from "@/app/styles/theme";
import Tooltip from "@/app/components/common/Tooltip/Tooltip";
import { getIconFromContentType } from "@/app/components/attachments/AttachmentButton/helpers";
import TaskItemMembers from "@/app/components/task/StandardTaskItem/TaskItemComponents/TaskItemMembers";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { getMemoPatientAttachment } from "@/app/views/patient-details/PatientAttachments/hooks";
import AttachmentPreview from "@/app/components/attachments/AttachmentPreview/AttachmentPreview";

const iconMapping = {
  PATIENT: <Person fontSize="verysmall" />,
  TASK: <TaskAltIcon fontSize="verysmall"/>,
  PATIENT_NOTE: <Note fontSize="verysmall"/>,
  ATTACHMENT: <AttachFile fontSize="verysmall"/>,
};

const activityFilters = [
  { type: "TASK", icon:  <TaskAltIcon fontSize="verysmall"/>, label: "Tasks" },
  { type: "PATIENT_NOTE", icon: <Note fontSize="verysmall" />, label: "Notes" },
  { type: "ATTACHMENT", icon: <AttachFile fontSize="verysmall" />, label: "Attachments" },
  { type: "PATIENT", icon: <Person fontSize="verysmall" />, label: "Patients" },
];

const ActivityTimeline = ({ activities }) => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [previewedAttachment, setPreviewedAttachment] = useState(null);
  const [attachmentsSources, setAttachmentSources] = useState([]);
  const [isAttachmentPreviewOpen, setIsAttachmentPreviewOpen] = useState(false);
  const [attachmentsLoading, setAttachmentsLoading] = useState(false);

  const hideAttachmentPreview = () => setIsAttachmentPreviewOpen(false);

  const sortedActivities = useMemo(() => {
    const grouped = [];
    const attachmentsGroupMap = {};
  
    activities
      .slice()
      .sort((a, b) => new Date(b.activityDateTime) - new Date(a.activityDateTime))
      .forEach((activity) => {
        if (activity.targetType === "ATTACHMENT") {
          const key = format(parseISO(activity.activityDateTime), "yyyy-MM-dd HH:mm");
          if (!attachmentsGroupMap[key]) {
            attachmentsGroupMap[key] = [];
          }
          attachmentsGroupMap[key].push(activity);
        } else {
          grouped.push(activity);
        }
      });
  
    Object.values(attachmentsGroupMap).forEach((group) => {
      if (group.length === 1) {
        grouped.push(group[0]);
      } else {
        grouped.push({
          ...group[0],
          isGroupedAttachment: true,
          groupedAttachments: group,
        });
      }
    });
  
    return grouped
      .sort((a, b) => new Date(b.activityDateTime) - new Date(a.activityDateTime))
      .filter(
        (activity) =>
          selectedFilters.length === 0 ||
          selectedFilters.includes(activity.targetType)
      );
  }, [activities, selectedFilters]);
  

  const handleFilterClick = (type) => {
    setSelectedFilters((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
    );
  };

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

  const openPreview = async (contextualData, activity) => {
    try {
      const { targetTypeIdentifier } = activity;
      const { fileName, contentType } = contextualData;
  
      setAttachmentsLoading(true);
  
      const { data } = await getMemoPatientAttachment(targetTypeIdentifier);
  
      const fileSource = await new Promise((resolve, reject) => {
        const reader = new FileReader();
  
        reader.onloadend = () => {
          const result = reader.result?.replace(
            /data:[^;]+;base64/,
            `data:${contentType};base64`
          );
          resolve(result);
        };
  
        reader.onerror = () => reject(new Error("FileReader error"));
        reader.readAsDataURL(data);
      });
  
      const attachment = {
        attachmentIdentifier: targetTypeIdentifier,
        fileName,
        fileSource,
        contentType,
      };

      setPreviewedAttachment(attachment);
      setAttachmentSources([attachment]);
      setIsAttachmentPreviewOpen(true);
      setAttachmentsLoading(false);
    } catch (error) {
      setAttachmentsLoading(false);
      console.error("Failed to open preview:", error);
    }
  };
  
  return (
    <Box sx={{ pt: '12px' }}>
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <TitleName>Filter By:</TitleName>
        <Box display="flex" alignItems="center" gap={1}>
          {activityFilters.map((filter) => (
            <Tooltip key={filter.type} title={filter.label}>
              <FilterIcons 
                onClick={() => handleFilterClick(filter.type)} 
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
          <TimelineItem key={activity.targetTypeIdentifier || index} sx={{ height: 'auto' }}>
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
                  {activity.targetType === "ATTACHMENT" && !activity.isGroupedAttachment && (
                    <>
                      <Container
                        onClick={()=>{openPreview(activity?.contextualData,activity)}}
                      >
                        <AttachmentIcon
                          contentType={activity?.contextualData?.contentType}
                          fileType={activity?.contextualData?.fileType}
                        />
                        <OutfitTypography condensed variant="h4" weight="bold" noWrap>
                          {activity.name}
                        </OutfitTypography>
                      </Container>
                      <ActivityDescription>
                        <span><strong>Added By:</strong> {activity?.activityPerformedBy?.userName}</span>
                      </ActivityDescription>
                    </>
                    )}
                  {activity.isGroupedAttachment && (
                    <>
                      {activity.groupedAttachments.map((att, idx) => (
                        <Container key={att.targetTypeIdentifier || idx} onClick={() => openPreview(att.contextualData, att)}>
                          <AttachmentIcon
                            contentType={att.contextualData?.contentType}
                            fileType={att.contextualData?.fileType}
                          />
                          <OutfitTypography condensed variant="h4" weight="bold" noWrap>
                            {att.name}
                          </OutfitTypography>
                        </Container>
                      ))}
                      <ActivityDescription>
                        <span><strong>Added By:</strong> {activity.activityPerformedBy?.userName}</span>
                      </ActivityDescription>
                    </>
                  )}
                  {activity.targetType === "TASK" && (
                    <>
                      <ActivityName>{activity.description}</ActivityName>
                      <ActivityDescription>
                        <span><strong>Status:</strong> {activity.contextualData?.status || "Unknown"}</span>
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
                  {activity.targetType === "PATIENT_NOTE" && (
                    <>
                      <ActivityName>Note</ActivityName>
                      <ActivityDescription>
                        <Tooltip title={activity.description || "N/A"}>
                          <span>{activity.description}</span>
                        </Tooltip>
                      </ActivityDescription>
                      <ActivityDescription>
                      <span><strong>Created By:</strong> {activity?.activityPerformedBy?.userName}</span>
                      </ActivityDescription>
                    </>
                  )}
                  {activity.targetType === "PATIENT" && (
                    <>
                    <ActivityName>{activity.name}</ActivityName>
                    <ActivityDescription>
                      <span><strong>Created By:</strong> {activity?.activityPerformedBy?.userName}</span>
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