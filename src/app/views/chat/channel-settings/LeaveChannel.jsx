import React, { useCallback } from 'react';
import Modal from '@sendbird/uikit-react/ui/Modal';
import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext';
import { useDispatch, useSelector } from 'react-redux';
import { selectedChatChannelSelector } from 'selectors/sendbird-selectors';
import { selectChannel } from 'actions/sendbird-actions';

const LeaveChannel = (props) => {
  const { onSubmit, onCancel } = props;

  const channel = useSelector(selectedChatChannelSelector);
  const dispatch = useDispatch();
  const state = useSendbirdStateContext();
  const logger = state?.config?.logger;
  const isOnline = state?.config?.isOnline;

  const handleSubmitClicked = useCallback(() => {
    logger.info('ChannelSettings: Leaving channel', channel);
    channel.leave().then(() => {
      dispatch(selectChannel(null));
      onSubmit();
    });
  }, [channel, dispatch, logger, onSubmit]);

  if (channel) {
    return (
      <Modal
        disabled={!isOnline}
        onCancel={onCancel}
        onSubmit={handleSubmitClicked}
        submitText="Leave"
        titleText="Leave this Conversation?"
      />
    );
  }
  return <></>;
};

export default LeaveChannel;
