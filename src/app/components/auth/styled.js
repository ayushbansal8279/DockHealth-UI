import styled from 'styled-components';
import palette from 'styles/palette';
import GoogleLogo from 'img/google_btn_light_normal_ios.svg';
// import DrChronoLogo from 'img/drchrono-button';
import DrChronoLogo from 'img/drchrono_icon.png';
import AthenHealthLogo from 'img/athenahealth_icon.png';
import { Paper } from '@mui/material';

export const SSOOptionsBar = styled.div`
  width: 100%;
  height: 80px;
  padding: 4px 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${palette.mediumGrey};
`;

export const GoogleLogoImage = styled.img.attrs({
  alt: 'Google',
  src: GoogleLogo,
})`
  width: 30px;
  height: 30px;
`;

export const DrChronoLogoImage = styled.img.attrs({
  alt: 'DrChrono',
  src: DrChronoLogo,
})`
  width: 30px;
  height: 30px;
`;

export const AthenaHealthImage = styled.img.attrs({
  alt: 'Athenahealth',
  src: AthenHealthLogo,
})`
  width: 30px;
  height: 30px;
`;

export const SSOButton = styled.div`
  display: flex;
  height: 64px;
  align-items: center;
  border: 1px solid rgba(82, 82, 128, 0.09);
  border-radius: 16px;
  color: ${({ color }) => color || palette.darkGrey};
  ${({ disableButton }) => `opacity: ${disableButton ? 0.5 : 1};`}

  &:hover {
    background: ${palette.coolGrey3};
  }
`;

export const PopoverContainer = styled.div`
  background-color: ${palette.white};
  min-width: 233px;
  box-shadow: 0px 4px 11px grey;
  max-height: 800px;
  overflow-x: hidden;
  overflow-y: auto;

  & > div:hover {
    background-color: ${palette.brightBlueWithAlpha};
  }
`;

export const Spacer = styled.hr`
  margin: 0;
  width: 100%;
  border-color: ${palette.coolGrey3};
  height: 0.5px;
`;

export const StyledPaper = styled(Paper)`
  border-radius: 4px;
`;
