import React, { useEffect, useState } from 'react';
import { Box, Divider, IconButton, InputAdornment } from '@mui/material';
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
import { getPatientActivity } from '@/app/api/patient-api';

const PatientActivityHistoryDrawer = ({ patient, title, isOpen, onClose }) => {
  const [searchText, setSearchText] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [patientActivities, setPatientActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchToggle = () => {
    setShowSearch((prev) => {
      if (prev) setSearchText('');
      return !prev;
    });
  };

  const handleClearSearch = () => {
    setSearchText('');
  };

  const fetchPatientActivities = async () => {
    setIsLoading(true);
    try {
      const response = await getPatientActivity(patient?.patientIdentifier);
      setPatientActivities(response);
    } catch (error) {
      console.error('Failed to fetch patient activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPatientActivities();
    }
  }, [isOpen]);

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
                    <SearchIcon
                      onClick={handleSearchToggle}
                      style={{ cursor: 'pointer' }}
                    />
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
        <ActivityTimeline
          activities={patientActivities}
          isLoading={isLoading}
        ></ActivityTimeline>
      </ContentWrapper>
    </DrawerWrapper>
  );
};

export default PatientActivityHistoryDrawer;
