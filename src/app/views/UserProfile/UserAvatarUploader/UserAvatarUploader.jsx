import { Grid } from '@material-ui/core';
import React from 'react';
import AvatarEdit from 'react-avatar-edit';
import palette from 'styles/palette';
import CameraIcon from 'img/camera.svg';
import Member from 'components/members/Member/Member';
import initializeUserAvatarHooks from './hooks';
import {
  OuterAvatarContainer,
  PlainLink,
  SmallButton,
  UploadImagePopover,
  UploadImagePopoverClose,
  UploadImagePopoverGrid,
  UploadImagePopoverLabel,
  UserAvatarSupplement,
  EditButton,
  PictureInput,
  AvatarContainer,
  CameraContainer,
  AvatarButton,
} from './styled';

export default () => {
  const {
    currentUser,
    hasProfilePicture,
    avatarButtonReference,
    fileInputReference,
    popoverOpen,
    unsetPopoverOpen,
    fileLoading,
    fileLoaded,
    setFileLoaded,
    openPopover,
    activateFileInput,
    handleFileChanged,
    removeProfilePicture,
    getSmallButtonContent,
    getSmallButtonOnClick,
    handleFileCropped,
  } = initializeUserAvatarHooks();

  const popoverLabelContent = hasProfilePicture ? (
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
        <AvatarButton
          type="button"
          ref={avatarButtonReference}
          onClick={openPopover}
        >
          <Member
            member={currentUser}
            color={palette.midnightBlue}
            size={110}
            showTooltip={false}
            showOnlineIndicator={false}
          />
          <CameraContainer>
            <img src={CameraIcon} alt="Camera icon" />
          </CameraContainer>
        </AvatarButton>
        {!hasProfilePicture && (
          <UserAvatarSupplement onClick={openPopover}>
            <div>Add a picture to</div>
            <div>personalize your avatar</div>
          </UserAvatarSupplement>
        )}
      </OuterAvatarContainer>
      <UploadImagePopover
        open={popoverOpen}
        anchorEl={avatarButtonReference?.current}
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
                shadingColor={palette.darkGreyBlue}
                onCrop={handleFileCropped}
                onClose={() => setFileLoaded(null)}
              />
            ) : (
              <AvatarContainer>
                <Member
                  member={currentUser}
                  color={palette.midnightBlue}
                  size={110}
                  showTooltip={false}
                  showOnlineIndicator={false}
                />
                {hasProfilePicture && (
                  <EditButton type="button" onClick={activateFileInput}>
                    Edit
                  </EditButton>
                )}
              </AvatarContainer>
            )}
          </Grid>
          <Grid container item xs={12} justify="center">
            <SmallButton
              disabled={fileLoading}
              onClick={getSmallButtonOnClick()}
            >
              {getSmallButtonContent()}
            </SmallButton>
          </Grid>
          <PictureInput
            accept="image/png, image/jpeg"
            type="file"
            ref={fileInputReference}
            onChange={handleFileChanged}
          />
          {hasProfilePicture && !fileLoaded && (
            <Grid container item xs={12} spacing={1}>
              <Grid container item xs={12} justify="center">
                <PlainLink
                  disabled={fileLoading}
                  onClick={removeProfilePicture}
                >
                  Use initials
                </PlainLink>
              </Grid>
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
