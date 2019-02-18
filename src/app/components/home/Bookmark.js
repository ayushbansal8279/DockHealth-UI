import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';

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

const Bookmark = ({
  onClick, isActive, style, className,
}) => (onClick
  ? (
    <StyledButton onClick={onClick} style={style} className={className}>
      <Flag isActive={isActive} />
    </StyledButton>
  )
  : <Flag isActive={isActive} style={style} className={className} />);

export default Bookmark;
