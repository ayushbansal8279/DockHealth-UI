import $ from 'jquery';
import React from 'react';
import Autosuggest from 'react-autosuggest';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { arrayPush, change, Field, reduxForm, reset } from 'redux-form';

import * as PeopleActions from '../../actions/people-actions';
import * as TaskListActions from '../../actions/tasklist-actions';
import BaseComponentWithAutoComplete from '../LEGACY_base/BaseComponentWithAutoComplete';
import BasicField from '../common/BasicField';
import MemberInitials from '../members/MemberInitials';
import Member from '../members/Member';

class AddListForm extends BaseComponentWithAutoComplete {
  constructor(props) {
    super(props);
    this.state = {
      saveResultMessage: '',
      selectedMembers: [],
      selectedAdmins: [],
      selectedSuggestion: '',
      selectedSuggestionForAdmin: '',
      selectedSuggestionForMember: '',
      suggestions: [],
    };
    this.getSuggestions = this.getSuggestions.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
    this.renderSuggestionsContainer = this.renderSuggestionsContainer.bind(
      this,
    );
    this.renderInputComponent = this.renderInputComponent.bind(this);
  }

  componentDidMount() {
    this.props.peopleActions.findAllUsersByOrganizationId();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.taskListId != nextProps.taskListId) {
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
    enableFoundationAccordionComponent('.add-form-wrapper');
  }

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
            (person.firstName != this.props.currentUserProfile.firstName ||
              person.lastName != this.props.currentUserProfile.lastName),
        );
  };

  getSuggestionValue = suggestion =>
    `${suggestion.firstName} ${suggestion.lastName}`;

  // Use your imagination to render suggestions.
  renderSuggestion = suggestion => (
    <div className="row condense expanded border-bottom align-middle">
      <div className="columns shrink">
        <Member member={suggestion}/>
      </div>
      <div className="columns">
        <span className="item-title">
          {suggestion.firstName} {suggestion.lastName}
{' '}
        </span>
        {suggestion.userInviteStatus == 'PENDING' && (
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

  onSuggestionSelectedForAdmins = (
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method },
  ) => {
    this.setState({
      selectedAdmins: [suggestion].concat(this.state.selectedAdmins),
      suggestions: [],
      selectedSuggestionForAdmin: '',
    });
    $('.addAdminForList').click();
  };

  onSuggestionSelectedForMembers = (
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method },
  ) => {
    this.setState({
      selectedMembers: [suggestion].concat(this.state.selectedMembers),
      suggestions: [],
      selectedSuggestionForMember: '',
    });
    $('.addMemberForList').click();
  };

  onSubmit(formProps) {
    // this.sendInvitations (selectedMembers)
    // this.sendInvitations (selectedAdmins)

    const taskList = {};
    taskList.taskListId = this.props.taskListId;
    taskList.listName = formProps.listName;
    taskList.notifications = formProps.notifications;
    taskList.admins = [];
    if (this.state.selectedAdmins.length > 0) {
      var k = 0;
      for (k in this.state.selectedAdmins) {
        taskList.admins.push(this.state.selectedAdmins[k].userId);
      }
    }
    taskList.members = [];
    if (this.state.selectedMembers.length > 0) {
      var k = 0;
      for (k in this.state.selectedMembers) {
        taskList.members.push(this.state.selectedMembers[k].userId);
      }
    }

    const component = this;
    this.props.taskListActions
      .saveTaskList(taskList)
      .then(res => {
        component.setState({ saveResultMessage: 'List saved successfully!!' });
        component.props.formActions.reset('addListForm');
        // hide the form
        $('.add').click();
      })
      .catch(error => {
        component.setState({
          saveResultMessage: `${error.message}: ${
            error.response.data.errorMessage
          }`,
        });
      });
  }

  cancelEdit = (event) => {
    toggleTaskForm();
    event.preventDefault();
  };

  openMemberList = (e, triggerClass) => {
    $('.adminsList')
      .first()
      .trigger('click');
  };

  render() {
    const {
      selectedSuggestion,
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
      <div className="add-form-wrapper" style={{marginTop: "10px", marginBottom: "-50px"}}>
        <div className="task-item add-form row expanded">
          <form
            className="inline-label"
            onSubmit={this.props.handleSubmit(this.onSubmit.bind(this))}
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
                    <Member
                      member={this.props.listOwner}
                    />
                  </li>
                </ul>
              </div>
            </div>

            {/* <!-- Admins --> */}
            {/* <div className="column large-12 input-group no-icon static-label accordion" data-accordion data-allow-all-closed="true">
              <div className="input-wrapper accordion-item" data-accordion-item>
                <label>Admins</label>
                <ul className="menu member-photo-list" onClick={(e) => this.openMemberList(e, 'adminsList')}>
                  <li><span className="add-member circle medium addAdminForList">+</span></li>
                  {this.state.selectedAdmins && this.state.selectedAdmins.map(member => {
                    return(
                      <li key={"list_admin_"+member.userId}><Member member={member}/></li>
                    )
                  })}
                </ul>
                <a href="#" className="adminsList accordion-title">Open Autosuggest</a>
                <div className="accordion-content" data-tab-content>
                    <Autosuggest
                      suggestions={suggestions}
                      getSuggestionValue={this.getSuggestionValue}
                      renderSuggestion={this.renderSuggestion}
                      onSuggestionSelected={this.onSuggestionSelectedForAdmins}
                      inputProps={inputPropsForAdmins}
                      onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                      onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                      renderSuggestionsContainer={this.renderSuggestionsContainer}
                      renderInputComponent={this.renderInputComponent}
                    />
                </div>
              </div>
            </div> */}

            {/* <!-- Admins --> */}
            <div
              className="column large-12 input-group no-icon static-label accordion"
              data-accordion
              data-allow-all-closed="true"
            >
              <div className="input-wrapper accordion-item" data-accordion-item>
                <a href="#" className="accordion-title">
                  <label>Admins</label>
                  <ul className="menu member-photo-list">
                    <li>
                      <span className="add-member circle medium addAdminForList">
                        +
                      </span>
                    </li>
                    {this.state.selectedAdmins &&
                      this.state.selectedAdmins.map(member => {
                        return (
                          <li key={`list_admin_${member.userId}`}>
                            <Member
                              member={member}
                            />
                          </li>
                        );
                      })}
                  </ul>
                </a>
                <div className="accordion-content" data-tab-content>
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
              </div>
            </div>

            {/* <!--Members --> */}
            <div
              className="column large-12 input-group no-icon static-label accordion"
              data-accordion
              data-allow-all-closed="true"
            >
              <div className="input-wrapper accordion-item" data-accordion-item>
                <a href="#" className="accordion-title">
                  <label>Members</label>
                  <ul className="menu member-photo-list">
                    <li>
                      <span className="add-member circle medium addMemberForList">
                        +
                      </span>
                    </li>
                    {this.state.selectedMembers &&
                      this.state.selectedMembers.map(member => {
                        return (
                          <li key={`list_member_${member.userId}`}>
                            <Member
                              member={member}
                            />
                          </li>
                        );
                      })}
                  </ul>
                </a>
                <div className="accordion-content" data-tab-content>
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
              </div>
            </div>

            <div className="row collapse expanded align-middle">
              <div className="columns text-center">
                {this.state.saveResultMessage}
              </div>
            </div>

            {/* <!-- Do not disturb --> */}
            <div className="column top-buffer large-12">
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
                  onClick={e => this.cancelEdit(e)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

AddListForm = reduxForm({
  // a unique name for the form
  form: 'addListForm',
  enableReinitialize: true,
})(AddListForm);

const mapStateToProps = function(store) {
  let initialTaskListValues = {};
  let taskListId = 0;
  let listOwner = {};
  if (store.taskListState.currentList) {
    initialTaskListValues = store.taskListState.currentList;
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
  // var initialValues = {}
  // if(this.props.taskList){
  //   initialValues = this.props.taskList
  // }
  // return{
  //   initialValues: initialValues
  // }
};

const mapDispatchToProps = function(dispatch) {
  return {
    taskListActions: bindActionCreators(TaskListActions, dispatch),
    peopleActions: bindActionCreators(PeopleActions, dispatch),
    formActions: bindActionCreators({ reset, change, arrayPush }, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddListForm);
