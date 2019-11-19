import Grid from '@material-ui/core/Grid';
import React, { useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';

import * as userApi from '../../api/user-api';
import { noop } from '../../helpers/utilityFunctions';
import useBoolean from '../../hooks/useBoolean';
import ArrowUpIcon from '../../img/arrow-up.svg';
import Avatar from '../common/Avatar';
import { AvatarImageContainer } from '../common/Avatar.styled';
import CubesLoader from '../common/CubesLoader';
import {
  OuterAvatarContainer,
  PaddedButtonLabel,
  PlainLink,
  SmallButton,
  UploadImagePopover,
  UploadImagePopoverClose,
  UploadImagePopoverGrid,
  UploadImagePopoverLabel,
  UserAvatarSupplement,
} from './UserProfileView.Styled';

export default () => {
  const userProfile = useSelector(state => state.userState.userProfile);
  const userProfilePic = useSelector(state => state.userState.userProfilePic);

  const avatarRef = useRef(null);
  const fileInputRef = useRef(null);
  const [popoverOpen, setPopoverOpen, unsetPopoverOpen] = useBoolean(false);
  const [fileLoading, setFileLoading, unsetFileLoading] = useBoolean(false);
  const [fileLoaded, setFileLoaded, unsetFileLoaded] = useBoolean(false);

  const avatarInitials = userProfile
    ? `${userProfile.firstName[0]}${userProfile.lastName[0]}`
        .trim()
        .toUpperCase()
    : '';

  const avatarContent = userProfilePic ? (
    <AvatarImageContainer src={userProfilePic} alt="User profile picture" />
  ) : (
    avatarInitials
  );

  const openPopover = useCallback(() => {
    setPopoverOpen();
    unsetFileLoaded();
  });

  const activateFileInput = useCallback(() => {
    if (!fileLoading) {
      // eslint-disable-next-line no-unused-expressions
      fileInputRef.current?.click();
    }
  });

  const handleFileChanged = useCallback(event => {
    const file = event.target?.files?.[0];
    const fileReader = new FileReader();
    fileReader.onloadend = async () => {
      try {
        await userApi.saveUserProfilePic(fileReader.result);
        await userApi.getUserProfilePic(sessionStorage.userId, 'PROFILE');
        setFileLoaded();
      } catch {
        noop();
      } finally {
        unsetFileLoading();
      }
    };

    if (file) {
      fileReader.readAsArrayBuffer(file);
      setFileLoading();
    }
  });

  const removeProfilePicture = useCallback(event => {
    event.preventDefault();
    event.stopPropagation();

    if (!fileLoading) {
      setFileLoading();
      openPopover();
      userApi.deleteUserProfilePic().then(async () => {
        try {
          await userApi.getUserProfilePic(sessionStorage.userId, 'PROFILE');
          unsetPopoverOpen();
          unsetFileLoaded();
        } catch {
          noop();
        } finally {
          unsetFileLoading();
        }
      });
    }
  });

  const getSmallButtonContent = useCallback(() => {
    if (fileLoading) {
      return <CubesLoader size={20} color="#fff" />;
    }

    if (fileLoaded) {
      return <span>I love it</span>;
    }

    return (
      <>
        <img src={ArrowUpIcon} alt="Arrow up" />
        <PaddedButtonLabel>Upload image</PaddedButtonLabel>
      </>
    );
  });

  const popoverLabelContent = userProfilePic ? (
    <UploadImagePopoverLabel>Try another picture</UploadImagePopoverLabel>
  ) : (
    <>
      <UploadImagePopoverLabel>Add a picture</UploadImagePopoverLabel>
      <UploadImagePopoverLabel>
        to personalize your avatar
      </UploadImagePopoverLabel>
    </>
  );

  return (
    <>
      <OuterAvatarContainer>
        <Avatar
          avatarRef={avatarRef}
          onClick={openPopover}
          withCameraIcon
          withCursor
          withShadow
        >
          {avatarContent}
        </Avatar>
        {!userProfilePic && (
          <UserAvatarSupplement onClick={openPopover}>
            <div>Add a picture to</div>
            <div>personalize your avatar</div>
          </UserAvatarSupplement>
        )}
      </OuterAvatarContainer>
      <UploadImagePopover
        open={popoverOpen}
        anchorEl={avatarRef?.current}
        onClose={unsetPopoverOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 10,
          horizontal: 10,
        }}
        PaperProps={{
          square: true,
        }}
      >
        <UploadImagePopoverGrid container justify="center" spacing={32}>
          <Grid container item xs={12} alignItems="center" direction="column">
            {fileLoaded ? (
              <UploadImagePopoverLabel>
                {"That's a keeper!"}
              </UploadImagePopoverLabel>
            ) : (
              popoverLabelContent
            )}
          </Grid>
          <Grid container item xs={12} justify="center">
            <Avatar>{avatarContent}</Avatar>
          </Grid>
          <Grid container item xs={12} justify="center">
            <SmallButton
              disabled={fileLoading}
              onClick={fileLoaded ? unsetPopoverOpen : activateFileInput}
            >
              {getSmallButtonContent()}
              <input
                accept="image/png, image/jpeg"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChanged}
              />
            </SmallButton>
          </Grid>
          <Grid container item xs={12} spacing={8}>
            {fileLoaded && (
              <Grid container item xs={12} justify="center">
                <PlainLink
                  disabled={fileLoading}
                  onClick={event => {
                    event.preventDefault();
                    event.stopPropagation();

                    if (!fileLoading) {
                      activateFileInput();
                      openPopover();
                      setFileLoaded();
                    }
                  }}
                >
                  Try another picture
                </PlainLink>
              </Grid>
            )}
            {userProfilePic && (
              <Grid container item xs={12} justify="center">
                <PlainLink
                  disabled={fileLoading}
                  onClick={removeProfilePicture}
                >
                  Remove image and use my initials
                </PlainLink>
              </Grid>
            )}
          </Grid>
        </UploadImagePopoverGrid>
        <UploadImagePopoverClose onClick={unsetPopoverOpen}>
          &times;
        </UploadImagePopoverClose>
      </UploadImagePopover>
    </>
  );
};
