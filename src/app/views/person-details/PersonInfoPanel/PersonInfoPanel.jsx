import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { removeUserFromOrganization } from 'api/organization-api';
import { openModal } from 'modal/actions';
import { showGlobalErrorAlert } from 'alert/actions';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import { formatPhoneNumber } from 'helpers/utility-functions';
import ArrowLeftIcon from 'img/arrow-left';
import { userProfileSelector } from 'selectors/user-selectors';
import { userDetailsSelector } from 'selectors/person-details-selectors';
import Spacing from 'components/common/Spacing';
import {
  ArchivePersonButton,
  InfoPanelContainer,
  PersonTitle,
  ContactInfoContainer,
  ContactInfoItem,
} from './styled';
import PersonInfoLoader from './PersonInfoLoader';

const PersonInfoPanel = () => {
  const dispatch = useDispatch();
  const userDetails = useSelector(userDetailsSelector);
  const {
    accountPhoneNumber,
    email,
    firstName,
    lastName,
    userIdentifier,
    workPhoneNumber,
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
          <UserAvatar
            user={userDetails}
            size={50}
            hideTooltip
            showOnlineIndicator={false}
          />
          <PersonTitle>{`${firstName} ${lastName}`}</PersonTitle>
          <ContactInfoContainer>
            {email && <ContactInfoItem>{email}</ContactInfoItem>}
            {accountPhoneNumber && (
              <ContactInfoItem>
                M {formatPhoneNumber(accountPhoneNumber)}
              </ContactInfoItem>
            )}
            {workPhoneNumber && (
              <ContactInfoItem>
                H {formatPhoneNumber(workPhoneNumber)}
              </ContactInfoItem>
            )}
          </ContactInfoContainer>
          {isAdminOrOwner && userIdentifier && (
            <>
              <ArchivePersonButton onClick={handleArchiveUser}>
                Archive this person
              </ArchivePersonButton>
            </>
          )}
        </>
      ) : (
        <PersonInfoLoader />
      )}
    </InfoPanelContainer>
  );
};

export default PersonInfoPanel;
