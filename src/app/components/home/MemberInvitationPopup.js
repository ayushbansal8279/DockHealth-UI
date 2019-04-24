import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import {
  inviteMultipleUsersToTaskList,
} from '../../actions/tasklist-actions';
import SearchHeader from './SearchHeader';
import PickerHeader from './PickerHeader';
import ListItem from './ListItem';
import MemberSlot from './MemberSlot';

const List = styled.div`
  background: #fff;
  max-height: 255px;
  overflow: auto;
`;

const HeaderTaskName = styled.span`
  text-decoration: underline;
`;

const MemberName = styled.span`
  margin-left: 20px;
`;

const MemberPickerHeader = ({ close, toggleSearch, task }) => (
  <PickerHeader
    handleClose={close}
    handleSearchToggle={toggleSearch}
    closeLabel="Close user selection"
    backInsteadOfClose
  >
    {'Invite to '}
    <HeaderTaskName>{task.taskList.listName}</HeaderTaskName>
  </PickerHeader>
);

const MemberInvitationPopup = ({
  members, task, back, invite,
}) => {
  // TODO: Fetch getOrganizationUsersNotInTaskList ?
  const select = useCallback(
    (e) => {
      const memberId = e.currentTarget.id;
      invite(memberId);
    },
  );

  const [searchTerm, setSearchTerm] = useState('');
  const search = useCallback(
    (e) => { setSearchTerm(e.target.value); },
  );

  const [isSearching, setIsSearching] = useState(false);
  const toggleSearch = useCallback(
    () => {
      setIsSearching(!isSearching);
      setSearchTerm('');
    },
    [isSearching],
  );

  const handleClose = useCallback(
    () => {
      setIsSearching(false);
      setSearchTerm('');
      back();
    },
  );

  // member search
  const matchListing = (term, { userName }) => {
    const userNameMatches = userName && userName.toLowerCase().includes(term);
    return userNameMatches;
  };

  const orderListings = (p1, p2) => (p1.lastName ? p1.lastName.localeCompare(p2.lastName) : -1);

  // Search
  const searchTerms = searchTerm.toLowerCase().match(/[\S]+/g) || [];
  const isMatch = listing => searchTerms.every(term => matchListing(term, listing));

  const filteredListings = members
    && (searchTerms.length === 0
      ? members
      : members.filter(isMatch));

  const sortedListings = filteredListings
    && filteredListings.sort(orderListings);

  return (
    <React.Fragment>
      {isSearching
        ? <SearchHeader handleSearch={search} handleSearchToggle={toggleSearch} />
        : <MemberPickerHeader close={handleClose} toggleSearch={toggleSearch} task={task} />}
      <List>
        {sortedListings && sortedListings.map(m => (
          <ListItem
            member={m}
            key={m.userId}
            onClick={select}
            id={m.userId}
          >
            <MemberSlot member={m} />
            <MemberName>{m.userName}</MemberName>
            <strong>{m.userInviteStatus}</strong>
          </ListItem>
        ))}
      </List>
    </React.Fragment>
  );
};

const memberShape = PropTypes.shape({
  memberId: PropTypes.number,
  lastName: PropTypes.string,
  firstName: PropTypes.string,
  mrn: PropTypes.string,
});

MemberInvitationPopup.propTypes = {
  members: PropTypes.arrayOf(memberShape),
  invite: PropTypes.func.isRequired,
  task: PropTypes.shape({
    description: PropTypes.string,
  }).isRequired,
};

MemberInvitationPopup.defaultProps = {
  member: null,
  members: null,
};

const mapStateToProps = store => ({
  members: store.taskListState.orgusersnotintasklist,
});

const mapDispatchToProps = (dispatch, { task }) => ({
  invite: (userId) => {
    inviteMultipleUsersToTaskList(task.taskList.taskListId, [userId])(dispatch);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MemberInvitationPopup);
