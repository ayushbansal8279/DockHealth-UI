import React from 'react'
import BaseComponent from '../BaseComponent'
import MemberInitials from '../common/MemberInitials'
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form'

class ListMembers extends BaseComponent{

	componentDidMount(){

	}
	render(){
		return(
			<div className="reveal" id="list-members" data-reveal>
				<h5 className="margin-bottom text-center">{this.props.title} List Members</h5>
				<div className="scroll-wrapper">
					{this.props.members.map(member => {
						return(
							<div className="row condense expanded border-bottom align-middle">
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
					{/* <div className="row condense expanded border-bottom align-middle">
						<div className="columns shrink">
							<img className="member-photo circle medium" src="assets/img/user2.png" alt="name of user"/>
						</div>
						<div className="columns">
							<span className="item-content">Jenny Davis</span>
							<span className="item-details">Admin</span>
						</div>
					</div>
					<div className="row condense expanded border-bottom align-middle">
						<div className="columns shrink">
							<img className="member-photo circle medium" src="assets/img/user1.png" alt="name of user"/>
						</div>
						<div className="columns">
							<span className="item-content">Christopher Richardson</span>
						</div>
					</div>
					<div className="row condense expanded border-bottom align-middle">
						<div className="columns shrink">
							<span className="member-initials circle medium">SL</span>
						</div>
						<div className="columns">
							<span className="item-content">Samuel Lowe</span>
						</div>
					</div>
					<div className="row condense expanded border-bottom align-middle">
						<div className="columns shrink">
							<span className="member-initials circle medium">JO</span>
						</div>
						<div className="columns">
							<span className="item-content">Jack Oliver</span>
						</div>
					</div>
					<div className="row condense expanded border-bottom align-middle">
						<div className="columns shrink">
							<span className="member-initials circle medium">PG</span>
						</div>
						<div className="columns">
							<span className="item-content">Peter Gonzales</span>
						</div>
					</div> */}
				</div>{/* <!--wrapper--> */}
				<form className="inline-label top-buffer">
					<div className="row collapse expanded align-middle">
						<div className="columns input-group input-wrapper">
							<span className="input-group-label">
								<svg className="icon"><use xlinkHref="#icon-search"></use></svg>
							</span>
							<div className="input-wrapper">
								<input id="add-member-to-list" className="assign-to input-group-field" type="text" placeholder="Add a new member"/>
							</div>
						</div>
					</div>
				</form>
				<div className="row collapse expanded align-middle">
					<div className="columns text-center">
						<a className="button secondary medium">Save</a>
					</div>
				</div>
				<button className="close-button" data-close aria-label="Close modal" type="button">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>

		)
	}
}

const mapStateToProps = function(store){
	return{
		currentList: store.taskListState.currentList,
		currentUser: store.userState.user,
		taskList: store.taskListState.tasklistone

	}
}

export default connect(mapStateToProps)(ListMembers);
