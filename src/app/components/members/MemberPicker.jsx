import { Popover } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { assignOrReassignTask } from '../../actions/task-actions';
import { getMembersByTaskListId } from '../../actions/tasklist-actions';
import palette from '../../palette';
import ListItem from '../common/ListItem';
import PickerHeader from '../common/PickerHeader';
import SearchHeader from '../common/SearchHeader';
import MemberAssignment from './MemberAssignment';
import MemberSlot from './MemberSlot';

const StyledPopover = styled(Popover).attrs({ paper: 'paper' })`
  && .paper {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 235px;
  }
`;

const List = styled.div`
  background: ${palette.white};
  max-height: 255px;
  overflow: auto;
`;

const HeaderTaskName = styled.span`
  text-decoration: underline;
`;

export const MemberName = styled.span`
  margin-left: 20px;
`;

const UNASSIGNED_MEMBER_ID = -1;

class MemberPicker extends React.Component {
  state = {
    anchorEl: null,
    isSearching: false,
    searchTerm: '',
  };

  handleSearchToggle = () => {
    const { isSearching } = this.state;
    this.setState({ isSearching: !isSearching, searchTerm: '' });
  };

  handleOpen = event => {
    event.stopPropagation();
    const { members, loadMembers, task } = this.props;
    loadMembers(task.taskList.taskListIdentifier, 'ALL');
    if (members == null) {
      return;
    }
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null, isSearching: false, searchTerm: '' });
  };

  handleSelect = event => {
    const { task, assign } = this.props;
    const userIdentifier = event.currentTarget.id;
    assign(task, userIdentifier);
    this.handleClose();
  };

  handleSearch = event => {
    this.setState({ searchTerm: event.target.value });
  };

  captureClicks = event => {
    event.stopPropagation();
  };

  renderHeader = () => {
    const { task } = this.props;
    return (
      <PickerHeader
        handleClose={this.handleClose}
        handleSearchToggle={this.handleSearchToggle}
        closeLabel="Close user selection"
      >
        {'Assign to '}
        <HeaderTaskName>{task.description}</HeaderTaskName>
      </PickerHeader>
    );
  };

  renderSearchHeader = () => (
    <SearchHeader
      handleSearch={this.handleSearch}
      handleSearchToggle={this.handleSearchToggle}
    />
  );

  render() {
    const { member: propertyMember, small, members, disabled } = this.props;
    const { anchorEl, isSearching, searchTerm } = this.state;
    const isOpen = Boolean(anchorEl);

    const member = propertyMember ? { ...propertyMember } : null;

    // Member search
    const searchTerms = searchTerm.toLowerCase().match(/\S+/g) || [];
    const isMatch = userName =>
      searchTerms.every(term => userName.toLowerCase().includes(term));

    const filteredMembers =
      members &&
      (searchTerms.length === 0
        ? members
        : members.filter(({ userName }) => isMatch(userName)));

    const sortedMembers =
      filteredMembers &&
      filteredMembers.sort((a, b) => a.lastName.localeCompare(b.lastName));

    const currentUserMembers =
      members &&
      member &&
      members.filter(m => m.userIdentifier === member.userIdentifier);

    if (currentUserMembers && currentUserMembers.length > 0) {
      member.bubbleColor = currentUserMembers[0].bubbleColor;
    }

    return (
      <>
        <MemberAssignment
          onClick={this.handleOpen}
          member={member}
          small={small}
          disabled={disabled}
        />
        <StyledPopover
          onClick={this.captureClicks}
          open={isOpen}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          {isSearching ? this.renderSearchHeader() : this.renderHeader()}
          <List>
            <ListItem
              selected={member == null}
              onClick={this.handleSelect}
              id={UNASSIGNED_MEMBER_ID}
            >
              <MemberSlot />
              <MemberName>Unassigned</MemberName>
            </ListItem>
            {sortedMembers &&
              sortedMembers.map(m => (
                <ListItem
                  member={m}
                  key={m.userIdentifier}
                  selected={
                    member && m.userIdentifier === member.userIdentifier
                  }
                  onClick={this.handleSelect}
                  id={m.userIdentifier}
                >
                  <MemberSlot member={m} />
                  <MemberName>{m.userName}</MemberName>
                </ListItem>
              ))}
          </List>
        </StyledPopover>
      </>
    );
  }
}

const memberShape = PropTypes.shape({
  userIdentifier: PropTypes.string,
  profileThumbnailPictureHash: PropTypes.string,
  initials: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
});

MemberPicker.propTypes = {
  disabled: PropTypes.bool,
  member: memberShape,
  members: PropTypes.arrayOf(memberShape),
};

MemberPicker.defaultProps = {
  disabled: false,
  member: null,
  members: null,
};

const mapStateToProps = store => ({
  members: store.taskListState.tasklistmembers,
});

const mapDispatchToProps = {
  assign: assignOrReassignTask,
  loadMembers: getMembersByTaskListId,
};

export default connect(mapStateToProps, mapDispatchToProps)(MemberPicker);
