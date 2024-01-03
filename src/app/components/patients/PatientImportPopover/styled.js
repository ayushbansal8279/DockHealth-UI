import styled from 'styled-components';
import palette, { typography } from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';
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
  overflow-x: none;
  overflow-y: auto;
  padding-right: 5px;
  padding-bottom: 0;
  margin-right: 100px;
`;

export const ImportPatientPopoverWrapperMinimized = styled(
  ModalWrapperWithPadding,
)`
  position: absolute !important;
  width: 401px;
  height: 32px;
  bottom: 0;
  right: 0;
  align-items: baseline;
  align-vertical: center;
  box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.17);
  padding: 16px;
  margin-right: 100px;
`;

export const PopoverCloseButton = styled(CloseIconButton)`
  position: absolute;
  top: 11px !important;
`;
export const CloseButtonWord = styled(CloseIconButton)`
  font-family: ${typography.text}; !important;
  font-style: normal !important;
  font-weight: normal !important;
  font-size: 14px !important;
  color: ${palette.mediumGrey} !important;
  top: ${spacing.tiny} !important;
  right: ${spacing.giga} !important;
`;
export const PopoverMinimizeButton = styled.div`
  width: 19px;
  height: 3px;
  background-color: ${palette.coolGrey2};
`;

export const DownloadIcon = styled.img`
  width: 28px;
  height: 28px;
  margin-right: ${spacing.small};
`;

export const FileDisplayArea = styled.div`
  margin-top: ${spacing.regular};
`;

export const FileName = styled.p`
  text-align: left;
  font-family: ${typography.text};
  font-style: normal;
  font-weight: bold;
  font-size: ${fontSizes.regular};
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
  padding: ${spacing.small};
  color: ${palette.mediumGrey};
  text-align: left;
  font-family: ${typography.text};
  font-style: normal;
  font-weight: normal;
  font-size: ${fontSizes.smallPlus};
  line-height: 135%;
`;

export const ProgressDisplayArea = styled.div``;

export const ProgressMessage = styled.p`
  font-family: ${typography.text};
  font-style: normal;
  font-weight: normal;
  font-size: ${fontSizes.small};
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
  margin-left: 30px;
`;

export const ErrorDisplayArea = styled.div``;

export const ErrorAmount = styled.p`
  text-align: left;
  font-family: ${typography.text};
  font-style: normal;
  font-weight: ${fontWeights.bold};
  font-size: ${fontSizes.smallPlus};
  line-height: 135%;
  color: ${palette.red};
  margin-bottom: 0.5rem;
`;

export const ErrorMessage = styled.p`
  text-align: left;
  font-family: ${typography.text};
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 135%;
  color: ${palette.red};
  margin-bottom: 0.25rem;
`;
export const FixErrorContainer = styled.div`
  text-align: left;
  margin: ${spacing.regularPlus};
  margin-left: 0;
`;

export const FixErrors = styled.a`
  font-family: ${typography.text};
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 135%;
  color: ${palette.mediumGrey};
  text-align: left;
  margin-right: ${spacing.small};
`;

export const ProgressBar = styled.div`
  width: 283px;
  height: 4px;
  background: linear-gradient(
    to right,
    ${palette.brightBlue} 0% ${(props) => props.fileProgress}%,
    ${palette.coolGrey2} ${(props) => props.fileProgress}%
      ${(props) => props.inverseProgress}%
  );
  border-radius: 4px;
  display: inline-block;
  margin-right: 5px;
  align: left;
`;
