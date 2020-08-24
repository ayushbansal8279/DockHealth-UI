import styled from 'styled-components';
import palette from 'styles/palette';
import {
  CloseIconButton,
  ModalWrapperWithPadding,
} from 'modal/components/styled';

export const ImportPatientPopoverWrapper = styled(ModalWrapperWithPadding)`
  position: absolute !important;
  width: 401px;
  height: inherit;
  bottom: 0;
  right: 0;
  align-items: baseline;
  align-vertical: center;
  box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.17);
  overflow: auto;
  padding-right: 5px;
  padding-bottom: 0;
`;

export const ImportPatientPopoverWrapperMinimized = styled(ModalWrapperWithPadding)`
position: absolute !important;
  width: 401px;
  height: 32px;
  bottom: 0;
  right: 0;
  align-items: baseline;
  align-vertical: center;
  box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.17);
  padding: 16px;
`;

export const PopoverCloseButton = styled(CloseIconButton)`
  position: absolute;
  top: 11px !important;
`;
export const CloseButtonWord = styled(CloseIconButton)`
  font-family: Roboto Condensed !important;
  font-style: normal !important;
  font-weight: normal !important;
  font-size: 14px !important;
  color: ${palette.mediumGrey} !important;
  top: 3px !important;
  right: 39px !important;
`;
export const PopoverMinimizeButton = styled.div`
  width: 19px;
  height: 3px;
  background-color: ${palette.coolGrey2};
`;

export const DownloadIcon = styled.img`
  width: 28px;
  height: 28px;
  margin-right: 6px;
`;

export const FileDisplayArea = styled.div`
  margin-top: 18px;
`;

export const FileName = styled.p`
  text-align: left;
  font-family: Roboto Condensed;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 135%;
  height: 22px;
`;

export const PopoverHeader = styled.div`
  top: 0;
  left: 0;
  background-color: ${palette.blueGrey};
  width: 401px;
  height: 32px;
  position: absolute;
  padding: 7.1px;
  color: ${palette.mediumGrey};
  text-align: left;
  font-family: Roboto Condensed;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 135%;
`;

export const ProgressDisplayArea = styled.div``;

export const ProgressMessage = styled.p`
  font-family: Roboto Condensed;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 135%;
  display: inline-block;
`;

export const PopoverExpandButton = styled(CloseIconButton)`
  top: 1px !important;
  right: 2px !important;
`;

export const SuccessIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-left: 150px;
`;

export const ErrorDisplayArea = styled.div``;

export const ErrorAmount = styled.p`
  text-align: left;
  font-family: Roboto Condensed;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 135%;
  color: ${palette.red};
  margin-bottom: 0.5rem !important;
`;

export const ErrorMessage = styled.p`
  text-align: left;
  font-family: Roboto Condensed;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 135%;
  color: ${palette.red};
  margin-bottom: 0.25rem !important;
`;
export const FixErrorContainer = styled.div`
  text-align: left;
  margin: 20px;
  margin-left: 0;
`;

export const FixErrors = styled.a`
  font-family: Roboto Condensed;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 135%;
  color: ${palette.mediumGrey};
  text-align: left;
  margin-right: 10px;
`;
