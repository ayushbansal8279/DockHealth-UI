import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as TaskListActions from '../../actions/tasklist-actions'
import {mobileAnalyticsClient} from '../../api/analytics-api'

class NotificationsToggle extends React.Component {

  componentDidMount(){
    this.props.getTaskListById(this.props.taskListId);
    mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
            'PageName': 'TaskListToggleNotification'
    });
  }

  componentWillUpdate(nextProps){
    if(nextProps.taskListId != this.props.taskListId){
      this.props.getTaskListById(nextProps.taskListId);
    }
  }

  constructor(props){
    super(props)
    this.toggleNotifications = this.toggleNotifications.bind(this)
  }

  toggleNotifications(boolean){
    this.props.toggleListNotifications(this.props.taskListId, boolean)
  }

  render(){
    return (
      <div>
        <button onClick={(e) => this.toggleNotifications(!this.props.taskList.notifications)} className="button success float-left button-small">{this.props.taskList.notifications ? "Turn off Notifications" : "Turn on Notifications"}</button>
      </div>
    )
  }

}

const mapStateToProps = function(store){
  return {taskList: store.taskListState.currentList}
}

const mapDispatchToProps = function (dispatch) {
  return bindActionCreators(TaskListActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsToggle)
