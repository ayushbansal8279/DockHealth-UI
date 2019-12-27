/* eslint-disable jsx-a11y/label-has-associated-control */
import $ from 'jquery';
import prop from 'ramda/es/prop';
import React from 'react';
import Autosuggest from 'react-autosuggest';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { arrayPush, change, Field, reduxForm, reset } from 'redux-form';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import escape from 'lodash.escape';

import * as PeopleActions from '../../actions/people-actions';
import * as TaskListActions from '../../actions/tasklist-actions';
import {
  onTaskListAdded,
  onTaskListEdited,
} from '../../helpers/ga-event-helper';
import BasicField from '../common/BasicField';
import BaseComponentWithAutoComplete from '../LEGACY_base/BaseComponentWithAutoComplete';
import Member from '../members/Member';

const TaskItem = styled.div`
  background-color: #fff;
  display: flex;
  flex-flow: row wrap;
  margin: 0 auto;
  padding: 0.75rem 0.5rem;
`;

class AddListForm extends BaseComponentWithAutoComplete {
  state = {
    saveResultMessage: '',
    selectedMembers: [],
    selectedAdmins: [],
    selectedSuggestion: '',
    selectedSuggestionForAdmin: '',
    selectedSuggestionForMember: '',
    suggestions: [],
    showAdminSelectionList: false,
    showMemberSelectionList: false,
  };

  componentDidMount() {
    this.props.peopleActions.findAllUsersByOrganizationId();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.taskListId !== nextProps.taskListId) {
      this.setState({
        selectedAdmins: [],
        selectedMembers: [],
      });
    }
    if (nextProps.taskListId > 0) {
      if (nextProps.initialValues.adminUsers) {
        this.setState({
          selectedAdmins: nextProps.initialValues.adminUsers,
        });
      }
      if (nextProps.initialValues.memberUsers) {
        this.setState({
          selectedMembers: nextProps.initialValues.memberUsers,
        });
      }
    }
  }

  componentDidUpdate() {
    // enableFoundationAccordionComponent('.add-form-wrapper');
  }

  openAdminSelectionList = () => {
    this.setState({
      showAdminSelectionList: !this.state.showAdminSelectionList,
    });
  };

  openMemberSelectionList = () => {
    this.setState({
      showMemberSelectionList: !this.state.showMemberSelectionList,
    });
  };

  // TODO Make sure not to suggest added users.
  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : this.props.peoplelist.filter(
          person =>
            (person.firstName.toLowerCase().slice(0, inputLength) ===
              inputValue ||
              person.lastName.toLowerCase().slice(0, inputLength) ===
                inputValue) &&
            // TODO Literally right here. Replace this check with a check against every first name or last name in the list.
            (person.firstName !== this.props.currentUserProfile.firstName ||
              person.lastName !== this.props.currentUserProfile.lastName) &&
            !this.checkPersonAlreadySelected(person),
        );
  };

  checkPersonAlreadySelected = ({ userId: personUserId }) => {
    const { selectedAdmins, selectedMembers } = this.state;

    return Boolean(
      selectedAdmins.find(({ userId }) => userId === personUserId) ||
        selectedMembers.find(({ userId }) => userId === personUserId),
    );
  };

  getSuggestionValue = suggestion =>
    `${suggestion.firstName} ${suggestion.lastName}`;

  // Use your imagination to render suggestions.
  renderSuggestion = suggestion => (
    <div className="row condense expanded border-bottom align-middle">
      <div className="columns shrink">
        <Member member={suggestion} />
      </div>
      <div className="columns">
        <span className="item-title">
          {`${suggestion.firstName} ${suggestion.lastName}`}
        </span>
        {suggestion.userInviteStatus === 'PENDING' && (
          <span className="item-details highlight">Invited</span>
        )}
      </div>
    </div>
  );

  onChangeSuggestionSearchForAdmins = (event, { newValue }) => {
    this.setState({
      selectedSuggestionForAdmin: newValue,
    });
  };

  onChangeSuggestionSearchForMembers = (event, { newValue }) => {
    this.setState({
      selectedSuggestionForMember: newValue,
    });
  };

  onSuggestionSelectedForAdmins = (event, { suggestion }) => {
    this.setState(previousState => ({
      selectedAdmins: [suggestion].concat(previousState.selectedAdmins),
      suggestions: [],
      selectedSuggestionForAdmin: '',
      showAdminSelectionList: false,
    }));
  };

  onSuggestionSelectedForMembers = (event, { suggestion }) => {
    this.setState(previousState => ({
      selectedMembers: [suggestion].concat(previousState.selectedMembers),
      suggestions: [],
      selectedSuggestionForMember: '',
      showMemberSelectionList: false,
    }));
  };

  onSubmit = ({ listName, notifications }) => {
    const { selectedAdmins, selectedMembers } = this.state;
    const { currentList, taskLists = [], taskListId } = this.props;

    const taskListNames = taskLists
      .filter(
        ({ taskListId: filteredTaskListId }) =>
          filteredTaskListId !== taskListId,
      )
      .map(({ listName: taskListName }) => taskListName.toLowerCase());

    if (taskListNames.includes(listName.toLowerCase())) {
      Swal.fire({
        title: 'Error',
        html: `Task list with name <b>${escape(listName)}</b> already exists`,
        icon: 'error',
      });
      return;
    }

    const taskList = { ...currentList };
    taskList.taskListId = taskListId;
    taskList.listName = listName;
    taskList.notifications = notifications;
    taskList.admins = selectedAdmins.map(prop('userId'));
    taskList.members = selectedMembers.map(prop('userId'));

    this.props.taskListActions
      .saveTaskList(taskList)
      .then(() => {
        this.setState({ saveResultMessage: 'List saved successfully!!' });
        this.props.formActions.reset('addListForm');
        if (taskList.taskListId) {
          onTaskListEdited();
        } else {
          onTaskListAdded();
        }
        $('.add').click();
      })
      .catch(error => {
        this.setState({
          saveResultMessage: `${error.message}: ${error.response.data.errorMessage}`,
        });
      });
  };

  cancelEdit = event => {
    toggleTaskForm();
    event.preventDefault();
  };

  openMemberList = () => {
    $('.adminsList')
      .first()
      .trigger('click');
  };

  render() {
    const {
      selectedSuggestionForAdmin,
      selectedSuggestionForMember,
      suggestions,
    } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputPropsForAdmins = {
      placeholder: 'Add a new admin',
      value: selectedSuggestionForAdmin,
      onChange: this.onChangeSuggestionSearchForAdmins,
    };

    const inputPropsForMembers = {
      placeholder: 'Add a new member',
      value: selectedSuggestionForMember,
      onChange: this.onChangeSuggestionSearchForMembers,
    };

    return (
      <div
        className="add-form-wrapper"
        style={{
          margin: 0,
          padding: 0,
          width: '100%',
        }}
      >
        <TaskItem>
          <form
            className="inline-label"
            onSubmit={this.props.handleSubmit(this.onSubmit)}
          >
            <div className="column large-12 text-center">
              <h5 className="section-title">Add/Edit a list</h5>
            </div>

            <input type="hidden" name="taskListId" value="" />
            {/* <!-- List name --> */}
            <Field
              name="listName"
              type="text"
              component={BasicField}
              label="List name"
            />

            {/* <!-- Owner --> */}
            <div className="column large-12 input-group no-icon static-label">
              <div className="input-wrapper">
                <label>Owner</label>
                <ul className="menu member-photo-list">
                  <li>
                    <Member member={this.props.listOwner} />
                  </li>
                </ul>
              </div>
            </div>

            {/* <!-- Admins --> */}
            <div
              className="column large-12 no-icon static-label"
              style={{ paddingBottom: '20px' }}
            >
              <div className="input-wrapper">
                <div>
                  <label>Admins</label>
                  <ul
                    className="menu member-photo-list"
                    onClick={this.openAdminSelectionList}
                  >
                    <li>
                      <span className="add-member circle medium addAdminForList">
                        +
                      </span>
                    </li>
                    {this.state.selectedAdmins?.map(member => {
                      return (
                        <li key={`list_admin_${member.userId}`}>
                          <Member member={member} />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              {this.state.showAdminSelectionList && (
                <div>
                  <Autosuggest
                    suggestions={suggestions}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
                    onSuggestionSelected={this.onSuggestionSelectedForAdmins}
                    inputProps={inputPropsForAdmins}
                    onSuggestionsFetchRequested={
                      this.onSuggestionsFetchRequested
                    }
                    onSuggestionsClearRequested={
                      this.onSuggestionsClearRequested
                    }
                    renderSuggestionsContainer={this.renderSuggestionsContainer}
                    renderInputComponent={this.renderInputComponent}
                  />
                </div>
              )}
            </div>

            {/* <!--Members --> */}
            <div
              className="column large-12 no-icon static-label"
              style={{ paddingBottom: '20px' }}
            >
              <div className="input-wrapper">
                <div>
                  <label>Members</label>
                  <ul
                    className="menu member-photo-list"
                    onClick={this.openMemberSelectionList}
                  >
                    <li>
                      <span className="add-member circle medium addMemberForList">
                        +
                      </span>
                    </li>
                    {this.state.selectedMembers?.map(member => {
                      return (
                        <li key={`list_member_${member.userId}`}>
                          <Member member={member} />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              {this.state.showMemberSelectionList && (
                <div>
                  <Autosuggest
                    suggestions={suggestions}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
                    onSuggestionSelected={this.onSuggestionSelectedForMembers}
                    inputProps={inputPropsForMembers}
                    onSuggestionsFetchRequested={
                      this.onSuggestionsFetchRequested
                    }
                    onSuggestionsClearRequested={
                      this.onSuggestionsClearRequested
                    }
                    renderSuggestionsContainer={this.renderSuggestionsContainer}
                    renderInputComponent={this.renderInputComponent}
                  />
                </div>
              )}
            </div>

            {/* <!-- Do not disturb --> */}
            <div
              className="column large-12 no-icon static-label"
              style={{ paddingBottom: '20px' }}
            >
              <div className="row collapse">
                <div className="column">
                  <span className="item-content">Do not disturb</span>
                  <span className="details">
                    Disable notifications for this list
                  </span>
                </div>
                <div className="column shrink">
                  <div className="switch">
                    <input
                      className="switch-input"
                      id="notifications"
                      type="checkbox"
                      name="notifications"
                    />
                    <label className="switch-paddle" htmlFor="notifications">
                      <span className="show-for-sr" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- SAVE --> */}
            <div className="row expanded">
              <div className="columns shrink align-right">
                <input
                  id="addTaskListButton"
                  type="submit"
                  className="button secondary medium"
                  value="Save"
                />
              </div>
              <div className="columns shrink align-right">
                <button
                  id="cancelTaskListButton"
                  type="button"
                  className="button medium"
                  onClick={event => this.cancelEdit(event)}
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="row collapse expanded align-middle">
              <div className="columns text-center">
                {this.state.saveResultMessage}
              </div>
            </div>
          </form>
        </TaskItem>
      </div>
    );
  }
}

const ConnectedAddListForm = reduxForm({
  form: 'addListForm',
  enableReinitialize: true,
})(AddListForm);

const mapStateToProps = store => {
  let initialTaskListValues = {};
  let taskListId = 0;
  let listOwner = {};
  if (store.taskListState.currentList) {
    initialTaskListValues = store.taskListState.currentList;
    // eslint-disable-next-line prefer-destructuring
    taskListId = store.taskListState.currentList.taskListId;
    listOwner = store.taskListState.currentList.creator;
  } else {
    listOwner = store.userState.userProfile;
  }
  return {
    initialValues: initialTaskListValues,
    currentUserProfile: store.userState.userProfile,
    peoplelist: store.peopleState.peoplelist,
    taskListId,
    currentList: store.taskListState.currentList,
    listOwner,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    taskListActions: bindActionCreators(TaskListActions, dispatch),
    peopleActions: bindActionCreators(PeopleActions, dispatch),
    formActions: bindActionCreators({ reset, change, arrayPush }, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConnectedAddListForm);
