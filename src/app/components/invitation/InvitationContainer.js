import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as InvitationActions from '../../actions/invitation-actions';

class InvitationContainer extends React.Component {
    constructor(props) {
      super(props);

      //bind is needed when you are passing function to the prop, such as onClick={this.onClick}
      //Here onClick is the prop and this.onClick is the passed in function
      //renderList() does not need binding as it is NOT passedas a function to prop
      //this.onClick = this.onClick.bind(this);
      this.state = {
          invitationProcessingResult: ''
      };
    }

    componentDidMount () {
      this.props.findInvitationsByUserId('3');
    }

    onClick(taskListId) {

      // this.props.changeUserRoleForList(this.props.taskListId,'1',markedUserId,newRole)
      // .then((res)=>{
      //   this.setState({changeUserRoleResult: 'User Role changed successfully!!'}); //this will cause render to be called
      //   this.props.getActiveMembersByTaskListId(this.props.taskListId,'ACTIVE');
      //   //hashHistory.push('/updateUserRole')
      // })
      // .catch((error)=>{
      //   this.setState({changeUserRoleResult: error.message}); //this will cause render to be called
      // })
      alert(taskListId);

    }

    renderList() {
//use below if date is coming in as timestamp milliseconds
//{new Date(invitation.updatedDateTime).toJSON()}

       return this.props.invitationlist.map((invitation) =>{
          return(
            <tr key={invitation.invitationId}>
              <td><span className="label">{invitation.taskListName}</span></td>
              <td><span className="label">{invitation.invitedByFirstName +"," + invitation.invitedByLastName}</span></td>
              <td>
                {
                  (invitation.listInviteStatus=='PENDING')
                  ?<div><span className=" success label">{invitation.listInviteStatus}</span> <span>on</span> <span className=" secondary label">{invitation.updatedDateTime}</span></div>
                  :<div><span className=" warning label">{invitation.listInviteStatus}</span> <span>on</span> <span className=" secondary label">{invitation.updatedDateTime}</span></div>
                }
              </td>
              <td>
                {
                  (invitation.listInviteStatus=='PENDING')
                  ? <span>
                      <button className="button small secondary" onClick={this.onClick.bind(this,invitation.taskListId)}>Accept</button>
                      <button className="button small secondary float-right" onClick={this.onClick.bind(this,invitation.taskListId)}>Reject</button>
                      </span>
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
          <h3>{this.state.invitationProcessingResult}</h3>
          </div>
        </div>


        <div className="row">
          <div className="small-12 columns">
          <h4>List of Invitations Received</h4>
          </div>
        </div>

          <table>
            <thead>
              <tr>
                <th width="200" ><h3>Task List Name</h3></th>
                <th width="200" ><h3>Invited By</h3></th>
                <th width="200" ><h3>Invitation Status</h3></th>
                <th width="400" ></th>
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
  return {
    invitationlist: state.invitationState.invitationlist
  };
}

function mapDispatchToProps(dispatch) {
  return  bindActionCreators(InvitationActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(InvitationContainer);
