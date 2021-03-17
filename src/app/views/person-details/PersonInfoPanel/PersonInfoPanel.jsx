import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { removeUserFromOrganization } from 'actions/people-actions';
import Member from 'components/members/Member/Member';
import { formatPhoneNumber, showAlert } from 'helpers/utility-functions';
import ArrowLeftIcon from 'img/arrow-left';
import Spacing from 'components/common/Spacing';
import {
  ArchivePersonButton,
  InfoPanelContainer,
  PersonTitle,
  ContactInfoContainer,
  ContactInfoItem,
} from './styled';
import PersonInfoLoader from './PersonInfoLoader';

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

  const orgUserRole = useSelector(
    store => store.userState.userProfile.orgUserRole,
  );

  const dispatch = useDispatch();

  const isAdminOrOwner = orgUserRole === 'ADMIN' || orgUserRole === 'OWNER';

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
          <Member
            member={personData}
            size={50}
            showTooltip={false}
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
