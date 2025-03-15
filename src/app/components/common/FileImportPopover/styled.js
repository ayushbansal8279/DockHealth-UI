import { fontSizes } from "@/app/styles/font";
import { CloseIconButton, ModalWrapperWithPadding } from "@/app/modal/components/styled";
import palette from "@/app/styles/palette";
import spacing from "@/app/styles/spacing";
import styled from "styled-components";

export const ImportPopoverWrapper = styled(ModalWrapperWithPadding)`
  position: absolute !important;
  width: 401px;
  height: inherit;
  min-height: 140px;
  bottom: 0;
  right: 0;
  align-items: baseline;
  align-vertical: center;
  box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.17);
  overflow-x: none;
  overflow-y: auto;
  padding-right: 5px;
  padding-bottom: 0;
  margin-right: 100px;
`;

export const PopoverHeader = styled.div`
  top: 0;
  left: 0;
  background-color: ${palette.blueGrey};
  width: 401px;
  height: 32px;
  position: absolute;
  padding: ${spacing.small};
  color: ${palette.mediumGrey};
  text-align: left;
  font-family: inherit;
  font-style: normal;
  font-weight: normal;
  font-size: ${fontSizes.smallPlus};
  line-height: 135%;
`;

export const CloseButtonWord = styled(CloseIconButton)`
  font-family: inherit; !important;
  font-style: normal !important;
  font-weight: normal !important;
  font-size: 14px !important;
  color: ${palette.mediumGrey} !important;
  top: ${spacing.tiny} !important;
  right: ${spacing.giga} !important;
`;


export const DownloadIcon = styled.img`
  width: 28px;
  height: 28px;
  margin-right: ${spacing.small};
  margin-block-end: 12px;
`;

export const FileDisplayArea = styled.div`
  margin-top: ${spacing.regular};
`;

export const FileName = styled.p`
  text-align: left;
  font-family: inherit;
  font-style: normal;
  font-weight: bold;
  font-size: ${fontSizes.regular};
  line-height: 135%;
  height: 22px;
`;

export const ProgressMessage = styled.p`
  font-family: inherit;
  font-style: normal;
  font-weight: normal;
  font-size: ${fontSizes.small};
  line-height: 135%;
  display: block;
`;