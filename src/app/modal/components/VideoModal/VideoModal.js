import React from 'react';
import { useBoolean } from 'react-use';
import { CloseIconButton, CloseIcon } from '../styled';
import { Wrapper, Video, VideoLoader } from './styled';

const VideoModal = ({ url, title, closeModal }) => {
  const [isLoaded, setLoaded] = useBoolean(false);

  return (
    <Wrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <Video
        title={title}
        width="560"
        height="205"
        src={url}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={setLoaded}
      />
      {!isLoaded && <VideoLoader />}
    </Wrapper>
  );
};

export default VideoModal;
