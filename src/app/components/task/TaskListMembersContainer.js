import React from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import TaskListMembers from './TaskListMembers'
import * as TaskListActions from '../../actions/tasklist-actions'
import {mobileAnalyticsClient} from '../../api/analytics-api'

class TaskListMembersContainer extends React.Component {
    componentDidMount () {
        //this.props.getMembersByTaskListId(taskListId, memberStatus)
        // this.props.getMembersByTaskListId('1','ALL');
        mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
                'PageName': 'TaskListMembers'
        });
    }

    render() {
        return (<TaskListMembers members={this.props.members} getSelectedMemberId={this.props.getSelectedMemberId} taskId={this.props.taskId}/>)
    }

}

	//property validation
	TaskListMembersContainer.propTypes = {
	    members: PropTypes.array.isRequired
	    //actions: PropTypes.object.isRequired
	}

	 const mapStateToProps = function (store) {
	    return {members: store.taskListState.tasklistmembers};
	}

	const mapDispatchToProps = function (dispatch) {
	  return bindActionCreators(TaskListActions, dispatch)
	}


export default connect(mapStateToProps, mapDispatchToProps)(TaskListMembersContainer);
