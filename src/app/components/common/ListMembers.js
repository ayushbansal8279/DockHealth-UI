import React from 'react'
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import { SubmissionError, Field, input, reduxForm, actions } from 'redux-form'
import BasicField from '../common/BasicField';
import BaseComponentWithAutoComplete from '../BaseComponentWithAutoComplete'
import MemberInitials from '../common/MemberInitials'
import * as TaskListActions from '../../actions/tasklist-actions';
// import Autosuggest from 'react-autosuggest';
import $ from 'jquery'

class ListMembers extends BaseComponentWithAutoComplete {

  constructor(props) {
    	super(props)
    	this.state = {
      		inviteUserResult: '',
          	selectedUserId: null
		};
  }

    //addListMember(e) {
	onSubmit (formProps) {
		//var selectedUserId = formProps.selectedUserId;
		var selectedUserId = $("#add-member-to-list-id").val();
		// var selectedUserId = this.state.selectedUserId;

        if(selectedUserId == null){
        	alert("User must be selected before inviting to this list.");
        }
        else
        {
			var inviteUsers =  [];
			inviteUsers.push(selectedUserId);
        	this.props.taskListActions.inviteMultipleUsersToTaskList(this.props.taskListId, inviteUsers)
        .then((res)=>{
            this.props.formActions.reset('ListMembersAddForm')
          	this.setState({inviteUserResult: 'Invitation sent successfully!!'}); //this will cause render to be called
        })
        .catch((error)=>{
          	this.setState({inviteUserResult: error.message + ": " + error.response.data.errorMessage});
        })
      }
    }

	componentDidMount(){
		console.log('mount list members');
		this.props.formActions.destroy('ListMembersAddForm')
	}

	componentWillUnmount(){
		console.log('unmount list members');
	}

  	componentWillUpdate (nextProps) {
		console.log('ListMembers componentWillUpdate: '+nextProps)
		enableAutoCompleteForListMembers(nextProps.orgusersnotintasklist, process.env.HEYDOC_SERVICES_BASE_URL);
  	}

	deleteMember = (member) => {
		this.props.taskListActions.removeUserFromList(this.props.taskListId, member)
	}

	changeUserRole = (member, role) => {
		this.props.taskListActions.changeUserRoleForList(this.props.taskListId, member, role)
	}

	removeListMember() {

	}

	render(){

		// const { selectedSuggestion, suggestions } = this.state;

		// Autosuggest will pass through all these props to the input.
		// const inputProps = {
		// 	placeholder: 'Add a new member',
		// 	value: selectedSuggestion,
		// 	onChange: this.onChangeSuggestionSearch,
		// 	onKeyDown: this.onKeyDownSuggestionSearch,
		// 	onBlur: this.onBlurSuggestionSearch
		// };

		console.log("rendering list members")

		return(
			<div className="reveal" id="list-members" data-reveal=""> {/*Removed 'listMembersPopUp' having Rachel make the popup show outside of div*/}
				<h5 className="margin-bottom text-center">{this.props.title} List Members</h5>
				<div className="scroll-wrapper">
					{this.props.members && this.props.members.map(member => {
						return(
							<div key={"listmember_"+member.userId} className="row condense expanded border-bottom align-middle">
								<div className="columns shrink">
									<MemberInitials member={member}/>
									{/* <span className="member-initials circle medium">{member.initials}</span> */}
									{/* <img className="member-photo circle medium" src="assets/img/user3.png" alt="name of user"/> */}
								</div>
								<div className="columns">
									<span className="item-content">{member.userName}</span>
									<span className="item-details">{member.taskListUserRole}</span>
									{member.status == "PENDING" &&
									<span className="item-details highlight">Pending</span>
									}
								</div>
								{this.props.currentUser.taskListUserRole != "MEMBER" && this.props.currentUser.username != member.email &&
									<div className="columns shrink more-options-wrapper">
										<svg className="icon ellipses medium" data-toggle={"more-options-list01-member-id-"+member.userId}><use xlinkHref="#icon-ellipses"></use></svg>
										<div className="small dropdown-pane" id={"more-options-list01-member-id-"+member.userId} data-dropdown data-close-on-click="true">
											<ul className="no-bullet">
													<li onClick={(e) => this.deleteMember(member)}>Remove user from list</li>
													{member.taskListUserRole != "MEMBER" ?
														<li onClick={(e) => this.changeUserRole(member, "MEMBER")}>Remove admin status</li> :
														<li onClick={(e) => this.changeUserRole(member, "ADMIN")}>Make admin</li>
													}
											</ul>
										</div>
									</div>
								}
							</div>
						)
					})}
				</div>{/* <!--wrapper--> */}
				 <form className="inline-label top-buffer" onSubmit = {this.props.handleSubmit(this.onSubmit.bind(this))}>
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
						<Field id="add-member-to-list" name='assignedTo' type='text' component={BasicField} label='Add a new member' xlinkHref="#icon-assign-to" extraClassName="assign-to"/>
						{/* <Field id="add-member-to-list" name='assignedTo' type='text' component="input" placeholder='Add a new member' className="assign-to"/> */}
						<Field id="add-member-to-list-id" name="assignedToId" className="input-group-field" component="input" type="hidden"/>
					{/* </span> */}

					</div>
					<div className="row collapse expanded align-middle">
						<div className="columns text-center">
							<button data-close="" type="submit" className="button secondary medium">Invite</button>
						</div>
					</div>
				 </form>
				<div className="row collapse expanded align-middle">
					<div className="columns text-center">
						{this.state.inviteUserResult}
					</div>
				</div>
				<button className="close-button" data-close="" aria-label="Close modal" type="button">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>

		)
	}
}

//this is automatically called as mentioned in last line reduxForm
function validate(values){
  const errors = {};

  return errors;
}

const mapStateToProps = function(store){
	//console.log("orgusersnotintasklist count: "+store.taskListState.orgusersnotintasklist);
	return{
		currentList: store.taskListState.currentList,
		currentUser: store.userState.user,
		taskList: store.taskListState.currentList,
		peoplelist: store.peopleState.peoplelist,
		members: store.taskListState.tasklistmembers,
		orgusersnotintasklist: store.taskListState.orgusersnotintasklist
	}
}

const mapDispatchToProps = function (dispatch) {
  return {
    taskListActions: bindActionCreators(TaskListActions, dispatch),
    formActions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'ListMembersAddForm',
    validate
})(ListMembers));
