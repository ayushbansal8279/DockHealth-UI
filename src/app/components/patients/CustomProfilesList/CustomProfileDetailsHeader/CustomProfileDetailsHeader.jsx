import React, { useCallback } from 'react';
import { Box, Grid } from '@mui/material';
import { useHistory } from 'react-router-dom';
import ArrowLeftIcon from 'img/arrow-left.svg';
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
  profileTypeName,
  profileTypeIdentifier,
}) => {
  const handleViewDetailsClick = () => {
    onViewDetailsClick();
  };

  const history = useHistory();
  const goBack = useCallback(() => {
    history.push(
      `/custom-profiles/${profileTypeName}/${profileTypeIdentifier}`,
    );
  }, [history, profileTypeIdentifier, profileTypeName]);

  return (
    <ProfileDetailsContainer>
      <>
        <Box display="flex" alignItems="center">
          <Box flex="1 0 0" display="flex" alignItems="center">
            <Grid container alignItems="center">
              <Box flexBasis={30}>
                <button type="button" onClick={goBack}>
                  <img
                    src={ArrowLeftIcon}
                    alt="back-navigation"
                    style={{ width: '16px' }}
                  />
                </button>
              </Box>
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
