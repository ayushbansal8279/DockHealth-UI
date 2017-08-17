import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as InvitationActions from '../../actions/invitation-actions';
import BaseComponent from '../BaseComponent'

class InvitationContainer extends BaseComponent {
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
      this.props.findInvitationsByUserId();
    }

    onClickAccept(taskListId) {
      this.props.acceptInviteToTaskList(taskListId)
      .then((res)=>{
        this.setState({invitationProcessingResult: 'Invitation accepted successfully!!'}); //this will cause render to be called
        this.props.findInvitationsByUserId();
        //hashHistory.push('/updateUserRole')
      })
      .catch((error)=>{
        this.setState({invitationProcessingResult: error.message}); //this will cause render to be called
      })
    }

    onClickReject(taskListId) {
      this.props.rejectInviteToTaskList(taskListId)
      .then((res)=>{
        this.setState({invitationProcessingResult: 'Invitation rejected successfully!!'}); //this will cause render to be called
        this.props.findInvitationsByUserId();
        //hashHistory.push('/updateUserRole')
      })
      .catch((error)=>{
        this.setState({invitationProcessingResult: error.message}); //this will cause render to be called
      })
    }

    renderList() {
//use below if date is coming in as timestamp milliseconds
//{new Date(invitation.updatedDateTime).toJSON()}

       return this.props.invitationlist.map((invitation) =>{
          return(
             <div className="item row expanded" key={invitation.invitationId}>
              <div className="columns shrink">
                <span className="label">{invitation.taskListName}</span>
              </div>
              <div className="columns">
                <span className="label">{invitation.invitedByFirstName +"," + invitation.invitedByLastName}</span>
              </div>
              <div className="columns">
                {
                  (invitation.listInviteStatus=='PENDING')
                  ?<div><span className=" success label">{invitation.listInviteStatus}</span> <span>on</span> <span className=" secondary label">{invitation.updatedDateTime}</span></div>
                  :<div><span className=" warning label">{invitation.listInviteStatus}</span> <span>on</span> <span className=" secondary label">{invitation.updatedDateTime}</span></div>
                }
              </div>
              <div className="columns">
                {
                  (invitation.listInviteStatus=='PENDING')
                  ? <span>
                      <button className="button small secondary" onClick={this.onClickAccept.bind(this,invitation.taskListId)}>Accept</button>
                      <button className="button small secondary float-right" onClick={this.onClickReject.bind(this,invitation.taskListId)}>Reject</button>
                      </span>
                  :<span></span>
                }
              </div>
            </div>
          );
      })
    }

    render(){
      return(
        <div className="list-wrapper">
          <div className="item-list-wrapper">
          {this.renderList()}
          </div>
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
