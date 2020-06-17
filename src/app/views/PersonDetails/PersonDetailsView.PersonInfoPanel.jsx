import PropTypes from 'prop-types';
import React, { useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, hashHistory } from 'react-router';
import { useMount } from 'react-use';
import {
  getUserAvatar,
  removeUserFromOrganization,
} from 'actions/people-actions';
import Avatar from 'components/common/Avatar';
import ConfirmationDialog from 'components/modals/ConfirmationDialog';
import { formatPhoneNumber, noop, showAlert } from 'helpers/utility-functions';
import useBoolean from 'hooks/useBoolean';
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
} from './PersonDetailsView.PersonInfoPanel.Styled';

const NOT_AVAILABLE = 'N/A';

const PersonInfoPanel = ({ personData }) => {
  const {
    accountPhoneNumber,
    email,
    firstName,
    lastName,
    userIdentifier,
    workPhoneNumber,
  } = personData || {};

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
  const archivePersonButtonReference = useRef(null);

  const [isOpen, open, close] = useBoolean(false);

  const onArchivePersonButtonClick = useCallback(() => {
    open();
  }, [open]);

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

  const onConfirmArchivePersonButtonClick = useCallback(() => {
    removeUserFromOrganization(userIdentifier)(dispatch)
      .then(() => {
        hashHistory.push('/people');
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
    close();
  }, [close, dispatch, userIdentifier]);

  return (
    <InfoPanelContainer>
      <Link to="/people">
        <img src={ArrowLeftIcon} alt="back-navigation" />
      </Link>
      <Spacing horizontal={3} />
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
          <hr />
          <ArchivePersonButton
            ref={archivePersonButtonReference}
            onClick={onArchivePersonButtonClick}
          >
            Archive this person
          </ArchivePersonButton>
          <ConfirmationDialog
            isOpen={isOpen}
            close={close}
            confirm={onConfirmArchivePersonButtonClick}
            title="Archive person"
            message="This person will no longer have access to Dock Health. If this user is currently assigned any tasks, those tasks will become unassigned."
            confirmButtonTitle="Yes, archive person"
          />
        </>
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
