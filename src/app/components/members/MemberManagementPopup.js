import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import ListItem from '../common/ListItem';
import PickerHeader from '../common/PickerHeader';
import SearchHeader from '../common/SearchHeader';
import MemberManagementOptions from './MemberManagementOptions';
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
  flex: 1;
  text-align: left;
`;

const MemberRole = styled.div`
  color: #ababb2;
  width: 100px;
  text-align: center;
`;

const MemberStatus = styled.div`
  color: #0ca1c7;
  width: 100px;
  text-align: center;
`;

const MEMBER_ACTIVE_STATUS = 'ACTIVE';

const MemberPickerHeader = ({ close, toggleSearch, taskList }) => (
  <PickerHeader
    handleClose={close}
    handleSearchToggle={toggleSearch}
    closeLabel="Close user selection"
  >
    {'Members of '}
    <HeaderTaskName>{taskList.listName}</HeaderTaskName>
  </PickerHeader>
);

const NoResults = styled.div`
  margin-top: 10%;
  text-align: center;
`;

const MemberManagementPopup = ({ member, members, taskList, close }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const search = useCallback(e => {
    setSearchTerm(e.target.value);
  });

  const [isSearching, setIsSearching] = useState(false);
  const toggleSearch = useCallback(
    () => {
      setIsSearching(!isSearching);
      setSearchTerm('');
    },
    [isSearching],
  );

  const handleClose = useCallback(() => {
    setIsSearching(false);
    setSearchTerm('');
    close();
  });

  // member search
  const matchListing = (term, { userName }) => {
    const userNameMatches = userName && userName.toLowerCase().includes(term);
    return userNameMatches;
  };

  const orderListings = (p1, p2) =>
    p1.lastName ? p1.lastName.localeCompare(p2.lastName) : -1;

  // Search
  const searchTerms = searchTerm.toLowerCase().match(/[\S]+/g) || [];
  const isMatch = listing =>
    searchTerms.every(term => matchListing(term, listing));

  const filteredListings =
    members && (searchTerms.length === 0 ? members : members.filter(isMatch));

  const sortedListings =
    filteredListings && filteredListings.sort(orderListings);

  return (
    <React.Fragment>
      {isSearching ? (
        <SearchHeader handleSearch={search} handleSearchToggle={toggleSearch} />
      ) : (
        <MemberPickerHeader
          close={handleClose}
          toggleSearch={toggleSearch}
          taskList={taskList}
        />
      )}
      <List>
        {sortedListings.length === 0 && (
          <NoResults>No matching results.</NoResults>
        )}
        {sortedListings &&
          sortedListings.map(m => (
            <ListItem
              member={m}
              key={m.userId}
              selected={member && m.userId === member.userId}
              id={m.userId}
            >
              <MemberSlot member={m} />
              <MemberName>{m.userName}</MemberName>
              {m.status !== MEMBER_ACTIVE_STATUS && (
                <MemberStatus>{m.status}</MemberStatus>
              )}
              <MemberRole>{m.taskListUserRole}</MemberRole>
              <MemberManagementOptions
                taskListId={taskList.taskListId}
                member={m}
              />
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
  taskListUserRole: PropTypes.string,
  status: PropTypes.string,
});

MemberManagementPopup.propTypes = {
  members: PropTypes.arrayOf(memberShape),
  taskList: PropTypes.shape({
    listName: PropTypes.string,
  }).isRequired,
};

MemberManagementPopup.defaultProps = {
  members: null,
};

export default MemberManagementPopup;
