import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import BackIcon from '@material-ui/icons/ArrowBack';
import ItemAssignment from '../../img/folder.svg';
import Search from '../../img/search.svg';

const StyledBackIcon = styled(BackIcon)`
  && {
    width: 22px;
    color: #fff;
  }
`;

const Header = styled.div`
  flex-shrink: 0;
  flex-grow: 0;
  padding: 0 10px;
  display: flex;
  align-items: center;
  background: #2a4a70;
  width: 494px;
  height: 73px;
`;

const HeaderClose = styled.div`
  width: 22px;
  height: 22px;
  padding: 4px;
  font-size: 14px;
  color: #fff;
  font-weight: bold;
`;

const HeaderTitle = styled.strong`
  margin-left: 15px;
  color: #fff;
  font-size: 18px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const PickerHeader = ({
  handleClose,
  handleSearchToggle,
  children,
  closeLabel,
  backInsteadOfClose,
}) => (
  <Header>
    <IconButton onClick={handleClose} aria-label={closeLabel}>
      {backInsteadOfClose ? <StyledBackIcon /> : <HeaderClose>✕</HeaderClose>}
    </IconButton>
    <img src={ItemAssignment} style={{ marginLeft: 5 }} alt="" />
    <HeaderTitle>{children}</HeaderTitle>
    <IconButton
      aria-label="Search"
      onClick={handleSearchToggle}
      style={{ marginLeft: 'auto' }}
    >
      <img src={Search} alt="" />
    </IconButton>
  </Header>
);

PickerHeader.propTypes = {
  handleClose: PropTypes.func.isRequired,
  handleSearchToggle: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  closeLabel: PropTypes.string.isRequired,
};

export default PickerHeader;
