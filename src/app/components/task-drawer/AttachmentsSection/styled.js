import styled from 'styled-components';

import palette, { opacify } from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';

export const DropHereText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const AttachmentsContainer = styled.div`
  color: ${palette.coolGrey1};
  background-color: ${(props) =>
    props.isDragActive ? palette.coolGrey3 : palette.white};
  border: ${(props) =>
    props.isDragActive ? `solid 1px ${palette.coolGrey2}` : `none`};
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
  border: 1px solid ${palette.coolGrey1};
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
    border-color: ${opacify(palette.coolGrey1, 0)};
    color: ${palette.darkGrey};

    ${RemoveAttachmentButtonContainer} {
      margin-left: ${spacing.small};
      padding: 0px 10px;
      width: 1rem;
    }
  }
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

export const DownloadAllLink = styled.a`
  align-items: center;
  color: ${palette.brightBlue};
  padding: ${spacing.tiny} ${spacing.small};
  margin: ${spacing.tiny};
`;

export const Title = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regularPlus};
  color: ${palette.greyBlue};
`;