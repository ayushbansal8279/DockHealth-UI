import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useBoolean } from 'hooks/useBoolean';
import { Link, useHistory } from 'react-router-dom';
import { removeUserFromOrganization } from 'api/organization-api';
import { openModal } from 'modal/actions';
import { showGlobalErrorAlert } from 'alert/actions';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import ArrowLeftIcon from 'img/arrow-left';
import { userProfileSelector } from 'selectors/user-selectors';
import { userDetailsSelector } from 'selectors/person-details-selectors';
import Spacing from 'components/common/Spacing';
import { Box, Typography } from '@material-ui/core';
import Tooltip from 'components/common/Tooltip/Tooltip';
import EmailIcon from 'img/email-icon.svg';
import PhoneIcon from 'img/phone-icon.svg';
import MobileIcon from 'img/mobile-icon.svg';
import TextTypeHeader from 'components/common/TextTypeHeader/TextTypeHeader';
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
  const dispatch = useDispatch();
  const [isDrawerOpen, openDrawer, closeDrawer] = useBoolean(false);
  const userDetails = useSelector(userDetailsSelector);
  const {
    accountPhoneNumber,
    email,
    firstName,
    lastName,
    userIdentifier,
    workPhoneNumber,
    userMetaData,
  } = userDetails || {};
  const history = useHistory();

  const { orgUserRole } = useSelector(userProfileSelector);

  const isAdminOrOwner = orgUserRole === 'ADMIN' || orgUserRole === 'OWNER';

  const handleArchiveUser = () => {
    dispatch(
      openModal('ArchivePerson', {
        confirm: () => {
          removeUserFromOrganization(userIdentifier)
            .then(() => {
              history.push('/people');
            })
            .catch(error => {
              dispatch(
                showGlobalErrorAlert(
                  error?.errorMessage ??
                    'Could not archive this person, please try again later',
                ),
              );
            });
        },
      }),
    );
  };

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
                {isAdminOrOwner && userIdentifier && (
                  <Box ml={2} display="flex">
                    <HeaderActionButton onClick={handleArchiveUser}>
                      Archive this person
                    </HeaderActionButton>
                    <Box mx={1} />
                    <HeaderActionButton onClick={openDrawer}>
                      View details
                    </HeaderActionButton>
                  </Box>
                )}
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
              {userMetaData
                ?.filter(
                  ({ displayOptions, value }) =>
                    displayOptions?.includes('PROVIDER_HEADER') && value,
                )
                ?.map(({ customFieldName, displayName, value }) => (
                  <>
                    <UserInfo>
                      <Typography>{customFieldName}: </Typography>
                      <Box ml={1} />
                      <TextTypeHeader text={displayName || value} />
                    </UserInfo>
                    <UserInfoDivider />
                  </>
                ))}
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
