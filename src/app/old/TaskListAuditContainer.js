import React, { Component} from 'react';
import * as TaskListActions from '../../actions/tasklist-actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'
import {mobileAnalyticsClient} from '../../api/analytics-api'

class TaskListAuditContainer extends Component {

  componentDidMount () {
      this.props.getTaskListById(this.props.taskListId);
      this.props.findAuditsByTaskList(this.props.taskListId,0);
      mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
              'PageName': 'TaskListAuditView'
      });
    }

    renderList() {
       return this.props.tasklistaudits.map((audit) =>{
          return(
            <tr key={audit.auditId}>
              <td>{audit.createdDateTime}</td>
              <td>{audit.auditEventType}</td>
              <td>{audit.currentState}</td>
              <td>{audit.targetIdType}</td>
            </tr>
          );
      })
    }


    render (){
      return(
        <div>
          <div className="row">
            <div className="small-12 columns">
            <h4>Activity feed for task list: <strong>{this.props.currentList.listName}</strong></h4>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Created Date</th>
                <th>Event Type</th>
                <th>Message</th>
                <th>Target type</th>
              </tr>
            </thead>

            <tbody>
              {this.renderList()}
            </tbody>
          </table>
        </div>
    );
  }
}

function mapStateToProps(state) {
  //console.log(state);
  return {
    currentList: state.taskListState.currentList,
    tasklistaudits: state.taskListState.tasklistaudits
  };
}

function mapDispatchToProps(dispatch) {
  return  bindActionCreators(TaskListActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskListAuditContainer);
