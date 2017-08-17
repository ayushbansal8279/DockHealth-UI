import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as TaskListActions from '../../actions/tasklist-actions';
import TaskListOneRenderContainer from './TaskListOneRenderContainer';
import {Link} from 'react-router';
import {mobileAnalyticsClient} from '../../api/analytics-api'

class TaskListMembersViewContainer extends React.Component {
  constructor(props) {
    super(props);

    //bind is needed when you are passing function to the prop, such as onClick={this.onClick}
    //Here onClick is the prop and this.onClick is the passed in function
    //renderList() does not need binding as it is NOT passedas a function to prop
    //this.onClick = this.onClick.bind(this);
    this.state = {
        removeUserResult: ''
    };
  }
    componentDidMount () {
      this.props.getTaskListById(this.props.taskListId);
      this.props.getMembersByTaskListId(this.props.taskListId,'ALL');
      this.props.getNonOrgUsersByTaskList(this.props.taskListId);
      mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
              'PageName': 'TaskListMembersView'
      });

    }

    onClick(markedUserId) {
      this.props.removeUserFromList(this.props.taskListId,markedUserId)
      .then((res)=>{
        this.setState({removeUserResult: 'User Removed successfully!!'}); //this will cause render to be called
        this.props.getTaskListById(this.props.taskListId);
        this.props.getMembersByTaskListId(this.props.taskListId,'ALL');
        this.props.getNonOrgUsersByTaskList(this.props.taskListId);
        //hashHistory.push('/updateUserRole')
      })
      .catch((error)=>{
        this.setState({changeUserRoleResult: error.message}); //this will cause render to be called
      })

    }


    onClickCancelInvite(email) {
      this.props.cancelInviteToTaskList(this.props.taskListId,email)
      .then((res)=>{
        this.setState({removeUserResult: 'User invite cancelled successfully!!'}); //this will cause render to be called
        this.props.getTaskListById(this.props.taskListId);
        this.props.getMembersByTaskListId(this.props.taskListId,'ALL');
        this.props.getNonOrgUsersByTaskList(this.props.taskListId);
        //hashHistory.push('/updateUserRole')
      })
      .catch((error)=>{
        this.setState({changeUserRoleResult: error.message}); //this will cause render to be called
      })

    }

    renderRemoveUserCancelInviteButton(member){
      if(member.status=='ACTIVE'){
        if(member.taskListUserRole=='MEMBER'){
          return (<button className="button small secondary float-right" onClick={this.onClick.bind(this,member.userId)}>Remove User</button>);
        }
        else{
          return (<span></span>);
        }
      }
      else if (member.status=='PENDING'){
          return (<button className="button small secondary float-right" onClick={this.onClickCancelInvite.bind(this,member.email)}>Cancel Invite</button>);
      }
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
              <td>
                {
                  (member.taskListUserRole=='OWNER')
                  ?<span className=" success label">{member.taskListUserRole}</span>
                  :<span className=" warning label">{member.taskListUserRole}</span>
                }
              </td>
              <td>
                {
                  this.renderRemoveUserCancelInviteButton(member)
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
              <td><span className=" alert label">{member.listInviteStatus}</span></td>
              <td><span className="alert label">{member.email}</span></td>
              <td>
              {
              (member.listInviteStatus=='PENDING')
                ?<button className="button small secondary float-right" onClick={this.onClickCancelInvite.bind(this,member.email)}>Cancel Invite</button>
                :<span></span>
              }
              </td>
            </tr>
          );
      })
    }


    render(){
      return(
        <div>
        <div className="row">
          <div className="small-12 columns">
          <h3>{this.state.removeUserResult}</h3>
          </div>
        </div>

        <div className="row">
          <div className="small-10 columns">
             <h4>TaskList Name: <strong>{this.props.currentList.listName}</strong></h4>
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
                <th width="200" ><h3>Role</h3></th>
                <th width="400" ><h3></h3></th>
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
                  <th width="200" ><h3>Status</h3></th>
                  <th width="200" ><h3>Email</h3></th>
                  <th width="200" ><h3></h3></th>
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
    currentList: state.taskListState.currentList,
    nonorgusersintasklist:state.taskListState.nonorgusersintasklist
  };
}

function mapDispatchToProps(dispatch) {
  return  bindActionCreators(TaskListActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskListMembersViewContainer);
