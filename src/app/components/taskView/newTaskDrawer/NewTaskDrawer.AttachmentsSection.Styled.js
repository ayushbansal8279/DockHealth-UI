import styled from 'styled-components';

import palette, { opacify } from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes } from 'styles/font';

export const AttachmentsContainer = styled.div`
  color: ${palette.coolGrey2};
`;

export const RemoveAttachmentButtonContainer = styled.div`
  align-items: center;
  color: ${palette.darkGrey};
  display: flex;
  height: 1rem;
  justify-content: center;
  margin-left: 0;
  overflow: hidden;
  transition: all 0.25s ease-out;
  width: 0;
`;

export const AttachmentButton = styled.a`
  align-items: center;
  border: 1px solid ${palette.coolGrey2};
  border-radius: 3px;
  color: ${palette.darkGrey};
  display: inline-flex;
  flex-flow: row nowrap;
  height: 2.5rem;
  padding: ${spacing.tiny} ${spacing.small};
  margin-bottom: ${spacing.small};
  margin-right: ${spacing.small};
  max-width: 196px; // per design
  transition: all 0.25s ease-out;

  &:hover {
    border-color: ${opacify(palette.coolGrey2, 0)};
    color: ${palette.darkGrey};

    ${RemoveAttachmentButtonContainer} {
      margin-left: ${spacing.small};
      padding: 0px 10px;
      width: 1rem;
    }
  }
`;

export const AddAttachmentButton = styled.div`
  align-items: center;
  border: 1px solid ${palette.coolGrey2};
  border-radius: 3px;
  color: ${palette.orange};
  cursor: pointer;
  display: inline-flex;
  flex-flow: row nowrap;
  justify-content: center;
  height: 2.5rem;
  padding: ${spacing.tiny} ${spacing.small};
  margin-bottom: ${spacing.small};
  margin-right: ${spacing.small};
  transition: all 0.25s ease-out;
  width: 2.5rem;
`;

export const AttachmentFileInput = styled.input.attrs({
  type: 'file',
})`
  height: 1px;
  left: -100vw;
  opacity: 0.01;
  position: absolute;
  top: -100vh;
  visibility: hidden;
  width: 1px;
`;

export const UploadBarOuterContainer = styled.div`
  align-items: center;
  display: flex;
  height: 2.5rem;
  width: 106px; // per design
`;

export const UploadBarContainer = styled.div`
  background-color: ${palette.coolGrey3};
  border-radius: 5px;
  height: 5px;
  position: relative;
  width: 100%;
`;

export const UploadBar = styled.div`
  background-color: ${palette.brightBlue};
  border-radius: 5px;
  height: 5px;
  left: 0;
  position: absolute;
  top: 0;
  transition: all 0.25s ease-out;
  width: ${props => props.progress ?? 0}%;
  z-index: 1;

  &::after {
    content: '${props => props.progress ?? 0}%';
    color: ${palette.darkGrey};
    font-family: 'Roboto Condensed', sans-serif;
    font-size: ${fontSizes.small};
    position: absolute;
    right: 0;
    transform: translateX(50%);
    top: 100%;
  }
`;
