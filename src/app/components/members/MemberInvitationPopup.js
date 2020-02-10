import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import {
  inviteMultipleUsersToTaskList,
  getMembersByTaskListId,
} from '../../actions/tasklist-actions';
import ListItem from '../common/ListItem';
import PickerHeader from '../common/PickerHeader';
import SearchHeader from '../common/SearchHeader';
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

const MemberInvitationPopup = ({ members, taskList, back, close, invite }) => {
  // TODO: Fetch getOrganizationUsersNotInTaskList ?
  const select = useCallback(e => {
    const memberId = e.currentTarget.id;
    invite(memberId);
  });

  const [searchTerm, setSearchTerm] = useState('');
  const search = useCallback(e => {
    setSearchTerm(e.target.value);
  });

  const [isSearching, setIsSearching] = useState(false);
  const toggleSearch = useCallback(() => {
    setIsSearching(!isSearching);
    setSearchTerm('');
  }, [isSearching]);

  const handleClose = useCallback(() => {
    setIsSearching(false);
    setSearchTerm('');
    if (back) {
      back();
    } else {
      close();
    }
  });

  // member search
  const matchListing = (term, { userName }) => {
    return userName && userName.toLowerCase().includes(term);
  };

  const orderListings = (p1, p2) =>
    p1.lastName ? p1.lastName.localeCompare(p2.lastName) : -1;

  // Search
  const searchTerms = searchTerm.toLowerCase().match(/\S+/g) || [];
  const isMatch = listing =>
    searchTerms.every(term => matchListing(term, listing));

  const filteredListings =
    searchTerms.length === 0 ? members : members.filter(isMatch);

  // const sortedListings = filteredListings.sort(orderListings);
  const sortedListings = filteredListings;

  return (
    <>
      {isSearching ? (
        <SearchHeader handleSearch={search} handleSearchToggle={toggleSearch} />
      ) : (
        <MemberPickerHeader
          backInsteadOfClose={back !== undefined}
          close={handleClose}
          toggleSearch={toggleSearch}
          taskList={taskList}
        />
      )}
      <List>
        {sortedListings.length === 0 && (
          <NoResults>No matching results.</NoResults>
        )}
        {sortedListings.map(m => (
          <ListItem
            member={m}
            key={m.userIdentifier}
            onClick={select}
            id={m.userIdentifier}
            style={{ opacity: m.userStatus === 'INVITED' ? '0.5' : '1.0' }}
          >
            <MemberSlot member={m} />
            <MemberName>{m.userName}</MemberName>
          </ListItem>
        ))}
      </List>
    </>
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
    taskListIdentifier: PropTypes.number,
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
  invite: userIdentifier => {
    inviteMultipleUsersToTaskList(taskList.taskListIdentifier, [userIdentifier])(dispatch).then(
      () => getMembersByTaskListId(taskList.taskListIdentifier, 'ALL')(dispatch),
    );
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MemberInvitationPopup);
