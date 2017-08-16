import React from 'react'
import {Link} from 'react-router'
import BaseComponent from '../BaseComponent'

class TaskListMembersDropdownList extends BaseComponent {
	constructor(props) {
		super(props)
		this.getMemberId = this.getMemberId.bind(this);
	}

	getMemberId(memberId){
		this.props.getSelectedMemberId(memberId);
	}

	render(){
		return(
			<div className="user-list">
				<ul className="no-bullet expand">
					{this.props.members && this.props.members
						.map(member => {
							if(member.status == "ACTIVE"){
								return(
									<li onClick={(e) => this.getMemberId(member.userId)} key={member.userId}>{member.firstName}&nbsp;{member.lastName}</li>
								)
							}
						})
					}
				</ul>
			</div>

		);
	}
}

export default TaskListMembersDropdownList
