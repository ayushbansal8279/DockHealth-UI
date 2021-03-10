import React, { useCallback, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import * as UserApi from 'api/user-api';
import { noop } from 'helpers/utility-functions';
import useBoolean from 'hooks/useBoolean';
import ArrowUpIcon from 'img/arrow-up.svg';
import Loader, { LoaderSizes } from 'components/common/Loader/Loader';
import { PaddedButtonLabel } from './styled';

const getSmallButtonContent = ({
  fileLoaded,
  hasProfilePicture,
  fileLoading,
}) => () => {
  if (fileLoading) {
    return <Loader size={LoaderSizes.medium} />;
  }

  if (fileLoaded) {
    return <span>Save</span>;
  }

  if (hasProfilePicture) {
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
  hasProfilePicture,
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

  if (hasProfilePicture) {
    return unsetPopoverOpen;
  }

  return activateFileInput;
};

export default () => {
  const currentUser = useSelector(state => state.userState.userProfile);
  const hasProfilePicture = currentUser?.profileThumbnailPictureHash;

  const avatarButtonReference = useRef(null);
  const fileInputReference = useRef(null);
  const [popoverOpen, setPopoverOpen, unsetPopoverOpen] = useBoolean(false);
  const [fileLoading, setFileLoading, unsetFileLoading] = useBoolean(false);
  const [fileLoaded, setFileLoaded] = useState(null);
  const [fileCropped, setFileCropped] = useState(null);

  const openPopover = useCallback(() => {
    setPopoverOpen();
    setFileCropped(null);
    setFileLoaded(null);
  }, [setPopoverOpen]);

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
        await UserApi.saveUserProfilePic(arrayBuffer);
        await UserApi.getUserById();
        setFileLoaded(null);
      });
  }, [fileCropped]);

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
        UserApi.deleteUserProfilePic().then(async () => {
          try {
            await UserApi.getUserById();
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
    getSmallButtonContent: getSmallButtonContent({
      fileLoaded,
      hasProfilePicture,
      fileLoading,
    }),
    getSmallButtonOnClick: getSmallButtonOnClick({
      fileLoaded,
      hasProfilePicture,
      fileLoading,
      activateFileInput,
      handleFinishEditing,
      unsetPopoverOpen,
    }),
    handleFileCropped,
  };
};
