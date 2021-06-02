import React, { useEffect } from 'react';
import { Box, Grid } from '@material-ui/core';
import * as UserApi from 'api/user-api';
import { useDispatch, useSelector } from 'react-redux';
import {
  userProfileSelector,
  userProfilePictureSelector,
} from 'selectors/user-selectors';
import * as TemplateActions from 'actions/template-actions';
import { openModal } from 'modal/actions';
import {
  ProfileSubmenuContainer,
  ReferButton,
  SubmenuDivider,
  Title,
  Top,
  UserName,
  BeforeIcon,
  UserImage,
  UserInitialCircle,
  SubMenuLink,
  BlueSubMenuLink,
} from './styled';

const ProfileSubmenu = () => {
  const dispatch = useDispatch();
  const { user, profilePicture } = useSelector(store => ({
    user: userProfileSelector(store),
    profilePicture: userProfilePictureSelector(store),
  }));
  const {
    userIdentifier,
    profilePictureHash,
    userName,
    titles,
    initials,
    bubbleColor,
  } = user || {};

  useEffect(() => {
    if (userIdentifier && profilePictureHash) {
      UserApi.getUserProfilePic(userIdentifier, 'PROFILE');
    }
  }, [userIdentifier, profilePictureHash]);

  const handleReferClick = () => {
    dispatch(TemplateActions.hideSubMenu());
    dispatch(openModal('ReferAColleague'));
  };

  return (
    <ProfileSubmenuContainer>
      <Grid container direction="column" alignItems="center">
        {user ? (
          <>
            <Top>
              <UserName>{userName?.trim()}</UserName>
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
            {profilePictureHash && profilePicture ? (
              <UserImage src={profilePicture} alt={userName} />
            ) : (
              <UserInitialCircle color={bubbleColor}>
                {initials}
              </UserInitialCircle>
            )}
            <Box m={2} />
            <SubMenuLink to="/settings/userprofile">Profile</SubMenuLink>
            <SubMenuLink to="/settings/documents">Agreements</SubMenuLink>
            <Box m={0.5} />
            <SubmenuDivider />
            <Box m={0.5} />
            <BlueSubMenuLink to="/auth/logout">Logout</BlueSubMenuLink>
          </>
        ) : null}
      </Grid>
      <ReferButton type="button" onClick={handleReferClick}>
        Refer a colleague
      </ReferButton>
    </ProfileSubmenuContainer>
  );
};

export default ProfileSubmenu;
