import React, { useCallback } from 'react';
import IconButton from '@sendbird/uikit-react/ui/IconButton';
import { openModal, closeModal } from 'modal/actions';
import Icon from '@sendbird/uikit-react/ui/Icon';
import { CreateChannelProvider } from '@sendbird/uikit-react/CreateChannel/context';
import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext';
import { useDispatch } from 'react-redux';
import IconTypes from './IconTypes';
import IconColors from './IconColors';

const CustomAddChannel = () => {
  const state = useSendbirdStateContext();
  const isOnline = state?.config?.isOnline;
  const disabled = !isOnline;

  const dispatch = useDispatch();

  const handleIconButtonClick = useCallback(() => {
    dispatch(
      openModal('InviteUsersToChannel', {
        onClose: () => {
          dispatch(closeModal());
        },
      }),
    );
  }, [dispatch]);

  return (
    <>
      <CreateChannelProvider>
        <IconButton
          height="32px"
          width="32px"
          onClick={handleIconButtonClick}
          disabled={disabled}
        >
          <Icon
            type={IconTypes.CREATE}
            fillColor={IconColors.PRIMARY}
            width="24px"
            height="24px"
          />
        </IconButton>
      </CreateChannelProvider>
    </>
  );
};

export default CustomAddChannel;
