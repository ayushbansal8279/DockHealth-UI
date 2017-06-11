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
    this.state = {file: '',imagePreviewUrl: '',updateProfileResult:''};
  }

    componentDidMount () {
      userApi.getUserById()
      userApi.getUserProfilePic()
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
      //console.log(formProps);
      userApi.updateUser(formProps)
      .then((res)=>{
        this.setState({updateProfileResult: 'User Profile updated successfully!!!'});
        userApi.getUserById()
        userApi.getUserProfilePic()
        //hashHistory.push('/people')
      })
      .catch((error)=>{
        this.setState({updateProfileResult: error.message}); //this will cause render to be called
      })
    }

    render(){
      const handleSubmit = this.props.handleSubmit; //injected by reduxform

      //var userProfile = JSON.parse(sessionStorage.userProfile) //this is needed as userProfile is stringyfied and stored
      var userProfile = this.props.userProfile
      var {userProfilePic} = this.props
      if(userProfilePic == undefined){
        userProfilePic = "assets/img/dock-logo-white.png";
      }

      // let {imagePreviewUrl} = this.state;
      //  let imagePreview = null;
      //  if (imagePreviewUrl) {
      //    imagePreview = (<img src={imagePreviewUrl} />);
      //  }

   //<p><input type="file" hidden name="file" id="file" className="inputfile" onChange={this.handleFileUpload}/>
   //<label htmlFor="file">Upload photo</label></p>

   //<input type="file" onChange={this.handleImageChange} />
      return(
          <div className="wrapper large-8 large-offset-2 top-buffer">
            <div className="row">
              <div className="columns large-12 text-center">
                <div className="update-photo" data-open="update-profile-photo">
                  <img className="member-photo circle xlarge" src={userProfilePic} alt="name of user"/>
                  <span className="update circle xlarge">Update picture</span>
                </div>
                <h5 className="top-buffer">{userProfile.firstName} {userProfile.lastName}</h5>
              </div>
              <div className="reveal text-center" id="update-profile-photo" data-reveal>
                <h5 className="margin-bottom">Update profile photo</h5>
                <p>Remove photo</p>
                <p><input type="file" hidden name="file" id="file" className="inputfile" onChange={this.handleImageChange}/>
                <label htmlFor="file">Upload photo</label></p>
                <p>Take photo</p>
                <button className="close-button" data-close aria-label="Close modal" type="button">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </div>
            <div className="row">
              <form onSubmit = {handleSubmit(this.onSubmit.bind(this))} className="inline-label top-buffer expand white-bg">
                <Field name='firstName'  type='text' component={BasicField} label='First Name' placeholder={userProfile.firstName}/>
                <Field name='lastName' type='text' component={BasicField} label='Last Name' placeholder={userProfile.lastName}/>
                <Field name='specialty' type='text' component={BasicField} label='Specialty' placeholder={userProfile.specialty}/>
                <Field name='subspecialties' type='text' component={BasicField} label='Subspecialties' placeholder={userProfile.subspecialties}/>
                <Field name='accountPhoneNumber' type='text' component={BasicField} label='Account Phone Number' placeholder={userProfile.accountPhoneNumber}/>
                <Field name='workPhoneNumber' type='text' component={BasicField} label='Work Phone Number' placeholder={userProfile.workPhoneNumber}/>
                <Field name='faxNumber' type='text' component={BasicField} label='Fax Number' placeholder={userProfile.faxNumber}/>
                <Field name='mobilePhoneNumber' type='text' component={BasicField} label='Mobile Phone Number' placeholder={userProfile.mobilePhoneNumber}/>
                <div className="medium-12 columns button-group">
                    <button className="button primary float-right button-small">Save</button>
                  <Link to="/"><button className="button secondary button-small float-right">Cancel</button></Link>
                </div>
              </form>
            </div>
          </div>
      );
    }
}

function mapStateToProps(state) {
  return {
    userProfilePic:state.userState.userProfilePic,
    userProfile: state.userState.userProfile
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
    validate
})(UserProfileContainer));
