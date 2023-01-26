import { Grid, IconButton } from '@mui/material';
import styled from 'styled-components';
import palette, { opacify } from 'styles/palette';
import DockHeaderLogo from 'img/dock-header-logo.svg';
import AuthTemplateTopBackgroundTop from 'img/bubble-pattern-top.svg';
import AuthTemplateTopBackgroundBottom from 'img/bubble-pattern-bottom.svg';
import DockCoinReferralRewards from 'img/dockcoin-referral-rewards.svg';
import DockFooterMessage from 'img/dock-footer-message.svg';

const mdBreakpoint = 960;

export const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 750px;
  width: 100%;

  @media screen and (max-width: ${mdBreakpoint}px) {
    flex-direction: column;
  }
`;

export const LeftSideMainContainer = styled.div`
  position: relative;
  align-items: center;
  background-color: ${palette.white};
  display: flex;
  flex: 1;
  height: min-content;
  justify-content: center;
  min-height: min-content;

  @media screen and (min-width: ${mdBreakpoint}px) {
    height: 100%;
    min-height: 100%;
  }
`;

export const LeftSideContentContainer = styled.div`
  align-items: flex-start;
  display: flex;
  height: min-content;
  justify-content: center;
  min-height: min-content;
  padding: 1.5rem;
  padding-top: 0px;
  width: 100%;

  @media screen and (min-width: ${mdBreakpoint}px) {
    align-items: center;
    height: 100%;
    min-height: 100%;
    padding: 2rem;
    padding-top: 0px;
    max-width: 495px;
  }
`;

export const RightSideMainContainer = styled.div`
  align-items: center;
  background-color: ${palette.midnightBlue};
  background-image: linear-gradient(
      to bottom,
      ${opacify(palette.midnightBlue, 0.2)},
      ${opacify(palette.midnightBlue, 0.2)}
    ),
    url(${AuthTemplateTopBackgroundTop}),
    url(${AuthTemplateTopBackgroundBottom});
  background-repeat: repeat-x;
  background-position: bottom, top;
  display: flex-root;
  max-width: 642px;
  height: 100%;
  justify-content: center;
  min-height: 100%;
  padding: 6rem 5rem 2rem 5rem;
  width: 50%;

  @media screen and (max-width: ${mdBreakpoint}px) {
    height: min-content;
    max-width: unset;
    min-height: min-content;
    padding: 1.5rem;
    width: 100%;
  }
`;

export const RightSideContentContainer = styled.div`
  color: ${palette.white};
  height: min-content;
  min-height: min-content;
  width: 100%;

  @media screen and (min-width: ${mdBreakpoint}px) {
    max-height: 721px;
    max-width: 525px;
  }
`;

export const StyledGrid = styled(Grid)`
  && {
    height: 100%;
  }
`;

export const DockLogoImage = styled.img.attrs({
  src: DockHeaderLogo,
  alt: 'Dock Health logo',
})`
  object-fit: contain;
  height: 128px;
`;

export const DockCoinReferralRewardsImage = styled.img.attrs({
  src: DockCoinReferralRewards,
  alt: 'Dockcoin Referral Rewards',
})`
  object-fit: contain;
  width: 360px;
`;

export const DockFooterMessageImage = styled.img.attrs({
  src: DockFooterMessage,
  alt: 'Dock Health',
})`
  object-fit: contain;
  width: 360px;
`;

export const StyledForm = styled.form`
  width: 100%;
`;

export const Title = styled.div`
  margin-bottom: 2-px;
`;

export const CloseButton = styled(IconButton)`
  && {
    font-size: 1.125rem;
    margin-left: auto;
    position: absolute;
    top: 10px;
    left: 10px;
  }
`;

export const ButtonWrapper = styled.div`
  width: 170px;
`;
