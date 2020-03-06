import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Member from './Member';
import InviteMemberPopover from './InviteMemberPopover';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

const Members = ({ members, membersNotInTaskList, taskList }) => {
  const visibleMembers = members.slice(0, 5);

  return (
    <StyledContainer>
      <InviteMemberPopover
        taskList={taskList}
        members={members}
        membersNotInTaskList={membersNotInTaskList}
      />
      {visibleMembers.map(member => (
        <Member
          onClick={() => {}}
          member={member}
          style={{
            marginRight: '-8px',
            opacity: member.userStatus === 'INVITED' ? '0.7' : '1.0',
          }}
          key={`member${member.userIdentifier}`}
        />
      ))}
    </StyledContainer>
  );
};

Members.propTypes = {
  members: PropTypes.arrayOf(
    PropTypes.shape({
      userIdentifier: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      initials: PropTypes.string,
      profileThumbnailPictureHash: PropTypes.string,
    }),
  ),
  membersNotInTaskList: PropTypes.arrayOf(
    PropTypes.shape({
      userIdentifier: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      initials: PropTypes.string,
      profileThumbnailPictureHash: PropTypes.string,
    }),
  ),
};

Members.defaultProps = {
  members: [],
  membersNotInTaskList: [],
};

export default Members;
