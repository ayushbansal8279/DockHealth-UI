import Grid from '@material-ui/core/Grid';
import React from 'react';

import Avatar from '../common/Avatar';
import initializeUserAvatarHooks from './UserAvatar.Hooks';
import {
  OuterAvatarContainer,
  PlainLink,
  SmallButton,
  UploadImagePopover,
  UploadImagePopoverClose,
  UploadImagePopoverGrid,
  UploadImagePopoverLabel,
  UserAvatarSupplement,
} from './UserProfileView.Styled';

export default () => {
  const {
    userProfilePic,
    avatarReference,
    fileInputReference,
    popoverOpen,
    unsetPopoverOpen,
    fileLoading,
    fileLoaded,
    setFileLoaded,
    openPopover,
    avatarContent,
    activateFileInput,
    handleFileChanged,
    removeProfilePicture,
    getSmallButtonContent,
  } = initializeUserAvatarHooks();

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
          avatarRef={avatarReference}
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
        anchorEl={avatarReference?.current}
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
                That&apos;s a keeper!
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
                ref={fileInputReference}
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
