import { IconButton } from '@mui/material';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';
import palette, { typography } from 'styles/palette';
import styled from 'styled-components';

export const StyledIconButton = styled(IconButton)`
  &&& {
    &.MuiIconButton-root {
      color: inherit;
    }
  }
`;

export const ChatHeaderTitle = styled.h3`
  margin: 0;
  padding: ${spacing.smallPlus};
  font-size: ${fontSizes.large};
  font-weight: ${fontWeights.regularPlus};
  font-family: ${typography.text};
  color: ${palette.white};
`;

export const ChannelListTitle = styled.h6`
  margin: 0;
  padding: ${spacing.smallPlus};
  font-size: ${fontSizes.large};
  font-weight: ${fontWeights.regular};
  font-family: ${typography.text};
  color: ${palette.midnightBlue};
`;

export const Container = styled.div`
  max-width: 1280px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  // padding: 16px 12px;
  z-index: 0;
`;

export const ColorSet = {
  '--sendbird-light-primary-500': '#00487c',
  '--sendbird-light-primary-400': '#4bb3fd',
  '--sendbird-light-primary-300': palette.midnightBlue,
  '--sendbird-light-primary-200': '#0496ff',
  '--sendbird-light-primary-100': '#027bce',
};

export const HeaderContainer = styled.div`
  // height: 10%;
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: ${palette.midnightBlue};
  color: ${palette.white};
  font-family: ${typography.text};
`;

export const ChatContainer = styled.div`
  height: 90%;
  width: 100%;
`;
