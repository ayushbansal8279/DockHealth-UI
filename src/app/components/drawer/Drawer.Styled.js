import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router';
import styled from 'styled-components';

export const useDrawerClasses = makeStyles({
  appBar: {
    backgroundColor: '#3d4858',
    color: '#fff',
    fontSize: '2.25rem',
    height: '5.5rem',
    marginLeft: 85,
    marginBottom: ({ trialBannerVisible }) =>
      trialBannerVisible ? '2.875rem' : 0,
    paddingLeft: '1.25rem',
    position: 'relative',
    transition: 'all 0.2s ease-out',
    width: 'calc(100% - 85px)',
  },
  appBarOpen: {
    marginLeft: 260,
    width: 'calc(100% - 260px)',
  },
  appBarBorder: {
    backgroundColor: '#c1ccda',
    height: '0.25rem',
    left: 0,
    position: 'absolute',
    top: '5.25rem',
    width: '100%',
    zIndex: 1,
  },
  drawer: {
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerPaper: {
    background: '#3d4858',
    border: 0,
    overflow: 'initial',
    width: ({ isOpen }) => (isOpen ? 260 : 85),
    transition: 'width 0.2s ease-out',
  },
});

export const ContentContainer = styled.div`
  ${({ open }) =>
    open ? 'width: calc(100% - 260px);' : 'width: calc(100% - 85px);'}
  ${({ open }) =>
    open ? 'margin-left: 260px;' : 'margin-left: 85px;'}
  height: 100%;
  overflow-y: auto;
  position: relative;
  transition: width 0.2s ease-out, margin 0.2s ease-out;
`;

export const TrialBanner = styled(Grid)`
  background-color: #3d4858;
  color: #feb52b;
  font-size: 1rem;
  left: 0;
  height: ${props => (props.trialBannerVisible ? '2.875rem' : 0)};
  overflow: hidden;
  right: 0;
  position: absolute;
  text-transform: uppercase;
  top: 100%;
  transition: all 0.2s ease-out;
  z-index: 1;
`;

export const TrialBannerLink = styled(Link)`
  color: #feb52b;
  margin-left: 0.25rem;
  text-decoration: underline;
  transition: all 0.25s ease-out;

  &:hover {
    color: #eee;
  }
`;
