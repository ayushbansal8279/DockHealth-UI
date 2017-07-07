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
        <div className="wrapper top-buffer">
            <div className="columns large-8 large-offset-2">
              <div className="row">

                {/* Profile Image */}
                <div className="columns large-12 text-center">
                  <div className="update-photo" data-open="update-profile-photo">
                    <img className="member-photo circle xlarge" src={userProfilePic} alt="name of user"/>
                    <span className="update circle xlarge">Update picture</span>
                  </div>
                  <h5 className="top-buffer">{initialValues.firstName} {initialValues.lastName}</h5>
                </div>
                {/* Profile Image Modal */}
                <div className="reveal text-center" id="update-profile-photo" data-reveal>
                  <h5 className="margin-bottom">Update profile photo</h5>
                  <p onClick={this.onClickRemovePicture}>Remove photo</p>
                  <p>
                    <input type="file" hidden name="file" id="file" className="inputfile" onChange={this.handleImageChange}/>
                    <label htmlFor="file">Upload photo</label>
                  </p>
                  <p>Take photo</p>
                  <button className="close-button" data-close aria-label="Close modal" type="button">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>

                {/* <div className="columns large-12 text-center">
                  <div className="update-photo" data-open="update-profile-photo">
                    <img className="member-photo circle xlarge" src="assets/img/user1.png" alt="name of user"/>
                    <span className="update circle xlarge">Update picture</span>
                  </div>
                  <h5 className="top-buffer">Christopher Richardson</h5>
                </div> */}

                <form onSubmit = {handleSubmit(this.onSubmit.bind(this))} className="inline-label top-buffer expand white-bg">
                  <div className="column large-12 top-buffer">
                    <span className="item-title">General Information</span>
                  </div>

                  {/* <!-- First name --> */}
                  <Field name='firstName' decoratingClassName='top-buffer-small' type='text' component={BasicField} label='First Name'/>
                  {/* <div className="top-buffer-small column large-12 input-group no-icon">
                    <div className="form-floating-label input-wrapper has-error">
                      <input className="input-group-field" type="text"/>
                      <label>First name</label>
                      <span className="form-error">
                        Please enter your name.
                      </span>
                    </div>
                  </div> */}

                  {/* <!-- Last name --> */}
                  <Field name='lastName' type='text' component={BasicField} label='Last Name'/>
                  {/* <div className="column large-12 input-group no-icon">
                    <div className="form-floating-label input-wrapper">
                      <input className="input-group-field" type="text"/>
                      <label>Last name</label>
                    </div>
                  </div> */}

                  {/* <!-- Title --> */}
                  <div className="column large-12 input-group no-icon input-dropdown">
                    <div className="form-floating-label input-wrapper">
                      <input className="input-group-field" type="text" data-toggle="add-titles"/>
                      <label>Title</label>
                    </div>

                    <div className="dropdown-pane" id="add-titles" data-dropdown data-close-on-click="true">
                      <fieldset className="large-12 columns">
                        <ul className="no-bullet columns-2">
                          <li><input id="checkbox1" type="checkbox"/><label htmlFor="checkbox1">BA</label></li>
                          <li><input id="checkbox2" type="checkbox"/><label htmlFor="checkbox2">BS</label></li>
                          <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">BSN</label></li>
                          <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">CFNP</label></li>
                          <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">CMA</label></li>
                          <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">CPNP</label></li>
                          <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">CNS</label></li>
                          <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">DDS</label></li>
                          <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">DMD</label></li>
                          <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">DO</label></li>
                          <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">FAAP</label></li>
                          <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">FAAC</label></li>
                          <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">FACOG</label></li>
                          <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">FNP</label></li>
                          <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">FNP-C</label></li>
                          <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">LCSW</label></li>
                          <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">MBA</label></li>
                          <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">MBBS</label></li>
                          <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">MBChB</label></li>
                          <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">MD</label></li>
                          <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">MS</label></li>
                          <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">MPH</label></li>
                          <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">NP</label></li>
                          <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">PA</label></li>
                          <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">PA-C</label></li>
                          <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">PhD</label></li>
                          <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">RD</label></li>
                          <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">RN</label></li>
                          <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">Other</label></li>
                        </ul>
                      </fieldset>
                    </div>
                  </div>

                  {/* <!-- Specialties --> */}
                  <div className="column large-12">
                    <div className="accordion" data-accordion data-allow-all-closed="true">
                      <div className="accordion-item is-active" data-accordion-item>
                        <a href="#" className="accordion-title">Specialties</a>
                        <div className="accordion-content no-border" data-tab-content>
                          <div className="column large-12">
                            <div className="row">
                              <ul className="tabs" data-tabs id="add-specialty-tab">
                                <li className="tabs-title is-active"><a href="#panel1" aria-selected="true">Choose Specialties</a></li>
                                <li className="tabs-title"><a href="#panel2">Manually Add Specialties</a></li>
                              </ul>

                              <div className="tabs-content large-12" data-tabs-content="add-specialty-tab">
                                <div className="tabs-panel is-active" id="panel1">
                                  <div className="row input-dropdown-wrapper">
                                    <a className="dropdown button expand field" data-toggle="choosespecialty">Add a specialty</a>
                                    <div className="dropdown-pane button-dropdown" id="choosespecialty" data-dropdown data-close-on-click="true">
                                      <ul className="no-bullet">
                                        <li><input id="checkbox1" type="checkbox"/><label htmlFor="checkbox1">Allergy and Immunology</label></li>
                                        <li><input id="checkbox1" type="checkbox"/><label htmlFor="checkbox1">Anesthesiology</label></li>
                                        <li><input id="checkbox1" type="checkbox"/><label htmlFor="checkbox1">Medical Genetics and Genomics</label></li>
                                        <li><input id="checkbox1" type="checkbox"/><label htmlFor="checkbox1">Physical Medicine and Rehabilitation</label></li>
                                      </ul>
                                    </div>
                                  </div>
                                  <div className="row top-buffer table-header">
                                    <div className="columns large-6">
                                      Specialty
                                    </div>
                                    <div className="columns large-6">
                                      Subspecialty
                                    </div>
                                  </div>
                                  <div className="row hide table-row">
                                    <div className="columns large-12">
                                      <span className="details">You have not added any specialties</span>
                                    </div>
                                  </div>
                                  <div className="row table-row">
                                    <div className="columns large-6">
                                      Psychiatry
                                    </div>
                                    <div className="columns large-6">
                                      <ul className="condense no-bullet no-bottom-buffer">
                                        <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">PhD</label></li>
                                        <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">RD</label></li>
                                        <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">RN</label></li>
                                      </ul>
                                    </div>
                                  </div>

                                  <div className="row table-row">
                                    <div className="columns large-6">
                                      Dermatology
                                    </div>
                                    <div className="columns large-6">
                                      <ul className="no-bullet condense no-bottom-buffer">
                                        <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">PhD</label></li>
                                        <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">RD</label></li>
                                        <li><input id="checkbox3" type="checkbox"/><label htmlFor="checkbox3">RN</label></li>
                                      </ul>
                                    </div>
                                  </div>

                                </div>
                                <div className="tabs-panel" id="panel2">
                                  <div className="row">
                                    <div className="top-buffer-small input-group no-icon">
                                      <div className="form-floating-label input-wrapper">
                                        <textarea className="input-group-field"></textarea>
                                        <label>Specialties</label>
                                      </div>
                                    </div>
                                    <div className="input-group no-icon">
                                      <div className="form-floating-label input-wrapper">
                                        <textarea className="input-group-field"></textarea>
                                        <label>Subspecialties</label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="column large-12 top-buffer">
                    <span className="item-title">Contact</span>
                  </div>

                  <Field name='mobilePhoneNumber' decoratingClassName='top-buffer-small' type='text' component={BasicField} label='Mobile Phone Number'/>
                  <Field name='workPhoneNumber' type='text' component={BasicField} label='Work Phone Number'/>
                  <Field name='faxNumber' type='text' component={BasicField} label='Fax Number'/>
                  <Field name='emailPref' type='text' component={BasicField} label='Email'/>

                  {/* <!-- Notifications --> */}
                  <div className="column top-buffer large-12">
                    <div className="row">
                      <div className="column">
                        <span className="item-title">Notifications</span>
                        <p className="text-light">Fine print about notifications should go here</p>
                      </div>
                      <div className="column shrink">
                        <div className="switch">
                          <Field className="switch-input" id="exampleSwitch" type="checkbox" name="pushPref" component="input"/>
                          <label className="switch-paddle" htmlFor="exampleSwitch">
                            <span className="show-for-sr">Download Kittens</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <!-- Save --> */}
                  <div className="column large-12 text-center top-buffer">
                    <button type="submit" className="button medium secondary">Save</button>
                  </div>
                </form>

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
