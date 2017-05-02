import React from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as TaskListActions from '../../actions/tasklist-actions'

class TaskListUsers extends React.Component {
	componentDidMount () {
	    //this.props.getMembersByTaskListId(taskListId, memberStatus)
	    this.props.getMembersByTaskListId('1','ALL');
	}


	render () {
	  return (
  	    <div className="content-block">
  			<h6>Invited to this list</h6>
		  	{this.props.members.map(member => {
		    	return (
		    		<div className="avatar">
		    			<div className="users" onClick={(e) => this.getMemberId(member.userId, member)} key={member.userId} title={member.firstName + ' ' + member.lastName}>{member.initials}</div>
		    			{member.taskListUserRole = "ACTIVE" ? <svg className="icon medium green"><use xlinkHref="#icon-ok"></use></svg> : <svg className="icon medium gray"><use xlinkHref="#icon-minus"></use></svg>}
		    		</div>
		    	)
			})}
			<a><svg className="add icon memberphoto large"><use xlinkHref="#icon-add"></use></svg></a>
		    <button className="button secondary block">Send Text <svg className="icon"><use xlinkHref="#icon-forward"></use></svg></button>
	    </div>
	  )
	}
}

 const mapStateToProps = function (store) {
    return {members: store.taskListState.tasklistmembers};
}

const mapDispatchToProps = function (dispatch) {  
  return bindActionCreators(TaskListActions, dispatch)
}

// export default TaskListUsers
export default connect(mapStateToProps, mapDispatchToProps)(TaskListUsers);
