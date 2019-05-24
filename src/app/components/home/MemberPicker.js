import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Popover from '@material-ui/core/Popover';
import ButtonBase from '@material-ui/core/ButtonBase';
import SearchHeader from './SearchHeader';
import PickerHeader from './PickerHeader';
import ListItem from './ListItem';
import PersonInvite from '../../img/person-invite.svg';
import { assignOrReassignTask } from '../../actions/task-actions';
import MemberAssignment from './MemberAssignment';

const StyledPopover = styled(Popover).attrs({ paper: 'paper' })`
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
    flex-shrink: 0;
    flex-grow: 0;
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

const UNASSIGNED_MEMBER_ID = -1;

class MemberPicker extends React.Component {
  state = {
    anchorEl: null,
    isSearching: false,
    searchTerm: '',
  }

  handleSearchToggle = () => {
    const { isSearching } = this.state;
    this.setState({ isSearching: !isSearching, searchTerm: '' });
  }

  handleOpen = (e) => {
    e.stopPropagation();
    const { members } = this.props;
    if (members == null) { return; }
    this.setState({ anchorEl: e.currentTarget });
  }

  handleClose = () => {
    this.setState({ anchorEl: null, isSearching: false, searchTerm: '' });
  }

  handleSelect = (e) => {
    const { task, assign } = this.props;
    const userId = e.currentTarget.id;
    assign(task, userId);
  }

  handleSearch = (e) => {
    this.setState({ searchTerm: e.target.value });
  }

  captureClicks = (e) => {
    e.stopPropagation();
  }

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
  }

  renderSearchHeader = () => (
    <SearchHeader handleSearch={this.handleSearch} handleSearchToggle={this.handleSearchToggle} />
  );

  render() {
    const {
      member, small, members, disabled,
    } = this.props;
    const { anchorEl, isSearching, searchTerm } = this.state;
    const isOpen = Boolean(anchorEl);

    // Member search
    const searchTerms = searchTerm.toLowerCase().match(/[\S]+/g) || [];
    const isMatch = userName => searchTerms.every(term => userName.toLowerCase().includes(term));

    const filteredMembers = members
      && (searchTerms.length === 0
        ? members
        : members.filter(({ userName }) => isMatch(userName)));

    const sortedMembers = filteredMembers
      && filteredMembers.sort((a, b) => a.lastName.localeCompare(b.lastName));

    return (
      <React.Fragment>
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
              <MemberAssignment />
              <MemberName><em>Unassigned</em></MemberName>
            </ListItem>
            {sortedMembers && sortedMembers.map(m => (
              <ListItem
                member={m}
                key={m.userId}
                selected={member && m.userId === member.userId}
                onClick={this.handleSelect}
                id={m.userId}
              >
                <MemberAssignment member={m} />
                <MemberName>{m.userName}</MemberName>
              </ListItem>
            ))}
          </List>
          <Footer onClick={() => {}} focusRipple>
            <img src={PersonInvite} alt="" />
            <FooterText>Invite to list</FooterText>
          </Footer>
        </StyledPopover>
      </React.Fragment>
    );
  }
}

const memberShape = PropTypes.shape({
  userId: PropTypes.number,
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
};

export default connect(mapStateToProps, mapDispatchToProps)(MemberPicker);
