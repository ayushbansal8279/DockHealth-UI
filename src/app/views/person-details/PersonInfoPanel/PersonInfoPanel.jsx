import React from 'react';
import { useSelector } from 'react-redux';
import { useBoolean } from 'hooks/useBoolean';
import { Link } from 'react-router-dom';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import ArrowLeftIcon from 'img/arrow-left.svg';
import { userDetailsSelector } from 'selectors/person-details-selectors';
import Spacing from 'components/common/Spacing';
import { Box, Typography } from '@mui/material';
import Tooltip from 'components/common/Tooltip/Tooltip';
import EmailIcon from 'img/email-icon.svg';
import PhoneIcon from 'img/phone-icon.svg';
import MobileIcon from 'img/mobile-icon.svg';
import PersonInfoLoader from './PersonInfoLoader';
import PersonDetailsDrawer from '../PersonDetailsDrawer/PersonDetailsDrawer';
import {
  InfoPanelContainer,
  PersonTitle,
  ContactContainer,
  IconWrapper,
  HeaderActionButton,
  UserInfo,
  UserInfoDivider,
  CustomFieldsContainer,
} from './styled';

const PersonInfoPanel = () => {
  const [isDrawerOpen, openDrawer, closeDrawer] = useBoolean(false);
  const userDetails = useSelector(userDetailsSelector);
  const {
    accountPhoneNumber,
    email,
    firstName,
    lastName,
    workPhoneNumber,
    providerMetaData,
  } = userDetails || {};

  return (
    <>
      <InfoPanelContainer>
        <Link to="/core/people">
          <img
            src={ArrowLeftIcon}
            alt="back-navigation"
            style={{ width: '20px' }}
          />
        </Link>
        <Spacing horizontal={3} />
        {userDetails ? (
          <>
            <Box display="flex" justifyContent="space-between" flex="1">
              <Box display="flex" alignItems="center">
                <UserAvatar
                  user={userDetails}
                  size={50}
                  hideTooltip
                  showOnlineIndicator={false}
                />
                <PersonTitle>{`${firstName} ${lastName}`}</PersonTitle>
                <Box ml={2} display="flex">
                  <HeaderActionButton onClick={openDrawer}>
                    View details
                  </HeaderActionButton>
                </Box>
              </Box>
              <ContactContainer>
                {email && (
                  <Tooltip title={email} placement="bottom">
                    <IconWrapper href={`mailto:${email}`}>
                      <img
                        src={EmailIcon}
                        alt="email icon"
                        style={{ height: '16px' }}
                      />
                    </IconWrapper>
                  </Tooltip>
                )}
                {accountPhoneNumber && (
                  <Tooltip title={accountPhoneNumber} placement="bottom">
                    <IconWrapper href={`tel:${accountPhoneNumber}`}>
                      <img
                        src={PhoneIcon}
                        alt="phone icon"
                        style={{ height: '16px' }}
                      />
                    </IconWrapper>
                  </Tooltip>
                )}
                {workPhoneNumber && (
                  <Tooltip title={workPhoneNumber} placement="bottom">
                    <IconWrapper href={`tel:${workPhoneNumber}`}>
                      <img
                        src={MobileIcon}
                        alt="mobile phon icon"
                        style={{ height: '16px' }}
                      />
                    </IconWrapper>
                  </Tooltip>
                )}
              </ContactContainer>
            </Box>
            <CustomFieldsContainer>
              {providerMetaData
                ?.filter(
                  ({ displayOptions, value, values }) =>
                    displayOptions?.includes('PROVIDER_HEADER') &&
                    (value || values),
                )
                ?.map(
                  ({ customFieldName, displayName, value, displayNames }) => (
                    <>
                      <UserInfo>
                        <Typography>{customFieldName}: </Typography>
                        <Box ml={1} />
                        `${displayName || value || displayNames.join(', ')}`
                      </UserInfo>
                      <UserInfoDivider />
                    </>
                  ),
                )}
            </CustomFieldsContainer>
          </>
        ) : (
          <PersonInfoLoader />
        )}
      </InfoPanelContainer>
      {!!userDetails && (
        <PersonDetailsDrawer
          user={userDetails}
          isOpenedDetails={isDrawerOpen}
          closeDrawer={closeDrawer}
        />
      )}
    </>
  );
};

export default PersonInfoPanel;
