import React, { Component ,PropTypes} from 'react';
import {reduxForm, Field} from 'redux-form';
import {invitePersonToOrganization} from '../../actions/people-actions';
import BasicField from '../common/BasicField';
import { Link,hashHistory } from 'react-router';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as userApi from '../../api/user-api'


class UserProfileContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {updateProfileResult:''};
  }

    componentDidMount () {
      userApi.getUserById()
      userApi.getUserProfilePic()
      userApi.getUserNotoficationPrefs()
    }

    handleImageChange(e) {
      e.preventDefault();
      let reader = new FileReader();
      let file = e.target.files[0];
      reader.onloadend = () => {
        //alert(reader.result);
        // this.setState({
        //   file: file,
        //   imagePreviewUrl: reader.result
        // });
        userApi.saveUserProfilePic(reader.result)
        .then((response) =>{
          userApi.getUserProfilePic(); //call this so state change will be triggered and all locations will be updated
        })
        .catch((error)=>{
          this.setState({updateProfileResult: error.message}); //this will cause render to be called
        })
      }
      //reader.readAsDataURL(file)
      reader.readAsArrayBuffer(file)
    }

    onSubmit (formProps) {

      userApi.updateUser(formProps)
      .then((res)=>{
          userApi.updateUserNotoficationPrefs(formProps.emailPref, formProps.pushPref)
          .then((res) =>{
            this.setState({updateProfileResult: 'User Profile updated successfully!!!'});
            userApi.getUserById()
            userApi.getUserProfilePic()
            userApi.getUserNotoficationPrefs()
            //hashHistory.push('/people')
          })
      })
      .catch((error)=>{
        this.setState({updateProfileResult: error.message}); //this will cause render to be called
      })
    }

    onClickRemovePicture() {
      userApi.deleteUserProfilePic()
      .then((res)=>{
        this.setState({updateProfileResult: 'User profile picture removed successfully!!'}); //this will cause render to be called
        userApi.getUserProfilePic()
        //hashHistory.push('/updateUserRole')
      })
      .catch((error)=>{
        this.setState({updateProfileResult: error.message}); //this will cause render to be called
      })
    }

 render(){
      const handleSubmit = this.props.handleSubmit; //injected by reduxform
      //var userProfile = JSON.parse(sessionStorage.userProfile) //this is needed as userProfile is stringyfied and stored
      //var userProfile = this.props.userProfile
      var initialValues = this.props.initialValues
      var {userProfilePic} = this.props
      if(userProfilePic == undefined){
        userProfilePic = "assets/img/dock-logo-white.png";
      }

      return(
        <div>
          <div className="off-canvas-content" data-off-canvas-content>

            <div className="top-bar-left">
                <h3>My Profile</h3>
            </div>

            <div className="row">
              <div className="small-12 columns">
              <h3>{this.state.updateProfileResult}</h3>
              </div>
            </div>

              <div className="wrapper large-8 large-offset-2 top-buffer">
                <div className="row">
                  <div className="columns large-12 text-center">
                    <img className="member-photo circle xlarge" src={userProfilePic} alt="name of user"></img>
                    <h4 className="top-buffer">{initialValues.firstName} {initialValues.lastName}</h4>
                  </div>
                  <div className="columns large-12 text-center">
                    <p onClick={this.onClickRemovePicture.bind(this)}>Remove photo</p>
                    <p><input type="file" hidden name="file" id="file" className="inputfile" onChange={this.handleImageChange}/>
                    <label htmlFor="file">Upload photo</label></p>
                    <p>Take photo (Not implemented)</p>
                  </div>
               </div>

            </div>


            <div className="large-12 columns" >
              <div className="column">
                <form onSubmit = {handleSubmit(this.onSubmit.bind(this))}>
                  <div className="row">
                    <div className="medium-12 columns">
                          <Field name='firstName'  type='text' component={BasicField} label='First Name'/>
                    </div>
                    <div className="medium-12 columns">
                          <Field name='lastName' type='text' component={BasicField} label='Last Name'/>
                    </div>
                    <div className="medium-12 columns">
                          <Field name='specialty' type='text' component={BasicField} label='Specialty'/>
                    </div>
                    <div className="medium-12 columns">
                          <Field name='subspecialties' type='text' component={BasicField} label='Subspecialties'/>
                    </div>
                    <div className="medium-12 columns">
                          <Field name='accountPhoneNumber' type='text' component={BasicField} label='Account Phone Number'/>
                    </div>
                    <div className="medium-12 columns">
                          <Field name='workPhoneNumber' type='text' component={BasicField} label='Work Phone Number'/>
                    </div>
                    <div className="medium-12 columns">
                          <Field name='faxNumber' type='text' component={BasicField} label='Fax Number'/>
                    </div>
                    <div className="medium-12 columns">
                          <Field name='mobilePhoneNumber' type='text' component={BasicField} label='Mobile Phone Number'/>
                    </div>
                  </div>

                  <div className="medium-12 columns">
                    <Field name="emailPref" id="emailPref" component={BasicField} type="checkbox" label='Email'/>
                  </div>

                  <div className="medium-12 columns">
                    <Field name="pushPref" id="pushPref" component={BasicField} type="checkbox" label='Push'/>
                  </div>

                  <div className="row">
                      <div className="medium-12 columns button-group">
                          <button className="button primary float-right button-small">Save</button>
                        <Link to="/"><button className="button secondary button-small float-right">Cancel</button></Link>
                      </div>
                  </div>
                </form>
              </div>
            </div>

          </div>
      </div>
      );
    }
}

/*
var userNotificationPrefs = this.props.userNotificationPrefs
if(userNotificationPrefs){
  this.state.email=userNotificationPrefs.email
  this.state.push=userNotificationPrefs.push
}
onChange(event) {
  const target = event.target;
  const value = target.type === 'checkbox' ? target.checked : target.value;
  const name = target.name;
  alert(value)
  this.setState({
    [name]: value
  }, () =>{alert(this.state.email)});

  //alert(this.state.push)
}
<div className="medium-12 columns">
  <input name="email" type="checkbox" onChange={this.onChange.bind(this)}/> Email
</div>
<div className="medium-12 columns">
  <input name="push" type="checkbox"  onChange={this.onChange.bind(this)}/> Push
</div>

========
// let {imagePreviewUrl} = this.state;
//  let imagePreview = null;
//  if (imagePreviewUrl) {
//    imagePreview = (<img src={imagePreviewUrl} />);
//  }

//<p><input type="file" hidden name="file" id="file" className="inputfile" onChange={this.handleFileUpload}/>
//<label htmlFor="file">Upload photo</label></p>

//<input type="file" onChange={this.handleImageChange} />

*/

function mapStateToProps(state) {
  return {
    userProfilePic:state.userState.userProfilePic,
    //userProfile: state.userState.userProfile,
    userNotificationPrefs: state.userState.userNotificationPrefs,
    initialValues:{
      firstName: state.userState.userProfile.firstName,
      lastName: state.userState.userProfile.lastName,
      specialty: state.userState.userProfile.specialty,
      subspecialties: state.userState.userProfile.subspecialties,
      accountPhoneNumber: state.userState.userProfile.accountPhoneNumber,
      workPhoneNumber: state.userState.userProfile.workPhoneNumber,
      faxNumber: state.userState.userProfile.faxNumber,
      mobilePhoneNumber: state.userState.userProfile.mobilePhoneNumber,
      emailPref: state.userState.userNotificationPrefs.email,
      pushPref: state.userState.userNotificationPrefs.push
      }  //this automatically causes REDUX to load the form from state
  };
}

// function mapDispatchToProps(dispatch) {
//   return  bindActionCreators(PeopleActions, dispatch)
// }

function validate(values){
  const errors = {};

  var mobilePhoneNumber = values.mobilePhoneNumber
  if(mobilePhoneNumber){
    if(!validatePhoneNumbers(mobilePhoneNumber)){
      errors.mobilePhoneNumber = 'Please enter 10 digit phone number';
    }
    // var match = mobilePhoneNumber.match(/\D/);
    // if(match != null){
    //   errors.mobilePhoneNumber = 'Please enter 10 digit phone number';
    // }
    // else
    // {
    //   if(mobilePhoneNumber.length !=10){
    //     errors.mobilePhoneNumber = 'Please enter 10 digit phone number';
    //   }
    // }
  }

  var faxNumber = values.faxNumber
  if(faxNumber){
    if(!validatePhoneNumbers(faxNumber)){
      errors.faxNumber = 'Please enter 10 digit fax number';
    }
  }

  var workPhoneNumber = values.workPhoneNumber
  if(workPhoneNumber){
    if(!validatePhoneNumbers(workPhoneNumber)){
      errors.workPhoneNumber = 'Please enter 10 digit work phone number';
    }
  }

  var accountPhoneNumber = values.accountPhoneNumber
  if(accountPhoneNumber){
    if(!validatePhoneNumbers(accountPhoneNumber)){
      errors.accountPhoneNumber = 'Please enter 10 digit account phone number';
    }
  }

  return errors;
}

function validatePhoneNumbers(phoneNumber){
  var match = phoneNumber.match(/\D/);
  if(match != null){
    return false;
  }
  else
  {
    if(phoneNumber.length !=10){
      return false;
    }
  }
  return true;
}

//export default connect(mapStateToProps, mapDispatchToProps)(UserProfileContainer);

export default connect(mapStateToProps,null)(reduxForm({
    form: 'UserProfileForm',
    validate,
    enableReinitialize : true  //If your initialValues prop gets updated, your form will update too.
})(UserProfileContainer));
