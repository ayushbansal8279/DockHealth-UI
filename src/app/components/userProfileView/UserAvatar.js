import Grid from '@material-ui/core/Grid';
import React, { useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';

import * as userApi from '../../api/user-api';
import { noop } from '../../helpers/utilityFunctions';
import useBoolean from '../../hooks/useBoolean';
import ArrowUpIcon from '../../img/arrow-up.svg';
import CameraIcon from '../../img/camera.svg';
import CubesLoader from '../common/CubesLoader';
import {
  AvatarContainer,
  AvatarImageContainer,
  CameraContainer,
  InnerAvatarContainer,
  SmallButton,
  UploadImagePopover,
  UploadImagePopoverClose,
  UploadImagePopoverGrid,
  UploadImagePopoverLabel,
  PlainLink,
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
    ? `${userProfile.firstName[0]}${userProfile.lastName[0]}`.trim()
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
        <span>Upload image</span>
      </>
    );
  });

  return (
    <>
      <AvatarContainer
        withCursor
        withShadow
        ref={avatarRef}
        onClick={openPopover}
      >
        <InnerAvatarContainer>{avatarContent}</InnerAvatarContainer>
        <CameraContainer>
          <img src={CameraIcon} alt="Camera" />
        </CameraContainer>
      </AvatarContainer>
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
              <>
                <UploadImagePopoverLabel>Add a picture</UploadImagePopoverLabel>
                <UploadImagePopoverLabel>
                  to personalize your avatar
                </UploadImagePopoverLabel>
              </>
            )}
          </Grid>
          <Grid container item xs={12} justify="center">
            <AvatarContainer>
              <InnerAvatarContainer>{avatarContent}</InnerAvatarContainer>
            </AvatarContainer>
          </Grid>
          <Grid container item xs={12} justify="center">
            <SmallButton
              disabled={fileLoading}
              onClick={fileLoaded ? unsetPopoverOpen : activateFileInput}
              padLabel
            >
              {getSmallButtonContent()}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChanged}
              />
            </SmallButton>
          </Grid>
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
        </UploadImagePopoverGrid>
        <UploadImagePopoverClose onClick={unsetPopoverOpen}>
          &times;
        </UploadImagePopoverClose>
      </UploadImagePopover>
    </>
  );
};
