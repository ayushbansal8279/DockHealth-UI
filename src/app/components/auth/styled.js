import styled from 'styled-components';
import palette from 'styles/palette';
import GoogleLogo from 'img/google_btn_light_normal_ios.svg';

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
