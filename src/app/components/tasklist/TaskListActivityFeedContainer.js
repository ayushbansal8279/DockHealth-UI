import React, { Component} from 'react';
import * as TaskListActions from '../../actions/tasklist-actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

class TaskListActivityFeedContainer extends Component {

  componentDidMount () {
      //queryStartPosition Zero is hardcoded because activity feed must alwqays return top 100 rows
      //for any more rows use findAuditsByTaskList must be used with proper queryStartPosition
      this.props.findAuditsForAllTaskListsByUserId(0);
    }

    renderList(auditlist) {
       return auditlist.map((audit) =>{
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

    renderTaskListName(){
      return this.props.auditsForAllUserList.map((auditsandtasklist) =>{
        return(
          <div key={auditsandtasklist.taskListId}>
            <div className="row">
              <div className="small-12 columns">
                <h4>Activity feed for task list: <strong>{auditsandtasklist.listName}</strong></h4>
              </div>
            </div>

            <div>
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
                  {this.renderList(auditsandtasklist.auditList)}
                </tbody>
              </table>
            </div>
          </div>
        );
      })
    }

    render (){
      return (
        <div>
          {this.renderTaskListName()}
        </div>
      )
    }
}

function mapStateToProps(state) {
  //console.log(state);
  return {
    auditsForAllUserList: state.taskListState.auditsForAllUserList
  };
}

function mapDispatchToProps(dispatch) {
  return  bindActionCreators(TaskListActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskListActivityFeedContainer);
