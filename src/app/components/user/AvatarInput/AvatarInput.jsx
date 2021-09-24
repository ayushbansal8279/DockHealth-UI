import React, { useRef, useState } from 'react';
import AvatarEdit from 'react-avatar-edit';
import { useBoolean } from 'hooks/useBoolean';
import palette from 'styles/palette';
import Avatar from 'components/user/Avatar/Avatar';
import Button from 'components/common/Button/Button';
import { Box, Popover } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import CameraIcon from 'img/camera.svg';
import {
  CloseIconButton,
  PictureInput,
  CameraIconContainer,
  UploadContainer,
  AvatarContainer,
  Title,
  EditButton,
} from './styled';

const AvatarInput = props => {
  const { pictureSrc, name, disabled, onChange, ...restProps } = props;
  const [popoverOpen, openPopover, closePopover] = useBoolean(false);
  const [loadedImage, setLoadedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const avatarReference = useRef(null);
  const inputReference = useRef(null);

  const handleFileChange = event => {
    const file = event.target?.files?.[0];
    const fileReader = new FileReader();

    fileReader.onloadend = async () => {
      setLoadedImage(fileReader.result);
    };

    if (file) {
      fileReader.readAsDataURL(file);
    }
  };

  const handleCropImage = () => {
    onChange(croppedImage);
    setCroppedImage(null);
    setLoadedImage(null);
    closePopover();
  };

  const handleUseInitialsClick = () => {
    onChange(null);
    setCroppedImage(null);
    setLoadedImage(null);
    closePopover();
  };

  return (
    <Box position="relative" width="fit-content" pr="20px">
      <Avatar
        ref={avatarReference}
        pictureSrc={pictureSrc}
        size={94}
        onClick={!disabled && openPopover}
        {...restProps}
      />
      <CameraIconContainer>
        <img src={CameraIcon} alt="Camera icon" />
      </CameraIconContainer>
      <Popover
        open={popoverOpen}
        anchorEl={avatarReference.current}
        onClose={closePopover}
        style={{ zIndex: 10000 }}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
      >
        <UploadContainer>
          <Title>
            {pictureSrc ? (
              'Try another picture'
            ) : (
              <>
                <span>Add a picture</span>
                <br />
                <span>to personalize your avatar</span>
              </>
            )}
          </Title>
          <Box p={1} />
          {loadedImage ? (
            <>
              <AvatarContainer>
                <AvatarEdit
                  src={loadedImage}
                  width={200}
                  height={200}
                  shadingColor={palette.darkGreyBlue}
                  onCrop={setCroppedImage}
                  onClose={() => setLoadedImage(null)}
                />
              </AvatarContainer>
              <Box p={1} />
              <Button onClick={handleCropImage}>Crop</Button>
            </>
          ) : (
            <>
              <AvatarContainer>
                <Box position="relative">
                  <Avatar pictureSrc={pictureSrc} size={110} {...restProps} />
                  {pictureSrc && (
                    <EditButton
                      type="button"
                      onClick={() => inputReference.current.click()}
                    >
                      Edit
                    </EditButton>
                  )}
                </Box>
              </AvatarContainer>
              <Box p={1} />
              {!pictureSrc ? (
                <Button onClick={() => inputReference.current.click()}>
                  Upload file
                </Button>
              ) : (
                <>
                  <Button onClick={closePopover}>I love it</Button>
                  <Box p={1} />
                  <Button variant="secondary" onClick={handleUseInitialsClick}>
                    Use initials
                  </Button>
                </>
              )}
            </>
          )}
          <PictureInput
            name={name}
            accept="image/png, image/jpeg"
            type="file"
            ref={inputReference}
            onChange={handleFileChange}
          />
        </UploadContainer>
        <CloseIconButton onClick={closePopover}>
          <CloseIcon />
        </CloseIconButton>
      </Popover>
    </Box>
  );
};

export default AvatarInput;
