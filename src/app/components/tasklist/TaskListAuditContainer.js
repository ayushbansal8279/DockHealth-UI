import React, { Component ,PropTypes} from 'react';
import {reduxForm, Field} from 'redux-form';
import * as TaskListActions from '../../actions/tasklist-actions';
import {connect} from 'react-redux'
import BasicField from '../common/BasicField';
import { Link,hashHistory } from 'react-router';
import {bindActionCreators} from 'redux';

class TaskListAuditContainer extends Component {


  componentDidMount () {
      this.props.getTaskListById(this.props.taskListId);
      this.props.findAuditsByTaskList(this.props.taskListId,0);
    }

    renderList() {
       return this.props.tasklistaudits.map((audit) =>{
          return(
            <tr key={audit.auditId}>
              <td><span className="label">{audit.createdDateTime}</span></td>
              <td><span className="label">{audit.auditEventType}</span></td>
              <td><span className="label">{audit.currentState}</span></td>
              <td><span className="label">{audit.targetIdType}</span></td>
            </tr>
          );
      })
    }


    render (){
      return(
        <div>
          <div className="row">
            <div className="small-12 columns">
            <h4>Activity feed for task list: <strong>{this.props.taskListOne.listName}</strong></h4>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th width="100" ><h3>Created Date</h3></th>
                <th width="100" ><h3>Event Type</h3></th>
                <th width="400" ><h3>Message</h3></th>
                <th width="100" ><h3>Target type</h3></th>
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
  console.log(state);
  return {
    taskListOne: state.taskListState.tasklistone,
    tasklistaudits: state.taskListState.tasklistaudits
  };
}

function mapDispatchToProps(dispatch) {
  return  bindActionCreators(TaskListActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskListAuditContainer);
