import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import palette from 'styles/palette';

export const DrawerContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100vw;
  flex-flow: row nowrap;
`;

export const useDrawerClasses = makeStyles({
  appBar: {
    backgroundColor: palette.white,
    color: palette.mediumGrey,
    fontSize: '2.25rem',
    height: '5rem',
    marginBottom: ({ bannerVisible }) => (bannerVisible ? '2.875rem' : 0),
    padding: '0.75rem 1.25rem 1rem',
    position: 'relative',
    width: '100%',
    boxShadow: 'none',
  },
  drawer: {
    position: 'relative',
    zIndex: 10,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerPaper: {
    position: 'static',
    transform: ({ isNavbarVisible }) =>
      isNavbarVisible ? 'translateX(0px)' : 'translateX(-100%)',
    backgroundColor: palette.midnightBlue,
    border: 0,
    overflow: 'initial',
    width: 'auto',
  },
});

export const MainContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  z-index: 9;
`;

export const ContentContainer = styled.div`
  position: relative;
  flex: 1;
  overflow-y: auto;
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
