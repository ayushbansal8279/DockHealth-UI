import React, { useState, useRef, useContext, useCallback } from 'react';
import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext';
import Modal from '@sendbird/uikit-react/ui/Modal';
import Input from '@sendbird/uikit-react/ui/Input';
import Avatar from '@sendbird/uikit-react/ui/Avatar';
import Label from '@sendbird/uikit-react/ui/Label';
import { InputLabel } from '@material-ui/core';
import TextButton from '@sendbird/uikit-react/ui/TextButton';
import ChannelAvatar from '@sendbird/uikit-react/ui/ChannelAvatar';
import sendBirdSelectors from '@sendbird/uikit-react/sendBirdSelectors';
import ChannelSettingsContext from './ChannelSettingsContext';
import { LocalizationContext } from '../channel/ChannelLocalizationContext';
import { Colors, Typography } from './LabelTypography';
import { Type } from './ButtonType';

const EditDetails = props => {
  const { onSubmit, onCancel } = props;

  const { channel, onBeforeUpdateChannel } = useContext(ChannelSettingsContext);

  const title = channel?.name !== 'Group Channel' ? channel?.name : '';

  const state = useSendbirdStateContext();
  const userId = state?.config?.userId;
  const theme = state?.config?.theme;
  const logger = state?.config?.logger;

  const inputReference = useRef(null);
  const formReference = useRef(null);
  const hiddenInputReference = useRef(null);
  const [currentImg, setCurrentImg] = useState(null);
  const [newFile, setNewFile] = useState(null);
  const { stringSet } = useContext(LocalizationContext);

  const globalStore = useSendbirdStateContext();
  const sdkInstance = sendBirdSelectors.getSdk(globalStore);

  const handleSubmit = useCallback(async () => {
    if (title !== '' && !inputReference.current.value) {
      if (formReference.current.reportValidity) {
        formReference.current.reportValidity();
      }
      return;
    }

    const currentTitle = inputReference.current.value;
    setCurrentImg(newFile);
    logger.info('ChannelSettings: Channel information being updated', {
      currentTitle,
      currentImg,
    });
    if (onBeforeUpdateChannel) {
      logger.info('ChannelSettings: onBeforeUpdateChannel');
      const parameters = onBeforeUpdateChannel(
        currentTitle,
        currentImg,
        channel?.data,
      );
      await channel.updateChannel(parameters);
    } else if (sdkInstance) {
      logger.info('ChannelSettings: normal');
      const parameters = new sdkInstance.GroupChannelParams();
      parameters.name = currentTitle;
      channel
        .updateChannel(parameters)

        .then(groupChannel => {
          logger.info(
            'ChannelSettings: Channel information updated',
            groupChannel,
          );
          onSubmit();
        });
    }
  }, [
    channel,
    currentImg,
    logger,
    newFile,
    onBeforeUpdateChannel,
    onSubmit,
    sdkInstance,
    title,
  ]);

  return (
    <Modal
      titleText="Edit Conversation Information"
      submitText="Save"
      onCancel={onCancel}
      onSubmit={handleSubmit}
      type={Type.PRIMARY}
    >
      <form
        className="channel-profile-form"
        ref={formReference}
        onSubmit={event => {
          event.preventDefault();
        }}
      >
        <div className="channel-profile-form__img-section">
          <InputLabel type={Typography.BODY_1} color="primary">
            Channel Image
          </InputLabel>
          <div className="channel-profile-form__avatar">
            {currentImg ? (
              <Avatar height="80px" width="80px" src={currentImg} />
            ) : (
              <ChannelAvatar
                height={80}
                width={80}
                channel={channel}
                userId={userId}
                theme={theme}
              />
            )}
          </div>
          <input
            ref={hiddenInputReference}
            type="file"
            accept="image/gif, image/jpeg, image/png"
            style={{ display: 'none' }}
            onChange={event => {
              setCurrentImg(URL.createObjectURL(event.target.files[0]));
              setNewFile(event.target.files[0]);
              hiddenInputReference.current.value = '';
            }}
          />
          <TextButton
            className="channel-profile-form__avatar-button"
            onClick={() => hiddenInputReference.current.click()}
            notUnderline
          >
            <Label type={Typography.BUTTON_1} color={Colors.PRIMARY}>
              Upload
            </Label>
          </TextButton>
        </div>
        <div className="channel-profile-form__name-section">
          <InputLabel color="primary" size="small">
            Conversation Name
          </InputLabel>
          <Input
            required={title !== ''}
            name="channel-profile-form__name"
            ref={inputReference}
            value={title}
            placeHolder={
              stringSet.MODAL__CHANNEL_INFORMATION__INPUT__PLACE_HOLDER
            }
          />
        </div>
      </form>
    </Modal>
  );
};

export default EditDetails;
