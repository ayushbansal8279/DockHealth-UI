import { Grid } from '@material-ui/core';
import React from 'react';
import AvatarEdit from 'react-avatar-edit';
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
    getSmallButtonOnClick,
    fileUploaded,
    unsetFileUploaded,
    handleFileCropped,
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
          ref={avatarReference}
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
        <UploadImagePopoverGrid container justify="center" spacing={4}>
          <Grid container item xs={12} alignItems="center" direction="column">
            {popoverLabelContent}
          </Grid>
          <Grid container item xs={12} justify="center">
            {fileLoaded ? (
              <AvatarEdit
                src={fileLoaded}
                width={200}
                height={200}
                shadingColor="#125375"
                onCrop={handleFileCropped}
                onClose={() => setFileLoaded(null)}
              />
            ) : (
              <Avatar>{avatarContent}</Avatar>
            )}
          </Grid>
          <Grid container item xs={12} justify="center">
            <SmallButton
              disabled={fileLoading}
              onClick={getSmallButtonOnClick()}
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
          <Grid container item xs={12} spacing={1}>
            {fileUploaded && (
              <Grid container item xs={12} justify="center">
                <PlainLink
                  disabled={fileLoading}
                  onClick={event => {
                    event.preventDefault();
                    event.stopPropagation();

                    if (!fileLoading) {
                      activateFileInput();
                      openPopover();
                      setFileLoaded(null);
                      unsetFileUploaded();
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
