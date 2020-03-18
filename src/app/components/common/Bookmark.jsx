import { IconButton } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const Flag = styled.div`
  width: 18px;
  height: 24px;
  border: 10px solid ${({ isActive }) => (isActive ? '#fb7c06' : '#dedee2')};
  border-bottom: 6px transparent solid;
`;

Flag.propTypes = {
  isActive: PropTypes.bool,
};

Flag.defaultProps = {
  isActive: false,
};

const StyledButton = styled(IconButton)`
  && {
    height: 44px;
    width: 44px;
    margin-top: -12px;
  }
`;

const Bookmark = ({ onClick, isActive, style, className, disabled }) =>
  onClick ? (
    <StyledButton
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={className}
    >
      <Flag isActive={isActive} />
    </StyledButton>
  ) : (
    <Flag isActive={isActive} style={style} className={className} />
  );

Bookmark.propTypes = {
  onClick: PropTypes.func,
  isActive: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
};

Bookmark.defaultProps = {
  onClick: undefined,
  disabled: false,
};

export default Bookmark;
