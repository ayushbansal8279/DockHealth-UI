import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as TaskListActions from '../../actions/tasklist-actions';
import TaskListOneRenderContainer from './TaskListOneRenderContainer';
import {Link} from 'react-router';


class TaskListUpdateUserRoleContainer extends React.Component {

  constructor(props) {
    super(props);

    //bind is needed when you are passing function to the prop, such as onClick={this.onClick}
    //Here onClick is the prop and this.onClick is the passed in function
    //renderList() does not need binding as it is NOT passedas a function to prop
    //this.onClick = this.onClick.bind(this);
    this.state = {
        changeUserRoleResult: ''
    };
  }

    componentDidMount () {
      this.props.getTaskListById(this.props.taskListId);
      this.props.getActiveMembersByTaskListId(this.props.taskListId,'ACTIVE');
    }

    onClick(markedUserId,currentRole) {
      var newRole;
      if(currentRole === 'ADMIN'){
        newRole = 'MEMBER'
      }
      else {
        newRole = 'ADMIN'
      }
      this.props.changeUserRoleForList(this.props.taskListId,markedUserId,newRole)
      .then((res)=>{
        this.setState({changeUserRoleResult: 'User Role changed successfully!!'}); //this will cause render to be called
        this.props.getActiveMembersByTaskListId(this.props.taskListId,'ACTIVE');
        //hashHistory.push('/updateUserRole')
      })
      .catch((error)=>{
        this.setState({changeUserRoleResult: error.message}); //this will cause render to be called
      })

    }

    renderList() {
       return this.props.tasklistactivemembers.map((member) =>{
          return(
            <tr key={member.userId}>
              <td><span className="label">{member.firstName +"," + member.lastName}</span></td>
              <td>
                {
                  (member.taskListUserRole=='OWNER')
                  ?<span className=" success label">{member.taskListUserRole}</span>
                  :<span className=" warning label">{member.taskListUserRole}</span>
                }
              </td>
              <td>
                {
                  (member.taskListUserRole=='OWNER')
                  ?<span></span>
                  :<button className="button small secondary float-right" onClick={this.onClick.bind(this,member.userId,member.taskListUserRole)}>
                    {
                      (member.taskListUserRole=='ADMIN')
                      ?"Remove Admin Rights"
                      :"Give Admin Rights"
                    }
                  </button>
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
          <div className="small-10 columns">
             <h4>TaskList Name: <strong>{this.props.taskListOne.listName}</strong></h4>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
          <h3>{this.state.changeUserRoleResult}</h3>
          </div>
        </div>


        <div className="row">
          <div className="small-12 columns">
          <h4>Active Task List Members</h4>
          </div>
        </div>

          <table>
            <thead>
              <tr>
                <th width="200" ><h3>Name</h3></th>
                <th width="200" ><h3>User Role</h3></th>
                <th width="200" ><h3></h3></th>
              </tr>
            </thead>

            <tbody>
              {this.renderList()}
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
    tasklistactivemembers: state.taskListState.tasklistactivemembers,
    taskListOne: state.taskListState.tasklistone,
  };
}

function mapDispatchToProps(dispatch) {
  return  bindActionCreators(TaskListActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskListUpdateUserRoleContainer);
