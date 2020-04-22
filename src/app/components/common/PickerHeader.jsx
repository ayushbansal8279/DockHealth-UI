import { IconButton } from '@material-ui/core';
import { ArrowBack as BackIcon } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import ItemAssignment from 'img/folder.svg';
import Search from 'img/search.svg';
import palette from 'app/palette';

const StyledBackIcon = styled(BackIcon)`
  && {
    width: 22px;
    color: ${palette.white};
  }
`;

const Header = styled.div`
  align-items: center;
  background-color: ${palette.midnightBlue};
  display: flex;
  flex-shrink: 0;
  flex-grow: 0;
  padding: 0 10px;
  width: 494px;
  height: 73px;
`;

const HeaderClose = styled.div`
  width: 22px;
  height: 22px;
  padding: 4px;
  font-size: 14px;
  color: ${palette.white};
  font-weight: bold;
`;

const HeaderTitle = styled.strong`
  margin-left: 15px;
  color: ${palette.white};
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
