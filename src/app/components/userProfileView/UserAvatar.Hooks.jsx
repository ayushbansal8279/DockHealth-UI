import React, { useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';

import * as userApi from '../../api/user-api';
import { noop } from '../../helpers/utility-functions';
import useBoolean from '../../hooks/useBoolean';
import ArrowUpIcon from '../../img/arrow-up.svg';
import { AvatarImageContainer } from '../common/Avatar.styled';
import CubesLoader from '../common/CubesLoader';
import { PaddedButtonLabel } from './UserProfileView.Styled';

const getSmallButtonContent = ({ fileLoaded, fileLoading }) => () => {
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
};

export default () => {
  const userProfile = useSelector(state => state.userState.userProfile);
  const userProfilePic = useSelector(state => state.userState.userProfilePic);

  const avatarReference = useRef(null);
  const fileInputReference = useRef(null);
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
  }, [setPopoverOpen, unsetFileLoaded]);

  const activateFileInput = useCallback(() => {
    if (!fileLoading) {
      // eslint-disable-next-line no-unused-expressions
      fileInputReference.current?.click();
    }
  }, [fileLoading]);

  const handleFileChanged = useCallback(
    event => {
      const file = event.target?.files?.[0];
      const fileReader = new FileReader();
      fileReader.onloadend = async () => {
        try {
          await userApi.saveUserProfilePic(fileReader.result);
          await userApi.getUserProfilePic(sessionStorage.userIdentifier, 'PROFILE');
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
            await userApi.getUserProfilePic(sessionStorage.userIdentifier, 'PROFILE');
            unsetPopoverOpen();
            unsetFileLoaded();
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
      unsetFileLoaded,
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
    unsetFileLoaded,
    avatarInitials,
    openPopover,
    avatarContent,
    activateFileInput,
    handleFileChanged,
    removeProfilePicture,
    getSmallButtonContent: getSmallButtonContent({ fileLoaded, fileLoading }),
  };
};
