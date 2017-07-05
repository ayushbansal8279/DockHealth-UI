import React from 'react'
import BaseComponent from '../BaseComponent'
import MemberInitials from '../common/MemberInitials'
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form'
import * as TaskListActions from '../../actions/tasklist-actions';
import $ from 'jquery'


class ListMembers extends BaseComponent{

  constructor(props) {
    	super(props)
    	this.state = {
      		inviteUserResult: ''
    	};
  	}

	onSubmit (formProps) {
		var selectedUserId = formProps.selectedUserId; //jquery update doesn't always update the Virtual DOM - try avoiding this mixing
		if(!selectedUserId){
			var selectedUserId = $("#add-member-to-list-id").val();
		}
        if(selectedUserId == null){
        	alert("User must be selected before inviting to this list.");
        }
        else
        {
			var inviteUsers =  [];
			inviteUsers.push(selectedUserId);
        	this.props.inviteMultipleUsersToTaskList(this.props.taskListId, inviteUsers)
        .then((res)=>{
          	this.setState({inviteUserResult: 'Invitation sent successfully!!'}); //this will cause render to be called
        })
        .catch((error)=>{
          	this.setState({inviteUserResult: error.message}); //this will cause render to be called
        })
      }
    }

	componentDidMount(){

	}

  	componentWillUpdate (nextProps) {
		if(this.props.peoplelist && this.props.peoplelist.length == 0 && nextProps.peoplelist.length > 0){
			enableAutoCompleteForListMembers(nextProps.peoplelist);
		}
  	}

	removeListMember() {

	}

	render(){

		return(
			<div className="reveal listMembersPopUp" id="list-members" data-reveal>
				<h5 className="margin-bottom text-center">{this.props.title} List Members</h5>
				<div className="scroll-wrapper">
					{this.props.members.map(member => {
						return(
							<div key={"member"+member.userId} className="row condense expanded border-bottom align-middle">
								<div className="columns shrink">

									<MemberInitials member={member}/>
									{/* <span className="member-initials circle medium">{member.initials}</span> */}
									{/* <img className="member-photo circle medium" src="assets/img/user3.png" alt="name of user"/> */}
								</div>
								<div className="columns">
									<span className="item-content">{member.userName}</span>
									<span className="item-details">{member.taskListUserRole}</span>
								</div>
								{this.props.currentUser.taskListUserRole != "MEMBER" && this.props.currentUser.username != member.email &&
									<div className="columns shrink more-options-wrapper">
										<svg className="icon ellipses medium" data-toggle={"more-options-list01-member-id-"+member.userId}><use xlinkHref="#icon-ellipses"></use></svg>
										<div className="small dropdown-pane" id={"more-options-list01-member-id-"+member.userId} data-dropdown data-close-on-click="true">
											<ul className="no-bullet">
													<li>Delete this person</li>
													{member.taskListUserRole != "MEMBER" ?
														<li>Remove admin status</li> :
														<li>Make admin</li>
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
						<div className="columns input-group input-wrapper">
							<span className="input-group-label">
								<svg className="icon"><use xlinkHref="#icon-search"></use></svg>
							</span>
							<div className="input-wrapper">
								<Field id="add-member-to-list" name="selectedUser" component="input" placeholder="Add a new member" type="text"/>
								<Field id="add-member-to-list-id" name="selectedUserId" className="input-group-field" component="input" type="hidden"/>
							</div>
						</div>
					</div>
					<div className="row collapse expanded align-middle">
						<div className="columns text-center">
							<button type="submit" className="button secondary medium">Invite</button>
						</div>
					</div>
				</form>
				<div className="row collapse expanded align-middle">
					<div className="columns text-center">
						<h3>{this.state.inviteUserResult}</h3>
					</div>
				</div>
				<button className="close-button" data-close aria-label="Close modal" type="button">
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
	return{
		currentList: store.taskListState.currentList,
		currentUser: store.userState.user,
		taskList: store.taskListState.tasklistone,
		peoplelist: store.peopleState.peoplelist

	}
}

export default connect(mapStateToProps, TaskListActions)(reduxForm({
    form: 'ListMembersAddForm',
    validate
})(ListMembers));
