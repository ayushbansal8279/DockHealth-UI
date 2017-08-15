import React from 'react'
import {Link} from 'react-router'
import BaseComponent from '../BaseComponent'

class TaskListMembers extends BaseComponent {
	constructor(props) {
		super(props)
		this.getMemberId = this.getMemberId.bind(this);
	}

	getMemberId(memberId, member){
		this.props.getSelectedMemberId(memberId, member, this.props.taskId);
	}

	render(){
		return(
			<div className="medium-12 columns">
				<ul className="no-bullet">
					{this.props.members && this.props.members
						.map(member => {
							if(member.status == "ACTIVE"){
								return(
									<div className="users" onClick={(e) => this.getMemberId(member.userId, member)} key={member.userId} title={member.firstName + ' ' + member.lastName}>{member.initials}</div>
								);
							}
						})
					}
				</ul>
			</div>
		);
	}
}

export default TaskListMembers
