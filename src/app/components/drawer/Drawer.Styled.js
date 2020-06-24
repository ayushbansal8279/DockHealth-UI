import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router';
import styled from 'styled-components';
import palette from 'styles/palette';

export const useDrawerClasses = makeStyles({
  appBar: {
    backgroundColor: palette.midnightBlue,
    color: palette.white,
    fontSize: '2.25rem',
    height: '5rem',
    marginLeft: 85,
    marginBottom: ({ bannerVisible }) => (bannerVisible ? '2.875rem' : 0),
    padding: '0.75rem 1.25rem 1rem',
    position: 'relative',
    transition: 'all 0.2s ease-out',
    width: 'calc(100% - 85px)',
  },
  appBarOpen: {
    marginLeft: ({ navbarFullWidth }) => navbarFullWidth,
    width: ({ navbarFullWidth }) => `calc(100% - ${navbarFullWidth}px)`,
  },
  appBarBorder: {
    backgroundColor: palette.coolGrey2,
    height: '0.25rem',
    left: 0,
    position: 'absolute',
    top: '4.75rem',
    width: '100%',
    zIndex: 1,
  },
  drawer: {
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerPaper: {
    transform: ({ isNavbarVisible }) =>
      isNavbarVisible ? 'translateX(0px)' : 'translateX(-100%)',
    backgroundColor: palette.midnightBlue,
    border: 0,
    overflow: 'initial',
    width: ({ isOpen, navbarFullWidth }) => (isOpen ? navbarFullWidth : 85),
    transition: 'width 0.2s ease-out, transform 0.2s ease-out',
  },
});

export const ContentContainer = styled.div`
  ${({ isFullView, open }) =>
    !isFullView
      ? `
      ${open ? 'width: calc(100% - 260px);' : 'width: calc(100% - 85px);'}
      ${open ? 'margin-left: 260px;' : 'margin-left: 85px;'}
    `
      : `
      width: 100%;
      margin-left: 0;
    `}
  height: 100%;
  overflow-y: auto;
  position: relative;
  transition: width 0.2s ease-out, margin 0.2s ease-out;
`;

export const TrialBannerContainer = styled(Grid)`
  font-size: 1rem;
  left: 0;
  overflow: hidden;
  right: 0;
  position: absolute;
  text-transform: uppercase;
  top: 100%;
  transition: all 0.2s ease-out;
  z-index: 1;
`;

export const TrialBanner = styled.div`
  align-items: center;
  background-color: ${palette.oPlusRed};
  color: ${palette.white};
  display: flex;
  height: ${props =>
    props.bannerVisible || props.hasCreditCardExpirationMessage
      ? '2.875rem'
      : 0};
  ${props => props.hasCreditCardExpirationMessage && 'text-transform: none;'}
  justify-content: center;
  width: 100%;
`;

export const TrialBannerLink = styled(Link)`
  color: ${palette.white};
  margin-left: 0.25rem;
  text-decoration: underline;
  transition: all 0.25s ease-out;

  &:hover {
    color: ${palette.coolGrey3};
  }
`;
