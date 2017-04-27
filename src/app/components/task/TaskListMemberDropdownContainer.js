import React from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as TaskListActions from '../../actions/tasklist-actions';
// import TaskListOneRenderContainer from './TaskListOneRenderContainer';
import {Link} from 'react-router';


class TaskListMembersDropdownContainer extends React.Component {

    componentDidMount () {
      this.props.getMembersByTaskListId(this.props.taskListId,'ALL');
    }

    render() {
      <div className="user-list">
      	<ul className="no-bullet expand">
      		{this.props.tasklistmembers
      			.map(member => {
      				return(
      					<li key={member.userId}>{member.firstName}&nbsp;{member.lastName}</li>
      				);
      			})
      		}
      	</ul>
      </div>
    }

}




function mapStateToProps(state) {
  //console.log(state);
  return {
    tasklistmembers: state.taskListState.tasklistmembers,
  };
}

function mapDispatchToProps(dispatch) {
  return  bindActionCreators(TaskListActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskListMembersDropdownContainer);
