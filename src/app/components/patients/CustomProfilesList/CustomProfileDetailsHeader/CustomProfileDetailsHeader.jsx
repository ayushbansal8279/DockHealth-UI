import React from 'react';
import { Box, Grid } from '@mui/material';
import {
  ProfileDetailsContainer,
  ProfileName,
  ProfileDetailsLabel,
  ButtonContainer,
} from './styled';

const CustomProfileDetailsHeader = ({
  onViewDetailsClick = () => {},
  firstName,
  lastName,
  middleName,
}) => {
  const handleViewDetailsClick = () => {
    onViewDetailsClick();
  };

  return (
    <ProfileDetailsContainer>
      <>
        <Box display="flex" alignItems="center">
          <Box flex="1 0 0" display="flex" alignItems="center">
            <Grid container alignItems="center">
              <ProfileName>
                {[`${lastName},`, firstName, middleName].join(' ')}
              </ProfileName>
              <Box mx={1} />
              <ButtonContainer onClick={handleViewDetailsClick}>
                <ProfileDetailsLabel>View details</ProfileDetailsLabel>
              </ButtonContainer>
            </Grid>
          </Box>
        </Box>
      </>
    </ProfileDetailsContainer>
  );
};

export default CustomProfileDetailsHeader;
