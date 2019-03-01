import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Popover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import ButtonBase from '@material-ui/core/ButtonBase';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import BackIcon from '@material-ui/icons/ArrowBack';
import PersonAssignment from '../../img/person-assign.svg';
import PersonInvite from '../../img/person-invite.svg';
import Search from '../../img/search.svg';
import SearchDark from '../../img/search-dark.svg';
import { assignOrReassignTask } from '../../actions/task-actions';
import MemberAssignment from './MemberAssignment';

const SearchTextField = styled(TextField)`
  && {
    width: 100%;
    height: 48px;
    border-radius: 2px;
    background: #fff;
  }

  && .input-base {
    padding: 0;
  }

  && input {
    height: 100%;
    border: none;
    box-shadow: none;
    background: none;
    background: none;
    padding: 16px 14px;
  }
  
  && fieldset {
    border: none;
    top: 0;
  }
`;

const Header = styled.div`
  flex: 0 0;
  padding: 0 10px;
  display: flex;
  align-items: center;
  background: #2a4a70;
  width: 494px;
  height: 73px;
`;

const HeaderClose = styled.div`
  width: 22px;
  height: 22px;
  padding: 4px;
  font-size: 14px;
  color: #fff;
  font-weight: bold;
`;

const HeaderTitle = styled.strong`
  margin-left: 15px;
  color: #fff;
  font-size: 18px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const HeaderTaskName = styled.span`
  text-decoration: underline;
`;

const List = styled.div`
  background: #fff;
  max-height: 255px;
  overflow: auto;
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

const ItemContainer = styled(ButtonBase)`
  && {
    display: block;
    height: 56px;
    width: 100%;
    padding: 0 8px;
    ${({ selected }) => (selected && 'background: #a6dcea;')}

    :hover, :focus {
      ${({ selected }) => (!selected && 'background: rgba(0, 0, 0, 0.08);')}
    }
  }
`;

ItemContainer.propTypes = {
  selected: PropTypes.bool,
};

ItemContainer.defaultProps = {
  selected: false,
};

const Item = styled.div`
  padding: 0 20px;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
`;

const MemberName = styled.span`
  margin-left: 20px;
`;

const ListItem = ({
  member, selected, onClick, id,
}) => (
  <ItemContainer selected={selected} onClick={onClick} id={id}>
    <Item>
      <MemberAssignment member={member} />
      <MemberName>{member ? member.userName : <em>Unassigned</em>}</MemberName>
    </Item>
  </ItemContainer>
);

const StyledPopover = styled(props => <Popover {...props} classes={{ paper: 'paper' }} />)`
  && .paper {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 235px;
  }
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
      <Header>
        <IconButton onClick={this.handleClose} aria-label="Close user selection">
          <HeaderClose>✕</HeaderClose>
        </IconButton>
        <img src={PersonAssignment} style={{ marginLeft: 5 }} alt="" />
        <HeaderTitle>
          {'Assign to '}
          <HeaderTaskName>{task.description}</HeaderTaskName>
        </HeaderTitle>
        <IconButton aria-label="Search" onClick={this.handleSearchToggle} style={{ marginLeft: 'auto' }}>
          <img src={Search} alt="" />
        </IconButton>
      </Header>
    );
  }

  renderSearchHeader = () => (
    <Header>
      <SearchTextField
        autoFocus
        onChange={this.handleSearch}
        id="member-search"
        placeholder="Search"
        variant="outlined"
        InputProps={{
          classes: { root: 'input-base' },
          'aria-label': 'Search',
          type: 'search',
          startAdornment: (
            <InputAdornment position="start">
              <IconButton onClick={this.handleSearchToggle} aria-label="Close search">
                <BackIcon />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end" style={{ pointerEvents: 'none' }}>
              <div style={{ margin: '0 12px 0 0', width: 21, height: 22 }}>
                <img src={SearchDark} alt="" />
              </div>
            </InputAdornment>
          ),
        }}
      />
    </Header>
  );

  render() {
    const { member, small, members } = this.props;
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
        <MemberAssignment onClick={this.handleOpen} member={member} small={small} />
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
            />
            {sortedMembers && sortedMembers.map(m => (
              <ListItem
                member={m}
                key={m.userId}
                selected={member && m.userId === member.userId}
                onClick={this.handleSelect}
                id={m.userId}
              />
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
  member: memberShape,
  members: PropTypes.arrayOf(memberShape),
};

MemberPicker.defaultProps = {
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
