import React from 'react';
import { VideoContainer, VideoIFrame } from './styled';

const Video = ({ width = 240, url }) => {
  return (
    <VideoContainer width={width}>
      <VideoIFrame
        src={url}
        width={width}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </VideoContainer>
  );
};

export default Video;
