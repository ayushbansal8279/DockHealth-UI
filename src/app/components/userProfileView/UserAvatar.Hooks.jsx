import React, { useCallback, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import * as userApi from '../../api/user-api';
import { noop } from '../../helpers/utility-functions';
import useBoolean from '../../hooks/useBoolean';
import ArrowUpIcon from '../../img/arrow-up.svg';
import palette from '../../palette';
import { AvatarImageContainer } from '../common/Avatar.styled';
import CubesLoader from '../common/CubesLoader';
import { PaddedButtonLabel } from './UserProfileView.Styled';

const getSmallButtonContent = ({
  fileLoaded,
  fileUploaded,
  fileLoading,
}) => () => {
  if (fileLoading) {
    return <CubesLoader size={20} color={palette.white} />;
  }

  if (fileLoaded) {
    return <span>Save</span>;
  }

  if (fileUploaded) {
    return <span>I love it</span>;
  }

  return (
    <>
      <img src={ArrowUpIcon} alt="Arrow up" />
      <PaddedButtonLabel>Upload image</PaddedButtonLabel>
    </>
  );
};

const getSmallButtonOnClick = ({
  fileLoaded,
  fileUploaded,
  fileLoading,
  handleFinishEditing,
  unsetPopoverOpen,
  activateFileInput,
}) => () => {
  if (fileLoading) {
    return undefined;
  }

  if (fileLoaded) {
    return handleFinishEditing;
  }

  if (fileUploaded) {
    return unsetPopoverOpen;
  }

  return activateFileInput;
};

export default () => {
  const userProfile = useSelector(state => state.userState.userProfile);
  const userProfilePic = useSelector(state => state.userState.userProfilePic);

  const avatarReference = useRef(null);
  const fileInputReference = useRef(null);
  const [popoverOpen, setPopoverOpen, unsetPopoverOpen] = useBoolean(false);
  const [fileLoading, setFileLoading, unsetFileLoading] = useBoolean(false);
  const [fileUploaded, setFileUploaded, unsetFileUploaded] = useBoolean(false);
  const [fileLoaded, setFileLoaded] = useState(null);
  const [fileCropped, setFileCropped] = useState(null);

  const avatarInitials = userProfile
    ? `${userProfile.firstName[0]}${userProfile.lastName[0]}`
        .trim()
        .toLowerCase()
    : '';

  const avatarContent = userProfilePic ? (
    <AvatarImageContainer src={userProfilePic} alt="User profile picture" />
  ) : (
    avatarInitials
  );

  const openPopover = useCallback(() => {
    setPopoverOpen();
    setFileCropped(null);
    setFileLoaded(null);
    unsetFileUploaded();
  }, [setPopoverOpen, unsetFileUploaded]);

  const activateFileInput = useCallback(() => {
    if (!fileLoading) {
      // eslint-disable-next-line no-unused-expressions
      fileInputReference.current?.click();
    }
  }, [fileLoading]);

  const handleFileCropped = useCallback(preview => {
    setFileCropped(preview);
  }, []);

  const handleFinishEditing = useCallback(() => {
    fetch(fileCropped)
      .then(response => response.arrayBuffer())
      .then(async arrayBuffer => {
        await userApi.saveUserProfilePic(arrayBuffer);
        await userApi.getUserProfilePic(
          sessionStorage.userIdentifier,
          'PROFILE',
        );
        setFileUploaded();
        setFileLoaded(null);
      });
  }, [fileCropped, setFileUploaded]);

  const handleFileChanged = useCallback(
    event => {
      const file = event.target?.files?.[0];
      const fileReader = new FileReader();
      fileReader.onloadend = async () => {
        try {
          setFileLoaded(fileReader.result);
        } catch {
          noop();
        } finally {
          unsetFileLoading();
        }
      };

      if (file) {
        fileReader.readAsDataURL(file);
        setFileLoading();
      }
    },
    [setFileLoaded, setFileLoading, unsetFileLoading],
  );

  const removeProfilePicture = useCallback(
    event => {
      event.preventDefault();
      event.stopPropagation();

      if (!fileLoading) {
        setFileLoading();
        openPopover();
        userApi.deleteUserProfilePic().then(async () => {
          try {
            await userApi.getUserProfilePic(
              sessionStorage.userIdentifier,
              'PROFILE',
            );
            unsetPopoverOpen();
            setFileLoaded(null);
          } catch {
            noop();
          } finally {
            unsetFileLoading();
          }
        });
      }
    },
    [
      fileLoading,
      openPopover,
      setFileLoading,
      setFileLoaded,
      unsetFileLoading,
      unsetPopoverOpen,
    ],
  );

  return {
    userProfile,
    userProfilePic,
    avatarReference,
    fileInputReference,
    popoverOpen,
    setPopoverOpen,
    unsetPopoverOpen,
    fileLoading,
    setFileLoading,
    unsetFileLoading,
    fileLoaded,
    setFileLoaded,
    avatarInitials,
    openPopover,
    avatarContent,
    activateFileInput,
    handleFileChanged,
    removeProfilePicture,
    getSmallButtonContent: getSmallButtonContent({
      fileLoaded,
      fileUploaded,
      fileLoading,
    }),
    getSmallButtonOnClick: getSmallButtonOnClick({
      fileLoaded,
      fileUploaded,
      fileLoading,
      activateFileInput,
      handleFinishEditing,
      unsetPopoverOpen,
    }),
    handleFileCropped,
    handleFinishEditing,
    fileUploaded,
    setFileUploaded,
    unsetFileUploaded,
  };
};
