



import React, { Component ,PropTypes} from 'react';
import {reduxForm, Field} from 'redux-form';
import {invitePersonToOrganization} from '../../actions/people-actions';
import BasicField from '../common/BasicField';
import { Link,hashHistory } from 'react-router';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as PeopleActions from '../../actions/people-actions';
import * as userApi from '../../api/user-api'


class UserProfileContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {file: '',imagePreviewUrl: ''};
  }

    componentDidMount () {
      userApi.getUserProfilePic()
      .then((datapic) =>{
        //console.log (datapic);
      })
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
      }

      //reader.readAsDataURL(file)
      reader.readAsArrayBuffer(file)
    }

    onSubmit (formProps) {
      console.log(formProps);
      // this.props.invitePersonToOrganization(formProps)
      // .then((res)=>{
      //   //this.props.resetForm;//reduxforms injected fucntion
      //   hashHistory.push('/people')
      // })
      // .catch((error)=>{
      //   this.setState({invitePeopleResult: error.message}); //this will cause render to be called
      // })
    }

    render(){
      const handleSubmit = this.props.handleSubmit; //injected by reduxform

      var userProfile = JSON.parse(sessionStorage.userProfile) //this is needed as userProfile is stringyfied and stored
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
        <div>
          <div className="off-canvas-content" data-off-canvas-content>

            <div className="top-bar-left">
                <h3>My Profile</h3>
            </div>

              <div className="wrapper large-8 large-offset-2 top-buffer">
                <div className="row">
                  <div className="columns large-12 text-center">
                    <img className="member-photo circle xlarge" src={userProfilePic} alt="name of user"></img>
                    <h4 className="top-buffer">{userProfile.firstName} {userProfile.lastName}</h4>
                  </div>
                  <div className="columns large-12 text-center">
                    <p>Remove photo</p>
                    <p><input type="file" hidden name="file" id="file" className="inputfile" onChange={this.handleImageChange}/>
                    <label htmlFor="file">Upload photo</label></p>
                    <p>Take photo</p>
                  </div>
               </div>

            </div>


            <div className="large-12 columns" >
              <div className="column">
                <form onSubmit = {handleSubmit(this.onSubmit.bind(this))}>
                  <h4>Invite Person to Organization</h4>

                  <div className="row">
                    <div className="small-12 columns">
                    <h3>{this.state.invitePeopleResult}</h3>
                    </div>
                  </div>

                  <div className="row">
                    <div className="medium-6 columns">
                          <Field name='firstName' type='text' component={BasicField} label='First Name' placeholder={userProfile.firstName}/>
                    </div>
                    <div className="medium-6 columns">
                          <Field name='lastName' type='text' component={BasicField} label='Last Name' placeholder={userProfile.lastName}/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="medium-12 columns">
                            <Field name='email' type='text' component={BasicField} label='Email' placeholder='required'/>
                    </div>
                  </div>
                  <div className="row">
                      <div className="medium-12 columns button-group">
                          <button className="button primary float-right button-small">Invite</button>
                        <Link to="/people"><button className="button secondary button-small float-right">Cancel</button></Link>
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

function mapStateToProps(state) {
  return {
    userProfilePic:state.userState.userProfilePic
  };
}

function mapDispatchToProps(dispatch) {
  return  bindActionCreators(PeopleActions, dispatch)
}



function validate(values){
  const errors = {};

  return errors;
}

//export default connect(mapStateToProps, mapDispatchToProps)(UserProfileContainer);

export default connect(mapStateToProps,mapDispatchToProps)(reduxForm({
    form: 'UserProfileForm',
    validate
})(UserProfileContainer));
