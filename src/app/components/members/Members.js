import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import AddIcon from '@material-ui/icons/Add';
import InvitePicker from '../common/InvitePicker';
import Member from './Member';

const AddMember = styled(Member)`
  && {
    color: #0ca1c7;
    border: 1px dashed #0ca1c7;
    background: none;
  }
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

const Members = ({ members, taskList }) => {
  const visibleMembers = members.slice(0, 5);
  const hiddenMemberCount = members.length - visibleMembers.length;

  return (
    <StyledContainer>
      <InvitePicker taskList={taskList} members={members}>
        {({ open }) => (
          <>
            <AddMember onClick={open}>
              <AddIcon fontSize="small" />
            </AddMember>
            {hiddenMemberCount > 0 && (
              <Member
                onClick={open}
                color="#0ca1c7"
                style={{ marginRight: '-8px' }}
              >
                {`+${hiddenMemberCount}`}
              </Member>
            )}
          </>
        )}
      </InvitePicker>
      {visibleMembers.map(member => (
        <Member
          onClick={() => {}}
          member={member}
          style={{ marginRight: '-8px' }}
          key={`member${member.userId}`}
        />
      ))}
    </StyledContainer>
  );
};

Members.propTypes = {
  members: PropTypes.arrayOf(
    PropTypes.shape({
      userId: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      initials: PropTypes.string,
      profileThumbnailPictureHash: PropTypes.string,
    }),
  ),
};

Members.defaultProps = {
  members: [],
};

export default Members;
