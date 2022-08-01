import React, { useState } from 'react';
import IconButton from '@sendbird/uikit-react/ui/IconButton';
import Icon from '@sendbird/uikit-react/ui/Icon';
import { CreateChannelProvider } from '@sendbird/uikit-react/CreateChannel/context';
import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext';
import CustomCreateChannel from './CustomCreateChannel';
import IconTypes from './IconTypes';
import IconColors from './IconColors';

const CustomAddChannel = () => {
  const [showModal, setShowModal] = useState(false);
  const state = useSendbirdStateContext();
  const isOnline = state?.config?.isOnline;
  const disabled = !isOnline;

  return (
    <>
      <IconButton
        height="32px"
        width="32px"
        onClick={() => {
          setShowModal(true);
        }}
        disabled={disabled}
      >
        <Icon
          type={IconTypes.CREATE}
          fillColor={IconColors.PRIMARY}
          width="24px"
          height="24px"
        />
      </IconButton>
      {showModal && (
        <CreateChannelProvider
          onCreateChannel={() => {
            setShowModal(false);
          }}
        >
          <CustomCreateChannel
            onCancel={() => {
              setShowModal(false);
            }}
          />
        </CreateChannelProvider>
      )}
    </>
  );
};

export default CustomAddChannel;
