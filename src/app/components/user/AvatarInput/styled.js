import { IconButton } from '@mui/material';
import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';

export const PictureInput = styled.input`
  display: none;
`;

export const CameraIconContainer = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  height: 40px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${palette.white};
  border: 2px solid ${palette.cyanBlue};
  border-radius: 50%;
`;

export const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 300px;
  padding: 16px;
`;

export const AvatarContainer = styled.div`
  display: flex;
  flex: 200px 0 0;
  flex-direction: column;
  justify-content: center;
`;

export const Title = styled.div`
  color: ${palette.unknownGrey1};
  font-size: 20px;
  text-align: center;
`;

export const EditButton = styled.button`
  position: absolute;
  bottom: 0;
  right: -20px;
  color: ${palette.brightBlue};
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regular};
  cursor: pointer;

  &:hover {
    color: ${palette.lighterCyanBlue};
    filter: brightness(1.25);
  }
`;

export const CloseIconButton = styled(IconButton)`
  &&& {
    &.MuiIconButton-root {
      position: absolute;
      top: 5px;
      right: 5px;
    }
  }
`;
