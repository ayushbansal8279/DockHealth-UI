import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const CreatorContainer = styled.div`
  margin-top: 12px;
  width: 65%;
  ${({ isOwn }) => isOwn && 'margin-left: auto;'}

  display: flex;
  align-items: flex-end;
`;

const CreatorInnerContainer = styled.div`
  margin-bottom: 6px;
  margin-left: 6px;
  flex: 1;
`;

const CreatorInitials = styled.div`
  width: 19px;
  height: 13px;
  background: #aab8c3;
  border-radius: 2px;
  color: #fff;
  font-size: 9px;
  text-align: center;
`;

const CreatorLabel = styled.div`
  font-size: 10px;
  color: #aab8c4;
`;

const Creator = ({
  initials,
  userName,
  isOwn,
  children,
}) => (
  <CreatorContainer isOwn={isOwn}>
    {!isOwn && <CreatorInitials>{initials}</CreatorInitials>}
    <CreatorInnerContainer>
      <CreatorLabel>{userName}</CreatorLabel>
      {children}
    </CreatorInnerContainer>
  </CreatorContainer>
);

Creator.propTypes = {
  userName: PropTypes.string.isRequired,
  initials: PropTypes.string.isRequired,
  isOwn: PropTypes.bool.isRequired,
};

export default Creator;
