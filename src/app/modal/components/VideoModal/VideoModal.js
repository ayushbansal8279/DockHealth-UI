import React from 'react';
import { useBoolean } from 'react-use';
import styled from 'styled-components';
import palette from 'styles/palette';
import Loader from 'components/common/Loader/Loader';
import { CloseIconButton, CloseIcon } from '../styled';

const Wrapper = styled.div`
  position: relative;
  height: 523px;
  width: 971px;
  max-width: 100%;
  max-height: 100%;
  background: ${palette.coolGrey2};
`;

const LoaderOverlay = styled.div`
  postion: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Video = styled.iframe`
  width: 100%;
  height: 100%;
  background-color: ${palette.coolGrey2};
`;

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
      {!isLoaded && (
        <LoaderOverlay>
          <Loader />
        </LoaderOverlay>
      )}
    </Wrapper>
  );
};

export default VideoModal;
