import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { path } from 'ramda';
import MaterialDrawer from '@material-ui/core/Drawer';
import useBoolean from '../../helpers/useBoolean';
import DrawerList from './DrawerList';

const StyledDrawer = styled(MaterialDrawer).attrs({
  variant: 'permanent',
  classes: {
    paper: 'paper',
  },
})`
  && {
    flex-shrink: 0;
    white-space: nowrap;
    .paper {
      background: #125375;
      border: 0;
      ${({ open }) => (open ? 'width: 260px;' : 'width: 85px;')}
      transition: width .2s ease-out;
    }
  }
`;

const ContentContainer = styled.div`
  ${({ open }) => (open ? 'width: calc(100% - 260px);' : 'width: calc(100% - 85px);')}
  ${({ open }) => (open
    ? 'margin-left: 260px;'
    : 'margin-left: 85px;')}
  transition: width .2s ease-out, margin .2s ease-out;
`;

const Drawer = ({ user, lists, children }) => {
  const [isOpen, , , toggle] = useBoolean(true);
  return (
    <div style={{ display: 'flex' }}>
      <StyledDrawer open={isOpen}>
        <DrawerList open={isOpen} user={user} lists={lists} />
        <div onClick={toggle} style={{ flex: '1' }} />
      </StyledDrawer>
      <ContentContainer open={isOpen}>{children}</ContentContainer>
    </div>
  );
};

const ConnectedDrawer = ({ children }) => {
  const user = useSelector(path(['userState', 'userProfile']));
  const lists = useSelector(path(['taskListState', 'tasklist']));
  return (
    <Drawer user={user} lists={lists}>
      {children}
    </Drawer>
  );
};

export default ConnectedDrawer;
