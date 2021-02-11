import styled from 'styled-components';
import DockHeaderLogo from 'img/logo/dock-logo';

export const GenericHeaderContainer = styled.div`
  align-items: center;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 1rem;
  padding-right: 0.5rem;
  width: 100%;
`;

export const AlertsLogoContainer = styled.div`
  display: flex;

  & > img {
    margin-right: 24px;
  }
`;

export const DockHeaderImage = styled.img.attrs({
  alt: 'Dock Health',
  src: DockHeaderLogo,
})`
  width: 110px;
  height: auto;
  object-fit: contain;
`;
