import React, { useState } from 'react';
import { Box, Divider, IconButton, InputAdornment, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  DrawerWrapper,
  TitleName,
  MoreActinsWrapper,
  StickyHeader,
  ContentWrapper,
  Searchbar,
} from './styled';
import ActivityTimeline from './ActivityTimeline/ActivityTimeline';
import SearchIcon from '@mui/icons-material/Search';


const PatientActivityHistoryDrawer = ({  title,  isOpen, onClose }) => {

  const [searchText, setSearchText] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const handleSearchToggle = () => {
    setShowSearch((prev) => {
      if (prev) setSearchText("");
      return !prev; 
    });
  };
  

  const handleClearSearch = () => {
    setSearchText("");
  };
  const patientActivities = [
    {
      "entityType": "ATTACHMENT",
      "name": "Medical_Report_123.pdf",
      "activityDateTime": "2025-03-31T14:05:25.000+00:00"
    },
    {
      "entityType": "TASK",
      "description": "Follow up with patient John Doe",
      "contextualData": {
        "status": "PENDING",
        "taskListName": "Follow-ups"
      },
      "activityDateTime": "2025-03-30T10:15:45.000+00:00"
    },
    {
      "entityType": "PATIENT_NOTE",
      "description": "Patient reported mild headache after medication.",
      "activityDateTime": "2025-03-29T08:30:20.000+00:00"
    },
    {
      "entityType": "PATIENT",
      "name": "Jane Smith",
      "activityDateTime": "2025-03-29T12:45:10.000+00:00"
    },
    {
      "entityType": "ATTACHMENT",
      "name": "XRay_Scan_Results.png",
      "activityDateTime": "2025-03-28T16:20:55.000+00:00"
    },
    {
      "entityType": "TASK",
      "description": "Schedule MRI scan",
      "contextualData": {
        "status": "IN_PROGRESS",
        "taskListName": "Imaging Requests"
      },
      "activityDateTime": "2025-03-28T14:50:30.000+00:00"
    },
    {
      "entityType": "PATIENT_NOTE",
      "description": "Advised to drink more water due to dehydration symptoms.",
      "activityDateTime": "2025-03-27T18:40:00.000+00:00"
    },
    {
      "entityType": "PATIENT",
      "name": "Michael Johnson",
      "activityDateTime": "2025-03-27T17:15:45.000+00:00"
    },
    {
      "entityType": "ATTACHMENT",
      "name": "Prescription_Dr_Smith.pdf",
      "activityDateTime": "2025-03-26T09:10:20.000+00:00"
    },
    {
      "entityType": "TASK",
      "description": "Complete insurance verification",
      "contextualData": {
        "status": "COMPLETE",
        "taskListName": "Billing"
      },
      "activityDateTime": "2025-03-25T11:55:33.000+00:00"
    },
    {
      "entityType": "PATIENT_NOTE",
      "description": "Patient experiencing minor back pain, suggested posture exercises.",
      "activityDateTime": "2025-03-24T15:40:10.000+00:00"
    },
    {
      "entityType": "PATIENT",
      "name": "Emily Carter",
      "activityDateTime": "2025-03-24T13:20:45.000+00:00"
    },
    {
      "entityType": "ATTACHMENT",
      "name": "Lab_Tests_Results_ABC123.pdf",
      "activityDateTime": "2025-03-23T07:30:50.000+00:00"
    },
    {
      "entityType": "TASK",
      "description": "Call patient to confirm appointment",
      "contextualData": {
        "status": "PENDING",
        "taskListName": "Appointments"
      },
      "activityDateTime": "2025-03-23T06:15:20.000+00:00"
    },
    {
      "entityType": "PATIENT_NOTE",
      "description": "Allergic reaction to prescribed medication observed.",
      "activityDateTime": "2025-03-22T20:10:30.000+00:00"
    },
    {
      "entityType": "PATIENT",
      "name": "Robert Brown",
      "activityDateTime": "2025-03-22T17:55:40.000+00:00"
    },
    {
      "entityType": "ATTACHMENT",
      "name": "Vaccination_Certificate.pdf",
      "activityDateTime": "2025-03-21T10:25:15.000+00:00"
    },
    {
      "entityType": "TASK",
      "description": "Update patient records in system",
      "contextualData": {
        "status": "IN_PROGRESS",
        "taskListName": "Admin"
      },
      "activityDateTime": "2025-03-20T08:05:10.000+00:00"
    },
    {
      "entityType": "PATIENT_NOTE",
      "description": "Patient recovering well from surgery, no complications noted.",
      "activityDateTime": "2025-03-19T19:45:00.000+00:00"
    },
    {
      "entityType": "PATIENT",
      "name": "Sophia Martinez",
      "activityDateTime": "2025-03-19T15:30:20.000+00:00"
    },
    {
      "entityType": "ATTACHMENT",
      "name": "ECG_Report.pdf",
      "activityDateTime": "2025-03-18T14:20:30.000+00:00"
    },
    {
      "entityType": "TASK",
      "description": "Order refill for prescribed medication",
      "contextualData": {
        "status": "PENDING",
        "taskListName": "Pharmacy"
      },
      "activityDateTime": "2025-03-17T09:40:15.000+00:00"
    },
    {
      "entityType": "PATIENT_NOTE",
      "description": "Recommended physiotherapy for muscle strain.",
      "activityDateTime": "2025-03-16T21:35:50.000+00:00"
    },
    {
      "entityType": "PATIENT",
      "name": "Liam Anderson",
      "activityDateTime": "2025-03-16T12:25:05.000+00:00"
    },
    {
      "entityType": "ATTACHMENT",
      "name": "Blood_Test_Results.pdf",
      "activityDateTime": "2025-03-15T11:10:55.000+00:00"
    },
    {
      "entityType": "TASK",
      "description": "Schedule follow-up consultation",
      "contextualData": {
        "status": "IN_PROGRESS",
        "taskListName": "Appointments"
      },
      "activityDateTime": "2025-03-14T13:55:30.000+00:00"
    },
    {
      "entityType": "PATIENT_NOTE",
      "description": "Dietary consultation recommended for weight management.",
      "activityDateTime": "2025-03-13T17:45:10.000+00:00"
    },
    {
      "entityType": "PATIENT",
      "name": "Olivia Wilson",
      "activityDateTime": "2025-03-13T09:30:45.000+00:00"
    }
  ];
  
  
      

  return (
    <DrawerWrapper open={isOpen} anchor="right" onClose={onClose}>
        <Box py={0.5} />
      <StickyHeader>
          <TitleName>{title}</TitleName>
        <MoreActinsWrapper>
        {showSearch ? (
            <Searchbar
              variant="standard"
              size="small"
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              autoFocus
              sx={{ width: 180 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon onClick={handleSearchToggle} style={{ cursor: 'pointer' }} />
                  </InputAdornment>
                ),
                endAdornment: searchText && (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClearSearch} size="small">
                      <CloseIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          ) : (
            <IconButton onClick={handleSearchToggle}>
              <SearchIcon />
            </IconButton>
          )}
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </MoreActinsWrapper>
      </StickyHeader>
      <Divider></Divider>
      <ContentWrapper>
        <ActivityTimeline activities={patientActivities}></ActivityTimeline>
      </ContentWrapper>
    </DrawerWrapper>
  );
};

export default PatientActivityHistoryDrawer