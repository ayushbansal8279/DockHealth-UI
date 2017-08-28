import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import BaseComponent from '../BaseComponent'
import * as PeopleActions from '../../actions/people-actions';
import {Link} from 'react-router';
import SearchInput, {createFilter} from 'react-search-input'
import BooleanModal from '../common/BooleanModal'
import MemberInitials from '../common/MemberInitials'

class PeopleContainer extends BaseComponent {
    constructor(props) {
      super(props);

      //bind is needed when you are passing function to the prop, such as onClick={this.onClick}
      //Here onClick is the prop and this.onClick is the passed in function
      //renderList() does not need binding as it is NOT passedas a function to prop
      //this.onClick = this.onClick.bind(this);
      this.state = {
          peopleProcessingResult: ''
      };

			this.onClickRoleChange = this.onClickRoleChange.bind(this)
			this.onClickRemoveUser = this.onClickRemoveUser.bind(this)
			this.onClickCancelInvite = this.onClickCancelInvite.bind(this)
    }

    componentDidMount () {
      super.componentDidMount()
      //enableMoreOptions();
    }

    componentDidUpdate () {
      super.componentDidUpdate()
    }

    onClickRoleChange(markedUserId, currentRole) {
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
        this.props.loading();
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
        this.props.loading();
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
        this.props.loading();
        this.props.findAllUsersByOrganizationId();
        //hashHistory.push('/updateUserRole')
      })
      .catch((error)=>{
        this.setState({peopleProcessingResult: error.message}); //this will cause render to be called
      })
    }

    resendInviteToOrganization = (email) => {
      this.props.resendInviteToOrganization(email)
    }

    renderRole(person){
          if(person.orgUserRole=='OWNER'){
            return (<span className=" success label">{person.orgUserRole}</span>);
          }
          else if(person.orgUserRole=='MEMBER' || person.orgUserRole=='ADMIN' ){
            return (<span className=" warning label">{person.orgUserRole}</span>);
          }
          else{
            return (<span></span>);
          }
    }

    renderRoleButton(person){
      if(person.userId == this.props.userProfile.userId && person.userInviteStatus!='PENDING'){
        return(
          <div className="columns shrink more-options-wrapper more-options-people">
            <svg className="icon ellipses medium" data-toggle={"person-actions-" + person.userId+person.firstName+person.lastName}><use xlinkHref="#icon-ellipses"></use></svg>
            <div className="small dropdown-pane" id={"person-actions-" + person.userId+person.firstName+person.lastName} data-dropdown data-close-on-click="true">
                <ul className="no-bullet">
                  <li data-open={"delete-user-"+person.userId}>Leave organization</li>
                </ul>
              </div>
           </div>
         )
      }else if(this.props.userProfile.orgUserRole == 'ADMIN' || this.props.userProfile.orgUserRole == 'OWNER' && person.userInviteStatus!='PENDING'){
        if(person.orgUserRole==null || person.orgUserRole=='MEMBER'){
          return (
            <div className="columns shrink more-options-wrapper more-options-people">
              <svg className="icon ellipses medium" data-toggle={"person-actions-" + person.userId+person.firstName+person.lastName}><use xlinkHref="#icon-ellipses"></use></svg>
              <div className="small dropdown-pane" id={"person-actions-" + person.userId+person.firstName+person.lastName} data-dropdown data-close-on-click="true">
                <ul className="no-bullet">
                  <li onClick={(e) => this.onClickRoleChange(person.userId, person.orgUserRole)}>Make admin</li>
                  <li data-open={"delete-user-"+person.userId}>Delete this person</li>
                </ul>
              </div>
           </div>
          );
        }else if(person.orgUserRole=='OWNER' && person.userInviteStatus!='PENDING'){
          return (
          <div className="columns shrink more-options-wrapper more-options-people">
            <svg className="icon ellipses medium" data-toggle={"person-actions-" + person.userId+person.firstName+person.lastName}><use xlinkHref="#icon-ellipses"></use></svg>
            <div className="small dropdown-pane" id={"person-actions-" + person.userId+person.firstName+person.lastName} data-dropdown data-close-on-click="true">
              <ul className="no-bullet">
                <li onClick={(e) => this.onClickRemoveUser(person.userId)}>Delete this person</li>
              </ul>
            </div>
           </div>
          );
        }else if(person.orgUserRole=='ADMIN' && person.userInviteStatus!='PENDING'){
          return (
            <div className="columns shrink more-options-wrapper more-options-people">
              <svg className="icon ellipses medium" data-toggle={"person-actions-" + person.userId+person.firstName+person.lastName}><use xlinkHref="#icon-ellipses"></use></svg>
              <div className="small dropdown-pane" id={"person-actions-" + person.userId+person.firstName+person.lastName} data-dropdown data-close-on-click="true">
                  <ul className="no-bullet">
                    <li onClick={(e) => this.onClickRoleChange(person.userId, person.orgUserRole)}>Remove admin rights</li>
                    <li data-open={"delete-user-"+person.userId}>Delete this person</li>
                  </ul>
                </div>
             </div>
            );
          }
        }else if(person.userInviteStatus=='PENDING'){
          return (
            <div className="columns shrink more-options-wrapper more-options-people">
                <svg className="icon ellipses medium" data-toggle={"person-actions-" + person.userId+person.firstName+person.lastName}><use xlinkHref="#icon-ellipses"></use></svg>
                <div className="small dropdown-pane" id={"person-actions-" + person.userId+person.firstName+person.lastName} data-dropdown data-close-on-click="true">
                  <ul className="no-bullet">
                    <li onClick={(e) => this.resendInviteToOrganization(person.email)}>Resend Invite</li>
                    <li onClick={(e) => this.onClickCancelInvite(person.email)}>Cancel Invite</li>
                  </ul>
                </div>
             </div>
          );
        }

      }


    renderStatus(person){
      if(person.userInviteStatus==null || person.userInviteStatus=="" || person.userInviteStatus=='ACCEPTED'){
        if(person.orgUserRole=='OWNER'){
            return (
                <span>Owner</span>
            );
        }else if(person.orgUserRole=='ADMIN'){
            return (
                <span>Admin</span>
            );
        }
      }else if(person.userInviteStatus=='PENDING'){
            return (
                <span>Pending</span>
            );
      }
    }

    renderTitles(person){
      var titles= "";
      if(person.titles !=null){
        person.titles.map((title) =>{
          if(titles !=""){
            titles= titles + ", " + title.name
          }
          else{
            titles= title.name
          }
        })
      }
      titles = titles.replace('/,\s*$/', "");
      return titles;
    }

    renderSpecialties(person){
      var allSpecialties= "";
        if(person.specialties !=null){
            person.specialties.map((specialty) =>{
              var tmpSpecialty= "";
              var tmpSubSpecialty= "";
              tmpSpecialty = specialty.name
              if(specialty.subSpecialties != null){
                  specialty.subSpecialties.map((subSpecialty) =>{
                    if(tmpSubSpecialty !=""){
                      tmpSubSpecialty= tmpSubSpecialty + ", " + subSpecialty.subSpecialtyName
                    }
                    else{
                      tmpSubSpecialty= subSpecialty.subSpecialtyName
                    }
                  })
                  tmpSubSpecialty = tmpSubSpecialty.replace('/,\s*$/', "");
              }

              if(tmpSubSpecialty !=""){
                tmpSpecialty = tmpSpecialty +" ("  + tmpSubSpecialty + ")"
              }

              if(allSpecialties !=""){
                allSpecialties= allSpecialties + ", " + tmpSpecialty
              }
              else{
                allSpecialties= tmpSpecialty
              }
            })
        }
        allSpecialties = allSpecialties.replace('/,\s*$/', "");
        return allSpecialties;
    }

    renderList() {
//use below if date is coming in as timestamp milliseconds
//{new Date(invitation.updatedDateTime).toJSON()}
      const KEYS_TO_FILTERS = ['userName', 'email', 'homePhoneNumber', 'faxNumber', 'workPhoneNumber']
      // Creates filter with LIST, SEARCH TERM, KEYS TO FILTER
      const filteredPeople = this.props.peoplelist.filter(createFilter(this.props.searchTerm, KEYS_TO_FILTERS))
       return filteredPeople.map((person) =>{
         return(
           <div className="item row expanded" key={person.email}>
             <div className="columns shrink pending">
             {/* <img className="member-photo circle" src="assets/img/user3.png" alt="name of user"/> */}
              {/* <span className="member-initials circle">{person.initials}</span> */}
              <MemberInitials member={person}/>
             </div>
             <div className="columns">
               <span className="item-title">{person.firstName + " " + person.lastName}</span>
               <span className="item-details">{this.renderTitles(person)}</span>
               <span className="item-details">{this.renderSpecialties(person)}</span>
               <span className="top-buffer-xsmall item-details">{person.email}</span>
               <span className="item-details">C: {person.accountPhoneNumber} | W: {person.workPhoneNumber}</span>
               <span className="item-details highlight">
                  {
                    this.renderStatus(person)
                  }
               </span>
             </div>

                {this.renderRoleButton(person)}

               <BooleanModal
                 uniqueModalId={"delete-user-"+person.userId}
                 message="Are you sure you want to delete this user?"
                 handleConfirmation={this.onClickRemoveUser}
                 handleConfirmationArgs={person.userId}
                 confirmBtnTxt="Delete"
               />
             </div>

         )
      })
    }

    render(){
      return(
        <div className="item-list-wrapper">
  				{this.renderList()}
        </div>
      );
    }
}

function mapStateToProps(state) {
  return {
    peoplelist: state.peopleState.peoplelist,
    userProfile: state.userState.userProfile
  };
}

function mapDispatchToProps(dispatch) {
  return  bindActionCreators(PeopleActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PeopleContainer);
