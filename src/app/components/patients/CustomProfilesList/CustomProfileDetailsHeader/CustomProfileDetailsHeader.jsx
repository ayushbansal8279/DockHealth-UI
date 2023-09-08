import React, { useCallback } from 'react';
import { Box, Grid } from '@mui/material';
import { useHistory } from 'react-router-dom';
import ArrowLeftIcon from 'img/arrow-left.svg';
import {
  ProfileDetailsContainer,
  ProfileName,
  ProfileDetailsLabel,
  ButtonContainer,
  ProfileDetails,
  ProfileDetailsInformation,
  ProfileInfo,
  ProfileInfoDivider,
} from './styled';

const CustomProfileDetailsHeader = ({
  onViewDetailsClick = () => {},
  firstName,
  lastName,
  middleName,
  header,
  profileTypeName,
  profileTypeIdentifier,
  children,
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
        <ProfileDetails>
          <ProfileDetailsInformation>
            {Object.entries(header).map(([name, value]) => (
              <>
                <ProfileInfo key={name} display="inline-block" py="1px">
                  {name}: {value}
                </ProfileInfo>
                <ProfileInfoDivider />
              </>
            ))}
          </ProfileDetailsInformation>
        </ProfileDetails>
        {children}
      </>
    </ProfileDetailsContainer>
  );
};

export default CustomProfileDetailsHeader;
