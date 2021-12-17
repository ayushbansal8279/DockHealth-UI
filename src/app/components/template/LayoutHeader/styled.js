import styled from 'styled-components';
import palette from 'styles/palette';
import DockLogoSrc from 'img/dock-header-logo';
import { fontSizes, fontWeights } from 'styles/font';

export const HeaderContainer = styled.div`
  width: 100%;
  height: auto;
  background-color: ${palette.white};
`;

export const MainHeader = styled.div`
  width: 100%;
  height: 80px;
  padding: 12px 32px;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: ${fontSizes.largePlus};
  font-weight: ${fontWeights.regular};
  color: ${palette.mediumGrey};
`;

export const DockHeaderImage = styled.img.attrs({
  alt: 'Dock Health',
  src: DockLogoSrc,
})`
  width: 70px;
  height: 25px;
`;

export const Title = styled.h1`
  margin: 0;
  font-family: inherit;
  font-size: ${fontSizes.largePlus};
  line-height: ${fontSizes.huge};
  font-weight: ${fontWeights.regular};
  color: ${palette.mediumGrey};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Description = styled.p`
  margin-bottom: 0;
  font-family: inherit;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  color: ${palette.coolGrey1};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
