import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as TaskListActions from '../../actions/tasklist-actions';
import TaskListOneRenderContainer from './TaskListOneRenderContainer';
import {Link} from 'react-router';


class TaskListMembersViewContainer extends React.Component {

    componentDidMount () {
      this.props.getTaskListById(this.props.taskListId);
      this.props.getMembersByTaskListId(this.props.taskListId,'ALL');
      this.props.getNonOrgUsersByTaskList(this.props.taskListId);
    }

    renderList() {
       return this.props.tasklistmembers.map((member) =>{
          return(
            <tr key={member.userId}>
              <td><span className="label">{member.firstName +"," + member.lastName}</span></td>
              <td>{
                (member.status=='ACTIVE')
                ?<span className=" success label">{member.status}</span>
                :<span className=" alert label">{member.status}</span>
              }
              </td>
            </tr>
          );
      })
    }

    renderNonOrgUserofTaskList() {
       return this.props.nonorgusersintasklist.map((member) =>{
          return(
            <tr key={member.email}>
              <td><span className="alert label">{member.firstName +"," + member.lastName}</span></td>
              <td><span className="alert label">{member.email}</span></td>
            </tr>
          );
      })
    }


    render(){
      return(
        <div>
        <div className="row">
          <div className="small-10 columns">
             <h4>TaskList Name: <strong>{this.props.taskListOne.listName}</strong></h4>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
          <h4>Task List Members Within Organization</h4>
          </div>
        </div>

          <table>
            <thead>
              <tr>
                <th width="200" ><h3>Name</h3></th>
                <th width="200" ><h3>Status</h3></th>
              </tr>
            </thead>
            <tbody>
              {this.renderList()}
            </tbody>
          </table>

          <div className="row">
            <div className="small-12 columns">
            <h4>Task List Members External to Organization</h4>
            </div>
          </div>

            <table>
              <thead>
                <tr>
                  <th width="200" ><h3>Name</h3></th>
                  <th width="200" ><h3>Email</h3></th>
                </tr>
              </thead>
              <tbody>
                {this.renderNonOrgUserofTaskList()}
              </tbody>
            </table>

          <Link to="/taskList">
            <button className="button secondary button-small float-right">Done</button>
          </Link>
        </div>
      );
    }
}

function mapStateToProps(state) {
  //console.log(state);
  return {
    tasklistmembers: state.taskListState.tasklistmembers,
    taskListOne: state.taskListState.tasklistone,
    nonorgusersintasklist:state.taskListState.nonorgusersintasklist
  };
}

function mapDispatchToProps(dispatch) {
  return  bindActionCreators(TaskListActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskListMembersViewContainer);
