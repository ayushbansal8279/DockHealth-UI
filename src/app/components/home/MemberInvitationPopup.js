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

const MemberPickerHeader = ({
  backInsteadOfClose,
  close,
  toggleSearch,
  taskList,
}) => (
  <PickerHeader
    handleClose={close}
    handleSearchToggle={toggleSearch}
    closeLabel="Close user selection"
    backInsteadOfClose={backInsteadOfClose}
  >
    {'Invite to '}
    <HeaderTaskName>{taskList.listName}</HeaderTaskName>
  </PickerHeader>
);

const NoResults = styled.div`
  margin-top: 60px;
  text-align: center;
`;

const MemberInvitationPopup = ({
  members, taskList, back, close, invite,
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
      if (back) {
        back();
      } else {
        close();
      }
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

  const filteredListings = searchTerms.length === 0
    ? members
    : members.filter(isMatch);

  const sortedListings = filteredListings.sort(orderListings);

  return (
    <React.Fragment>
      {isSearching
        ? <SearchHeader handleSearch={search} handleSearchToggle={toggleSearch} />
        : <MemberPickerHeader
            backInsteadOfClose={back !== undefined}
            close={handleClose}
            toggleSearch={toggleSearch}
            taskList={taskList}
          />}
      <List>
        {sortedListings.length === 0 && <NoResults>No matching results.</NoResults>}
        {sortedListings.map(m => (
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
  taskList: PropTypes.shape({
    listName: PropTypes.string,
    taskListId: PropTypes.number,
  }).isRequired,
};

MemberInvitationPopup.defaultProps = {
  member: null,
  members: [],
};

const mapStateToProps = store => ({
  members: store.taskListState.orgusersnotintasklist,
});

const mapDispatchToProps = (dispatch, { taskList }) => ({
  invite: (userId) => {
    inviteMultipleUsersToTaskList(taskList.taskListId, [userId])(dispatch);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MemberInvitationPopup);
