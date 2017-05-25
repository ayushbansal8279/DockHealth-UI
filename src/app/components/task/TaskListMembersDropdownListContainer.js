import React from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import TaskListMembersDropdownList from './TaskListMembersDropdownList'
import * as TaskListActions from '../../actions/tasklist-actions'

class TaskListMembersDropdownListContainer extends React.Component {
    componentDidMount () {
        //this.props.getMembersByTaskListId(taskListId, memberStatus)
        this.props.getMembersByTaskListId('1','ALL');
    }

    render() {
        return (<TaskListMembersDropdownList members={this.props.members}
        	getSelectedMemberId={this.props.getSelectedMemberId}/>)
    }

}

	//property validation
	TaskListMembersDropdownListContainer.propTypes = {
	    members: PropTypes.array.isRequired
	    //actions: PropTypes.object.isRequired
	}

	 const mapStateToProps = function (store) {
	    return {members: store.taskListState.tasklistmembers};
	}

	const mapDispatchToProps = function (dispatch) {
	  return bindActionCreators(TaskListActions, dispatch)
	}


export default connect(mapStateToProps, mapDispatchToProps)(TaskListMembersDropdownListContainer);
