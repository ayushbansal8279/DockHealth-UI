import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { useMount } from 'react-use';
import {
  getUserAvatar,
  removeUserFromOrganization,
} from 'actions/people-actions';
import Avatar from 'components/common/Avatar/Avatar';
import { formatPhoneNumber, noop, showAlert } from 'helpers/utility-functions';
import palette from 'styles/palette';
import ArrowLeftIcon from 'img/arrow-left';
import Spacing from 'components/common/Spacing';
import {
  ArchivePersonButton,
  InfoPanelContainer,
  PersonImage,
  PersonTitle,
  ContactInfoContainer,
  ContactInfoItem,
} from './styled';
import PersonInfoLoader from './PersonInfoLoader';

const NOT_AVAILABLE = 'N/A';

const PersonInfoPanel = ({ personData, archivePerson }) => {
  const {
    accountPhoneNumber,
    email,
    firstName,
    lastName,
    userIdentifier,
    workPhoneNumber,
  } = personData || {};
  const history = useHistory();
  const [avatarContent, setAvatarContent] = useState(
    `${firstName.charAt(0)}${lastName.charAt(0)}`
      .trim()
      .toUpperCase()
      .replace(/^$/, NOT_AVAILABLE),
  );

  const orgUserRole = useSelector(
    store => store.userState.userProfile.orgUserRole,
  );

  const dispatch = useDispatch();

  const isAdminOrOwner = orgUserRole === 'ADMIN' || orgUserRole === 'OWNER';

  useMount(() => {
    if (userIdentifier && personData.profileThumbnailPictureHash) {
      getUserAvatar(personData)(dispatch)
        .then(image => {
          if (image?.byteLength !== 0) {
            setAvatarContent(<PersonImage alt="avatar" src={image} />);
          }
        })
        .catch(noop);
    }
  });

  const onConfirmArchive = () =>
    removeUserFromOrganization(userIdentifier)(dispatch)
      .then(() => {
        history.push('/people');
      })
      .catch(error => {
        showAlert({
          status: 'error',
          title: 'Error',
          text:
            error?.errorMessage ??
            'Could not archive this person, please try again later',
        });
      });

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
      {personData ? (
        <>
          <Avatar color={palette.unknownGrey5} size={50}>
            {avatarContent}
          </Avatar>
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
              <ArchivePersonButton
                onClick={() => archivePerson({ confirm: onConfirmArchive })}
              >
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

PersonInfoPanel.propTypes = {
  personData: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,
};

export default PersonInfoPanel;
