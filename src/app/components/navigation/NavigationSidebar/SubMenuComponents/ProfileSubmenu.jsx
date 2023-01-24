import React from 'react';
import { Box, Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import {
  userProfileSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import { getUserAvatarUrl, hasProfilePicture } from 'helpers/user-helper';
import * as TemplateActions from 'actions/template-actions';
import {
  ProfileSubmenuContainer,
  SubmenuDivider,
  Title,
  Top,
  UserName,
  BeforeIcon,
  UserImage,
  UserInitialCircle,
  SubMenuLink,
  BlueSubMenuLink,
  Version,
} from './styled';

const ProfileSubmenu = () => {
  const dispatch = useDispatch();
  const userProfile = useSelector(userProfileSelector);
  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const { name, titles, initials, bubbleColor } = userProfile || {};

  const whiteLabelEnabled = currentOrganization?.whiteLabelEnabled || false;
  const embeddedMode = sessionStorage.getItem('EmbeddedMode') || false;

  return (
    <ProfileSubmenuContainer>
      <Grid container direction="column" alignItems="center">
        {userProfile ? (
          <>
            <Top>
              <UserName>{name?.trim()}</UserName>
              <button
                type="button"
                onClick={() => dispatch(TemplateActions.hideSubMenu())}
              >
                <BeforeIcon />
              </button>
            </Top>
            <Title>{titles[0]?.name}</Title>
            <Box m={1} />
            <SubmenuDivider />
            <Box m={1} />
            {hasProfilePicture(userProfile) ? (
              <UserImage src={getUserAvatarUrl(userProfile)} alt={name} />
            ) : (
              <UserInitialCircle color={bubbleColor}>
                {initials}
              </UserInitialCircle>
            )}
            <Box m={2} />
            <SubMenuLink to="/settings/userprofile">Profile</SubMenuLink>
            {!whiteLabelEnabled && (
              <SubMenuLink to="/settings/documents">Agreements</SubMenuLink>
            )}
            <Box m={0.5} />
            <SubmenuDivider />
            <Box m={0.5} />
            {!embeddedMode && (
              <BlueSubMenuLink to="/auth/logout">Logout</BlueSubMenuLink>
            )}
            <Version>App Version: {process.env.VERSION || '0.0.0'}</Version>
          </>
        ) : null}
      </Grid>
    </ProfileSubmenuContainer>
  );
};

export default ProfileSubmenu;
