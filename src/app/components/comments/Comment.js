import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const CommentBackground = styled.div`
  margin-top: 3px;
  border-radius: 6px;
  background: ${({ isOwn }) => (isOwn ? '#d4f3ff' : '#ededf0')};
  padding: 10px 13px;
  color: #1d1d1d;

  :last-child {
    ${({ isOwn }) =>
      isOwn
        ? 'border-bottom-right-radius: 0;'
        : 'border-bottom-left-radius: 0;'}
  }
`;

CommentBackground.propTypes = {
  isOwn: PropTypes.bool,
};

CommentBackground.defaultProps = {
  isOwn: false,
};

const Comment = ({ children, isOwn }) => (
  <CommentBackground isOwn={isOwn}>{children}</CommentBackground>
);

Comment.propTypes = {
  isOwn: PropTypes.bool.isRequired,
};

export default Comment;
