import styled from 'styled-components';
import palette from 'styles/palette';
import GoogleLogo from 'img/google_btn_light_normal_ios';
// import DrChronoLogo from 'img/drchrono-button';
import DrChronoLogo from 'img/drchrono_icon';
import AthenHealthLogo from 'img/athenahealth_icon';

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
  width: 60px;
  height: 60px;
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
  padding: 4px 4px;
  align-items: center;
  border-radius: 5px;
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
`;

export const Spacer = styled.hr`
  margin: 0;
  width: 100%;
  border-color: ${palette.coolGrey3};
  height: 0.5px;
`;
