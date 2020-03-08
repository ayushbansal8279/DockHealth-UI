import $ from 'jquery';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { destroy, Field, reduxForm, reset } from 'redux-form';

import * as TaskListActions from '../../actions/tasklist-actions';
import BaseComponentWithAutoComplete from '../LEGACY_base/BaseComponentWithAutoComplete';
import BasicField from '../common/BasicField';
import MemberInitials from '../members/MemberInitials';

class ListMembers extends BaseComponentWithAutoComplete {
  constructor(props) {
    super(props);
    this.state = {
      inviteUserResult: '',
      selectedUserId: null,
      curTaskListId: null,
    };
  }

  // addListMember(e) {
  onSubmit(formProps) {
    // var selectedUserId = formProps.selectedUserId;
    const selectedUserId = $('#add-member-to-list-id').val();
    // var selectedUserId = this.state.selectedUserId;

    if (selectedUserId == null) {
      alert('User must be selected before inviting to this list.');
    } else {
      const inviteUsers = [];
      inviteUsers.push(selectedUserId);
      this.props.taskListActions
        .inviteMultipleUsersToTaskList(
          this.props.currentList.taskListIdentifier,
          inviteUsers,
        )
        .then(res => {
          this.props.formActions.reset('ListMembersAddForm');
          // this.setState({inviteUserResult: 'Invitation sent successfully!!'}); //this will cause render to be called
          if (this.props.currentList.taskListIdentifier) {
            this.props.taskListActions.getMembersByTaskListId(
              this.props.currentList.taskListIdentifier,
              'ALL',
            );
          }
          closePopup(`#list-members-${this.props.currentList.taskListIdentifier}`);
        })
        .catch(error => {
          this.setState({
            inviteUserResult: `${error.message}: ${
              error.response.data.errorMessage
            }`,
          });
        });
    }
  }

  componentDidMount() {
    // console.log('mount list members');
    this.props.formActions.destroy('ListMembersAddForm');
  }

  componentWillUnmount() {
    // console.log('unmount list members');
  }

  componentWillUpdate(nextProps) {
    console.log(`ListMembers componentWillUpdate: ${nextProps}`);
    enableAutoCompleteForListMembers(
      nextProps.orgusersnotintasklist,
      nextProps.currentList.taskListIdentifier,
      process.env.HEYDOC_SERVICES_BASE_URL,
    );
  }

  componentWillReceiveProps(nextProps) {
    if (
      (nextProps.currentList && !this.props.currentList) ||
      (nextProps.currentList &&
        this.props.currentList &&
        nextProps.currentList.taskListIdentifier != this.props.currentList.taskListIdentifier)
    ) {
      this.setState({ curTaskListId: nextProps.currentList.taskListIdentifier });
      console.log(
        `in componentWillReceiveProps -- curTaskListId: ${
          nextProps.currentList.taskListIdentifier
        }`,
      );
    }
  }

  componentDidUpdate(prevProps, prevState) {
    enableFoundationComponent('.scroll-wrapper');
    console.log('ListMembers didUpdate');
  }

  // shouldComponentUpdate(nextProps, nextState) {
  // 	if(!this.props.currentList
  // 		|| !this.props.members
  // 		|| (nextProps.currentList && this.props.currentList.taskListIdentifier != nextProps.currentList.taskListIdentifier)
  // 		|| (nextProps.members && this.props.members.length != nextProps.members.length)){
  // 		return true
  // 	}
  // 	return false
  // }

  deleteMember = member => {
    this.props.taskListActions
      .removeUserFromTaskList(this.props.currentList.taskListIdentifier, member)
      .then(res => {
        closePopup(`#list-members-${this.props.currentList.taskListIdentifier}`);
      })
      .catch(error => {
        this.setState({
          inviteUserResult: `${error.message}: ${
            error.response.data.errorMessage
          }`,
        });
      });
  };

  changeUserRole = (member, role) => {
    this.props.taskListActions
      .changeUserRoleForList(this.props.currentList.taskListIdentifier, member, role)
      .then(res => {
        closePopup(`#list-members-${this.props.currentList.taskListIdentifier}`);
      })
      .catch(error => {
        this.setState({
          inviteUserResult: `${error.message}: ${
            error.response.data.errorMessage
          }`,
        });
      });
  };

  removeListMember() {}

  render() {
    // const { selectedSuggestion, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    // const inputProps = {
    // 	placeholder: 'Add a new member',
    // 	value: selectedSuggestion,
    // 	onChange: this.onChangeSuggestionSearch,
    // 	onKeyDown: this.onKeyDownSuggestionSearch,
    // 	onBlur: this.onBlurSuggestionSearch
    // };

    // console.log("list name: "+ this.props.currentList.listName)
    // console.log("list name: "+ (this.state.currentList?this.state.currentList.listName:""))
    // console.log("rendering list members from parent props: "+ (this.props.listMembers?this.props.listMembers.length:""))
    // console.log("rendering list members from props: "+ (this.props.members?this.props.members.length:""))
    // console.log("rendering list members from state: "+ (this.state.members?this.state.members.length:""))

    return (
      <div
        className="reveal list-members"
        id={`list-members-${
          this.props.currentList != null
            ? this.props.currentList.taskListIdentifier
            : ''
        }`}
        data-reveal=""
      >
        {/* <div id="list-members"> */}
        <h5 className="margin-bottom text-center">
          {this.props.currentList != null
            ? this.props.currentList.listName
            : ''}{' '}
          List Members
        </h5>
        <div className="scroll-wrapper">
          {this.props.members &&
            this.props.members.map(member => {
              return (
                <div
                  key={`listmember_${member.userIdentifier}`}
                  className="row condense expanded border-bottom align-middle"
                >
                  <div className="columns shrink">
                    <MemberInitials member={member} />
                    {/* <span className="member-initials circle medium">{member.initials}</span> */}
                    {/* <img className="member-photo circle medium" src="assets/img/user3.png" alt="name of user"/> */}
                  </div>
                  <div className="columns">
                    <span className="item-content">{member.userName}</span>
                    <span className="item-details">
                      {member.taskListUserRole}
                    </span>
                    {member.status == 'PENDING' && (
                      <span className="item-details highlight">Invited</span>
                    )}
                  </div>
                  {this.props.currentUser &&
                    this.props.currentUser.taskListUserRole != 'MEMBER' &&
                    this.props.currentUser.username != member.email && (
                      <div className="columns shrink more-options-wrapper">
                        <svg
                          className="icon ellipses medium"
                          data-toggle={`more-options-list01-member-id-${
                            member.userIdentifier
                          }`}
                        >
                          <use xlinkHref="#icon-ellipses" />
                        </svg>
                        <div
                          className="small dropdown-pane"
                          id={`more-options-list01-member-id-${member.userIdentifier}`}
                          data-dropdown
                          data-close-on-click="true"
                        >
                          <ul className="no-bullet">
                            <li onClick={e => this.deleteMember(member)}>
                              Remove user from list
                            </li>
                            {member.taskListUserRole != 'MEMBER' ? (
                              <li
                                onClick={e =>
                                  this.changeUserRole(member, 'MEMBER')
                                }
                              >
                                Remove admin status
                              </li>
                            ) : (
                              <li
                                onClick={e =>
                                  this.changeUserRole(member, 'ADMIN')
                                }
                              >
                                Make admin
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    )}
                </div>
              );
            })}
          <div className="row condense expanded border-bottom align-middle">
            <div className="columns">
              <span className="item-content">&nbsp;</span>
            </div>
          </div>
        </div>
        {/* <!--wrapper--> */}
        <form
          className="inline-label top-buffer"
          onSubmit={this.props.handleSubmit(this.onSubmit.bind(this))}
        >
          <div className="row collapse expanded align-middle">
            {/* <Autosuggest
							suggestions={suggestions}
							getSuggestionValue={this.getSuggestionValue}
							renderSuggestion={this.renderSuggestion}
							onSuggestionSelected={this.onSuggestionSelected}
							inputProps={inputProps}
							onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
							onSuggestionsClearRequested={this.onSuggestionsClearRequested}
							renderSuggestionsContainer={this.renderSuggestionsContainer}
							renderInputComponent={this.renderInputComponent}
						/> */}

            {/* Members */}
            {/* <span> */}
            <Field
              id="add-member-to-list"
              name="assignedTo"
              type="text"
              component={BasicField}
              label="Add a new member"
              xlinkHref="#icon-assign-to"
              extraClassName="assign-to"
            />
            {/* <Field id="add-member-to-list" name='assignedTo' type='text' component="input" placeholder='Add a new member' className="assign-to"/> */}
            <Field
              id="add-member-to-list-id"
              name="assignedToIdentifier"
              className="input-group-field"
              component="input"
              type="hidden"
            />
            {/* </span> */}
          </div>
          <div className="row collapse expanded align-middle">
            <div className="columns text-center">
              <button
                data-close=""
                type="submit"
                className="button secondary medium"
              >
                Invite
              </button>
            </div>
          </div>
        </form>
        <div className="row collapse expanded align-middle">
          <div className="columns text-center">
            {this.state.inviteUserResult}
          </div>
        </div>
        <button
          className="close-button"
          data-close=""
          aria-label="Close modal"
          type="button"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  }
}

// this is automatically called as mentioned in last line reduxForm
function validate(values) {
  const errors = {};

  return errors;
}

const mapStateToProps = function(store) {
  // console.log("orgusersnotintasklist count: "+store.taskListState.orgusersnotintasklist);
  // console.log("members count: "+store.taskListState.tasklistmembers.length);
  return {
    currentList: store.taskListState.currentList,
    currentUser: store.userState.user,
    peoplelist: store.peopleState.peoplelist,
    members: store.taskListState.tasklistmembers,
    orgusersnotintasklist: store.taskListState.orgusersnotintasklist,
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    taskListActions: bindActionCreators(TaskListActions, dispatch),
    formActions: bindActionCreators({ reset, destroy }, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  reduxForm({
    form: 'ListMembersAddForm',
    validate,
  })(ListMembers),
);
