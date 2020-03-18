import {
  Button,
  ButtonBase,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Popover,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { moveTask } from '../../actions/task-actions';
import ListItem from './ListItem';
import NoOverflowDialog from './NoOverflowDialog';
import PickerHeader from './PickerHeader';
import SearchHeader from './SearchHeader';

export const StyledPopover = styled(Popover).attrs({ paper: 'paper' })`
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

const ListEmpty = styled.div`
  text-align: center;
  margin-top: 36px;
`;

const ToggleButton = styled(ButtonBase)`
  && {
    font-size: 14px;
    padding: 8px;
    margin-left: -8px;
    border-radius: 4px;

    :hover,
    :focus {
      color: #13a7d1;
    }
  }
`;

export class ListPicker extends React.Component {
  state = {
    anchorEl: null,
    isSearching: false,
    searchTerm: '',
    isConfirmation: false,
  };

  handleSearchToggle = () => {
    const { isSearching } = this.state;
    this.setState({ isSearching: !isSearching, searchTerm: '' });
  };

  handleOpen = event => {
    event.stopPropagation();
    const { items } = this.props;
    if (items == null) {
      return;
    }
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null, isSearching: false, searchTerm: '' });
  };

  handleSelect = () => {
    const { items, assign } = this.props;

    const { itemId } = this.state;
    const newItem = items.find(i => `${i.taskListIdentifier}` === itemId);

    assign(newItem);
    this.handleClose();
  };

  handleSearch = event => {
    this.setState({ searchTerm: event.target.value });
  };

  captureClicks = event => {
    event.stopPropagation();
  };

  openConfirmation = event => {
    this.setState({ isConfirmation: true, itemId: event.currentTarget.id });
  };

  closeConfirmation = () => {
    this.setState({ isConfirmation: false });
  };

  handleConfirmation = () => {
    this.handleSelect();
    this.closeConfirmation();
  };

  renderHeader = () => (
    <PickerHeader
      handleClose={this.handleClose}
      handleSearchToggle={this.handleSearchToggle}
      closeLabel="Close list selection"
    >
      File in
    </PickerHeader>
  );

  renderSearchHeader = () => (
    <SearchHeader
      handleSearch={this.handleSearch}
      handleSearchToggle={this.handleSearchToggle}
    />
  );

  render() {
    const { item, items, task, disabled } = this.props;
    const { anchorEl, isSearching, searchTerm, isConfirmation } = this.state;
    const isOpen = Boolean(anchorEl);

    // Item search
    const searchTerms = searchTerm.toLowerCase().match(/\S+/g) || [];
    const isMatch = name =>
      searchTerms.every(term => name.toLowerCase().includes(term));

    const filteredItems =
      items &&
      (searchTerms.length === 0
        ? items
        : items.filter(({ listName }) => isMatch(listName)));

    const sortedItems = (filteredItems || []).sort((a, b) =>
      a.listName.localeCompare(b.listName),
    );

    return (
      <>
        <ToggleButton
          onClick={this.handleOpen}
          disabled={disabled || task.parentTaskIdentifier}
        >
          {item.listName}
        </ToggleButton>
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
            {sortedItems && sortedItems.length === 0 && (
              <ListEmpty>No matching items.</ListEmpty>
            )}
            {sortedItems &&
              sortedItems.map(i => (
                <ListItem
                  key={i.taskListIdentifier}
                  selected={
                    item && i.taskListIdentifier === item.taskListIdentifier
                  }
                  onClick={this.openConfirmation}
                  id={i.taskListIdentifier}
                >
                  {`${i.listName} (${i.creator.userName})`}
                </ListItem>
              ))}
          </List>
        </StyledPopover>
        <NoOverflowDialog
          open={isConfirmation}
          onClose={this.closeConfirmation}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Are you sure you want to move this task to another list?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Please note, by moving a task to a new list some details of the
              task may be lost. Task assignments and comments will transfer only
              if users are members of both lists.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeConfirmation} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleConfirmation} color="primary" autoFocus>
              Move
            </Button>
          </DialogActions>
        </NoOverflowDialog>
      </>
    );
  }
}

const itemShape = PropTypes.shape({
  taskListIdentifier: PropTypes.string,
  listName: PropTypes.string,
  creator: PropTypes.shape({
    userName: PropTypes.string,
  }),
});

ListPicker.propTypes = {
  disabled: PropTypes.bool,
  item: itemShape.isRequired,
  items: PropTypes.arrayOf(itemShape),
  assign: PropTypes.func.isRequired,
  task: PropTypes.shape({
    parentTaskIdentifier: PropTypes.string,
  }).isRequired,
};

ListPicker.defaultProps = {
  disabled: false,
  items: null,
};

const mapStateToProps = store => ({
  items: store.taskListState.tasklist,
});

const mapDispatchToProps = (dispatch, { task }) => ({
  assign: taskList => {
    moveTask(task, taskList)(dispatch);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ListPicker);
