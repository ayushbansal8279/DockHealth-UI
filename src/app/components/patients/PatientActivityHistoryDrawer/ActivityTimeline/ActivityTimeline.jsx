import React, { useState, useMemo } from "react";
import { 
  Timeline, 
  TimelineItem, 
  TimelineSeparator,  
  TimelineContent,   
} from "@mui/lab";
import { CardContent, Box, Tooltip, Button } from "@mui/material";
import { Assignment, Note, AttachFile, Person } from "@mui/icons-material";
import { format, parseISO } from "date-fns";
import { 
  ActivityDescription, 
  ActivityName, 
  ActivityWrapper, 
  Container, 
  DateAndTime, 
  FilterIcons, 
  TimelineCenterIcon, 
  TimelineCenterLine, 
  TimelineLeftSideContent, 
  TitleName 
} from "./styled";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import Spacing from "@/app/components/common/Spacing";
import { OutfitTypography } from "@/app/styles/theme";

const iconMapping = {
  PATIENT: <Person fontSize="verysmall" sx={{ color: "white" }} />,
  TASK: <TaskAltIcon fontSize="verysmall"/>,
  PATIENT_NOTE: <Note fontSize="verysmall" sx={{ color: "white" }} />,
  ATTACHMENT: <AttachFile fontSize="verysmall" sx={{ color: "white" }} />,
};

const activityFilters = [
  { type: "TASK", icon:  <TaskAltIcon fontSize="verysmall"/>, label: "Tasks" },
  { type: "PATIENT_NOTE", icon: <Note fontSize="verysmall" />, label: "Notes" },
  { type: "ATTACHMENT", icon: <AttachFile fontSize="verysmall" />, label: "Attachments" },
  { type: "PATIENT", icon: <Person fontSize="verysmall" />, label: "Patients" },
];

const ActivityTimeline = ({ activities }) => {
  const [selectedFilters, setSelectedFilters] = useState([]);

  const sortedActivities = useMemo(() => {
    return activities
      .slice()
      .sort((a, b) => new Date(b.activityDateTime) - new Date(a.activityDateTime))
      .filter((activity) => 
        selectedFilters.length === 0 || selectedFilters.includes(activity.entityType)
      );
  }, [activities, selectedFilters]);

  const handleFilterClick = (type) => {
    setSelectedFilters((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
    );
  };

  return (
    <Box sx={{ pt: '12px' }}>
      {/* Filter Section */}
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

      {/* Timeline */}
      <Timeline sx={{ padding: 0, ml: '-15px' }}>
        {sortedActivities.map((activity, index) => (
          <TimelineItem key={activity.targetTypeIdentifier || index} sx={{ height: 'auto' }}>
            {/* Left Side: Date */}
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
                {iconMapping[activity.entityType] || <Assignment />}
              </TimelineCenterIcon>
              {index !== sortedActivities.length - 1 && <TimelineCenterLine />}
            </TimelineSeparator>

            {/* Right Side: Activity Details */}
            <TimelineContent sx={{ flex: 0.83, mt: '-13px', ml: '-12px' }}>
              <ActivityWrapper>
                <CardContent sx={{ p: 1, '&:last-child': { pb: 2 } }}>
                  {/* Conditional Rendering Based on entityType */}
                  {activity.entityType === "ATTACHMENT" && (
                    <Container>
                      {/* <IconComponent color="inherit" fontSize="small" /> */}
                      <Spacing horizontal={2} />
                      <OutfitTypography condensed variant="h4" weight="bold" noWrap>
                      {activity.name}
                      </OutfitTypography>
                    </Container>
                  )}

                  {activity.entityType === "TASK" && (
                    <>
                      <ActivityName>{activity.description}</ActivityName>
                      <ActivityDescription>
                        Status: {activity.contextualData?.status || "Unknown"} | List: {activity.contextualData?.taskListName || "N/A"}
                      </ActivityDescription>
                    </>
                  )}

                  {activity.entityType === "PATIENT_NOTE" && (
                    <>
                    <ActivityName>Note</ActivityName>
                    <ActivityDescription>{activity.description}</ActivityDescription>
                    </>
                  )}

                  {activity.entityType === "PATIENT" && (
                    <ActivityName>{activity.name}</ActivityName>
                  )}
                </CardContent>
              </ActivityWrapper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
};

export default ActivityTimeline;
