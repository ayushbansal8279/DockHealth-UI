import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as PeopleActions from '../../actions/people-actions';
import {Link} from 'react-router';

class PeopleContainer extends React.Component {
    constructor(props) {
      super(props);

      //bind is needed when you are passing function to the prop, such as onClick={this.onClick}
      //Here onClick is the prop and this.onClick is the passed in function
      //renderList() does not need binding as it is NOT passedas a function to prop
      //this.onClick = this.onClick.bind(this);
      this.state = {
          peopleProcessingResult: ''
      };
    }

    componentDidMount () {
      this.props.findAllUsersByOrganizationId();
      //enableMoreOptions();
    }

    onClick(markedUserId,currentRole) {
      var newRole;
      if(currentRole === 'ADMIN'){
        newRole = 'MEMBER'
      }
      else {
        newRole = 'ADMIN'
      }
      this.props.changeUserRoleForOrg(markedUserId,newRole)
      .then((res)=>{
        this.setState({peopleProcessingResult: 'User Role changed successfully!!'}); //this will cause render to be called
        this.props.findAllUsersByOrganizationId();
        //hashHistory.push('/updateUserRole')
      })
      .catch((error)=>{
        this.setState({peopleProcessingResult: error.message}); //this will cause render to be called
      })
    }

    onClickRemoveUser(markedUserId) {
      this.props.removeUserFromOrganization(markedUserId)
      .then((res)=>{
        this.setState({peopleProcessingResult: 'User removed successfully!!'}); //this will cause render to be called
        this.props.findAllUsersByOrganizationId();
        //hashHistory.push('/updateUserRole')
      })
      .catch((error)=>{
        this.setState({peopleProcessingResult: error.message}); //this will cause render to be called
      })
    }

    onClickCancelInvite(email) {
      this.props.cancelInviteToOrganization(email)
      .then((res)=>{
        this.setState({peopleProcessingResult: 'Invitation cancelled successfully!!'}); //this will cause render to be called
        this.props.findAllUsersByOrganizationId();
        //hashHistory.push('/updateUserRole')
      })
      .catch((error)=>{
        this.setState({peopleProcessingResult: error.message}); //this will cause render to be called
      })

    }

    renderRole(people){
          if(people.orgUserRole=='OWNER'){
            return (<span className=" success label">{people.orgUserRole}</span>);
          }
          else if(people.orgUserRole=='MEMBER' || people.orgUserRole=='ADMIN' ){
            return (<span className=" warning label">{people.orgUserRole}</span>);
          }
          else{
            return (<span></span>);
          }
    }

    renderRoleButton(people){
      if(people.userInviteStatus=='ACCEPTED'){
          if(people.orgUserRole=='OWNER'){
            return (<button className="button small secondary float-right" onClick={this.onClickRemoveUser.bind(this,people.userId)}>Remove User</button>);
          }
          else if(people.orgUserRole=='MEMBER'){
            return (
              <div>
                <button className="button small secondary float-right" onClick={this.onClick.bind(this,people.userId,people.orgUserRole)}>Give Admin Rights</button>
                <button className="button small secondary float-right" onClick={this.onClickRemoveUser.bind(this,people.userId)}>Remove User</button>
              </div>
            );
          }
          else if(people.orgUserRole=='ADMIN'){
            return (
              <div>
                <button className="button small secondary float-right" onClick={this.onClick.bind(this,people.userId,people.orgUserRole)}>Remove Admin Rights</button>
                <button className="button small secondary float-right" onClick={this.onClickRemoveUser.bind(this,people.userId)}>Remove User</button>
              </div>
              );
          }
        }
        else if(people.userInviteStatus=='PENDING'){
          return (<button className="button small secondary float-right" onClick={this.onClickCancelInvite.bind(this,people.email)}>Cancel Invite</button>);
        }
    }

    renderList() {
//use below if date is coming in as timestamp milliseconds
//{new Date(invitation.updatedDateTime).toJSON()}

       return this.props.peoplelist.map((people) =>{
          return(
             <div className="item row expanded" key={people.email}>
              <div className="columns shrink">
                <img className="member-photo circle" src="assets/img/user2.png" alt="name of user"/>
                {/*<span className="member-initials circle">KV</span>*/}
              </div>
              <div className="columns">
                <span className="item-title">{people.firstName}&nbsp;{people.lastName}</span>
                <span className="item-details">MD, Endocrinology</span>
                <span className="top-buffer-xsmall item-details">{people.email}</span>
                <span className="item-details">P: 434-432-43243 | C: 434-432-43243</span>
                <span className="item-details highlight">
                {
                  (people.userInviteStatus=='ACCEPTED')
                  ?<div><span className=" success label">{people.userInviteStatus}</span></div>
                  :<div><span className=" alert label">{people.userInviteStatus}</span></div>
                }
                </span>
              </div>
              <div className="columns">
                {
                  this.renderRole(people)
                }
              </div>
              <div className="columns">
                {
                  this.renderRoleButton(people)
                }
              </div>
              <div className="columns shrink more-options-wrapper more-options-people">
                <span className="more-task-options icon-group-tooltip">
                  <span data-tooltip aria-haspopup="true" data-disable-hover="false" tabIndex="2" title="delete this person"><svg className="icon"><use xlinkHref="#icon-delete"></use></svg></span>
                  <span data-tooltip aria-haspopup="true" data-disable-hover="false" tabIndex="2" title="give admin rights"><svg className="icon"><use xlinkHref="#icon-admin"></use></svg></span>
                </span>
                <svg className="icon medium ellipses"><use xlinkHref="#icon-ellipses"></use></svg>
              </div>
            </div>
          );
      })
    }

    render(){
      return(
        <div>
        {/*<div className="row">
          <div className="small-12 columns">
          <h3>{this.state.peopleProcessingResult}</h3>
          </div>
        </div>

        <Link to="/peopleinvite">
          <button className="button secondary button-small float-right">Invite user to organization</button>
        </Link>

        <div className="row">
          <div className="small-12 columns">
          <h4>List of members within organization</h4>
          </div>
        </div>

          <table>
            <thead>
              <tr>
                <th width="200" ><h3>Name</h3></th>
                <th width="200" ><h3>Email</h3></th>
                <th width="200" ><h3>Status</h3></th>
                <th width="200" ><h3>Role</h3></th>
                <th width="400" ></th>
              </tr>
            </thead>

            <tbody>*/}
              {this.renderList()}
            {/*</tbody>
          </table>*/}
        </div>
      );
    }
}

function mapStateToProps(state) {
  return {
    peoplelist: state.peopleState.peoplelist
  };
}

function mapDispatchToProps(dispatch) {
  return  bindActionCreators(PeopleActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PeopleContainer);
