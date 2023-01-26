import React from 'react';
import {
  UploadBarContainer,
  UploadBar,
  UploadBarOuterContainer,
} from './styled';

const AttachmentProgressBar = (props) => {
  const { progress } = props;

  return (
    <UploadBarOuterContainer>
      <UploadBarContainer>
        <UploadBar progress={progress} />
      </UploadBarContainer>
    </UploadBarOuterContainer>
  );
};

export default AttachmentProgressBar;
