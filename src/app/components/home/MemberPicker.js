import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Popover from '@material-ui/core/Popover';
import ButtonBase from '@material-ui/core/ButtonBase';
import PersonInvite from '../../img/person-invite.svg';
import SearchHeader from './SearchHeader';
import PickerHeader from './PickerHeader';
import ListItem from './ListItem';
import MemberSlot from './MemberSlot';

const StyledPopover = styled(Popover).attrs({
  paper: 'paper',
  anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
  transformOrigin: { vertical: 'top', horizontal: 'center' },
})`
  && .paper {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 235px;
  }
`;

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

const Footer = styled(ButtonBase)`
  && {
    justify-content: flex-start;
    flex: 0 0;
    display: flex;
    align-items: center;
    padding: 0 25px;
    background: #fff;
    height: 75px;
  }
`;

const FooterText = styled.span`
  margin-left: 16px;
  font-size: 14px;
  color: #0ca1c7;
`;

const UNASSIGNED_ELEMENT_ID = -1;

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

const MemberPickerSearchHeader = ({ search, toggleSearch }) => (
  <SearchHeader handleSearch={search} handleSearchToggle={toggleSearch} />
);

const MemberPickerFooter = ({ onClick }) => (
  <Footer onClick={onClick} focusRipple>
    <img src={PersonInvite} alt="" />
    <FooterText>Invite to list</FooterText>
  </Footer>
);

const MemberPicker = ({
  member, members, assign, children: Component, task,
}) => {
  const select = useCallback(
    (e) => {
      const memberId = e.currentTarget.id;
      assign(memberId);
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

  const [anchor, setAnchor] = useState(null);
  const open = useCallback(
    (e) => {
      e.stopPropagation();
      setAnchor(e.currentTarget);
    },
  );
  const close = useCallback(
    () => {
      setAnchor(null);
      setIsSearching(false);
      setSearchTerm('');
    },
  );

  const captureClicks = useCallback(
    (e) => { e.stopPropagation(); },
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
      <Component open={open} />
      <StyledPopover
        onClick={captureClicks}
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={close}
      >
        {isSearching
          ? <MemberPickerSearchHeader search={search} toggleSearch={toggleSearch} />
          : <MemberPickerHeader close={close} toggleSearch={toggleSearch} task={task} />}
        <List>
          <ListItem
            selected={member == null}
            onClick={select}
            id={UNASSIGNED_ELEMENT_ID}
          >
            <MemberSlot />
            <MemberName><em>Unassigned</em></MemberName>
          </ListItem>
          {sortedListings && sortedListings.map(m => (
            <ListItem
              member={m}
              key={m.userId}
              selected={member && m.userId === member.userId}
              onClick={select}
              id={m.userId}
            >
              <MemberSlot member={m} />
              <MemberName>{m.userName}</MemberName>
            </ListItem>
          ))}
        </List>
        <MemberPickerFooter onClick={() => {}} />
      </StyledPopover>
    </React.Fragment>
  );
};

const memberShape = PropTypes.shape({
  memberId: PropTypes.number,
  lastName: PropTypes.string,
  firstName: PropTypes.string,
  mrn: PropTypes.string,
});

MemberPicker.propTypes = {
  member: memberShape,
  members: PropTypes.arrayOf(memberShape),
  assign: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  task: PropTypes.shape({
    description: PropTypes.string,
  }).isRequired,
};

MemberPicker.defaultProps = {
  member: null,
  members: null,
};

export default MemberPicker;
