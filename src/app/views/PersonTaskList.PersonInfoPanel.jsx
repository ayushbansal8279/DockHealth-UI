import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React, { useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hashHistory } from 'react-router';
import { useMount } from 'react-use';
import styled from 'styled-components';
import {
  getUserAvatar,
  removeUserFromOrganization,
} from '../actions/people-actions';
import Avatar from '../components/common/Avatar';
import ConfirmationDialog from '../components/modals/ConfirmationDialog';
import {
  formatPhoneNumber,
  noop,
  showAlert,
} from '../helpers/utility-functions';
import useBoolean from '../hooks/useBoolean';

const NOT_AVAILABLE = 'N/A';

const InfoPanelContainer = styled.div`
  background-color: #fff;
  margin: 0.5rem 0;
  max-width: 1050px;
  padding: 1rem;
  width: 100%;
`;

const PersonNameContainer = styled(Grid).attrs({
  container: true,
  direction: 'row',
  item: true,
  md: 5,
  sm: 12,
  wrap: 'nowrap',
})`
  padding: 1.375rem;
`;

const PersonInitialsContainer = styled.span`
  color: #fff;
  font-size: 1.875rem;
  font-weight: bold;
`;

const PersonTitlesContainer = styled(Grid).attrs({
  container: true,
  direction: 'column',
  justify: 'center',
})`
  padding-left: 1.375rem;
`;

const Label = styled.span`
  font-size: 1rem;
  display: block;
  line-height: 1.2;
  margin: 0.125rem 0;
`;

const GreyLabel = styled(Label)`
  color: #ababb2;
`;

const BoldLabel = styled(Label)`
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.4;
`;

const PersonAvatarContainer = styled.div`
  min-width: 102px;
  width: 102px;
`;

const ArchivePersonButton = styled.button`
  color: #0ca1c7;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    filter: brightness(1.25);
  }
`;

const PersonInfoPanel = ({ personData }) => {
  const {
    accountPhoneNumber,
    email,
    firstName,
    lastName,
    specialtyList,
    userIdentifier,
    workPhoneNumber,
  } = personData || {};

  const [avatarContent, setAvatarContent] = useState(
    <PersonInitialsContainer>
      {`${firstName.charAt(0)}${lastName.charAt(0)}`
        .trim()
        .toUpperCase()
        .replace(/^$/, NOT_AVAILABLE)}
    </PersonInitialsContainer>,
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

  useMount(() => {
    if (userIdentifier) {
      getUserAvatar(personData)(dispatch)
        .then(image => {
          if (image) {
            setAvatarContent(<img alt="avatar" src={image} />);
          }
        })
        .catch(noop);
    }
  });

  return (
    <InfoPanelContainer>
      <Grid container alignItems="center">
        <PersonNameContainer>
          <PersonAvatarContainer>
            <Avatar color="#ababb2" size={102}>
              {avatarContent}
            </Avatar>
          </PersonAvatarContainer>
          <PersonTitlesContainer>
            <BoldLabel>{`${firstName} ${lastName}`}</BoldLabel>
            <GreyLabel>{specialtyList}</GreyLabel>
          </PersonTitlesContainer>
        </PersonNameContainer>
        <Grid container item sm={12} md={7} alignItems="center" spacing={16}>
          <Grid container item sm={12} md={5} direction="column">
            <GreyLabel>Mobile</GreyLabel>
            <Label>
              {formatPhoneNumber(accountPhoneNumber) || NOT_AVAILABLE}
            </Label>
          </Grid>
          <Grid container item sm={12} md={7} direction="column">
            <GreyLabel>Additional phone number</GreyLabel>
            <Label>{formatPhoneNumber(workPhoneNumber) || NOT_AVAILABLE}</Label>
          </Grid>
          <Grid container item xs={12} direction="column">
            <GreyLabel>Email</GreyLabel>
            <Label>{email}</Label>
          </Grid>
        </Grid>
      </Grid>
      {isAdminOrOwner && userIdentifier && (
        <>
          <hr />
          <Grid container item xs={12} justify="center">
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
          </Grid>
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
