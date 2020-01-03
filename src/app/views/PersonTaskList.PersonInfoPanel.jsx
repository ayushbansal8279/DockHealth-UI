import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React, { useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hashHistory } from 'react-router';
import { useMount } from 'react-use';
import styled from 'styled-components';
import Swal from 'sweetalert2';

import {
  getUserAvatar,
  removeUserFromOrganization,
} from '../actions/people-actions';
import Avatar from '../components/common/Avatar';
import { formatPhoneNumber, noop } from '../helpers/utility-functions';

const NOT_AVAILABLE = 'N/A';

const InfoPanelContainer = styled.div`
  background-color: #fff;
  margin-top: 0.25rem;
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
    userId,
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

  const onArchivePersonButtonClick = useCallback(() => {
    removeUserFromOrganization(userId)(dispatch)
      .then(() => {
        hashHistory.push('/people');
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            error?.errorMessage ??
            'Could not archive this person, please try again later',
        });

        // fix z-index for swal container
        Swal.getContainer().style.zIndex = 10000;
      });
  }, [dispatch, userId]);

  const isAdminOrOwner = orgUserRole === 'ADMIN' || orgUserRole === 'OWNER';

  useMount(() => {
    if (userId) {
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
            <Avatar size={102}>{avatarContent}</Avatar>
          </PersonAvatarContainer>
          <PersonTitlesContainer>
            <BoldLabel>
              {lastName}, {firstName}
            </BoldLabel>
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
      {isAdminOrOwner && userId && (
        <>
          <hr />
          <Grid container item xs={12} justify="center">
            <ArchivePersonButton
              ref={archivePersonButtonReference}
              onClick={onArchivePersonButtonClick}
            >
              Archive this person
            </ArchivePersonButton>
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
