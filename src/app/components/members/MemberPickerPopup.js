import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

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
  flex: 1;
  text-align: left;
`;

const MemberStatus = styled.div`
  color: #0ca1c7;
  width: 100px;
  text-align: center;
`;

const UNASSIGNED_ELEMENT_ID = -1;

const MEMBER_ACTIVE_STATUS = 'ACTIVE';

const MemberPickerHeader = ({ close, toggleSearch, task }) => (
  <PickerHeader
    handleClose={close}
    handleSearchToggle={toggleSearch}
    closeLabel="Close user selection"
  >
    {'Assign to '}
    <HeaderTaskName>{task.description}</HeaderTaskName>
  </PickerHeader>
);

const MemberPickerPopup = ({ member, members, assign, task, close }) => {
  const select = useCallback(e => {
    const memberId = e.currentTarget.id;
    assign(memberId);
  });

  const deselect = useCallback(() => {
    assign(UNASSIGNED_ELEMENT_ID);
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
    close();
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
    members && (searchTerms.length === 0 ? members : members.filter(isMatch));

  const sortedListings =
    filteredListings && filteredListings.sort(orderListings);

  return (
    <>
      {isSearching ? (
        <SearchHeader handleSearch={search} handleSearchToggle={toggleSearch} />
      ) : (
        <MemberPickerHeader
          close={handleClose}
          toggleSearch={toggleSearch}
          task={task}
        />
      )}
      <List>
        <ListItem selected={member == null} onClick={deselect}>
          <MemberSlot />
          <MemberName>Unassigned</MemberName>
        </ListItem>
        {sortedListings &&
          sortedListings.map(m => (
            <ListItem
              member={m}
              key={m.userIdentifier}
              selected={member && m.userIdentifier === member.userIdentifier}
              onClick={select}
              id={m.userIdentifier}
            >
              <MemberSlot member={m} />
              <MemberName>{m.userName}</MemberName>
              {m.status !== MEMBER_ACTIVE_STATUS && (
                <MemberStatus>{m.status}</MemberStatus>
              )}
            </ListItem>
          ))}
      </List>
    </>
  );
};

const memberShape = PropTypes.shape({
  memberId: PropTypes.string,
  lastName: PropTypes.string,
  firstName: PropTypes.string,
  mrn: PropTypes.string,
  taskListUserRole: PropTypes.string,
  status: PropTypes.string,
});

MemberPickerPopup.propTypes = {
  member: memberShape,
  members: PropTypes.arrayOf(memberShape),
  assign: PropTypes.func.isRequired,
  task: PropTypes.shape({
    description: PropTypes.string,
  }).isRequired,
};

MemberPickerPopup.defaultProps = {
  member: null,
  members: null,
};

export default MemberPickerPopup;
