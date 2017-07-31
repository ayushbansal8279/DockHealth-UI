import React, { Component ,PropTypes} from 'react';
import {reduxForm, Field} from 'redux-form';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import { Link,hashHistory } from 'react-router';
import BasicField from '../common/BasicField';
import * as PeopleActions from '../../actions/people-actions';
import {mobileAnalyticsClient} from '../../api/analytics-api'
import BaseComponent from '../BaseComponent'

class InvitePeople extends BaseComponent {

  constructor(props) {
    	super(props)
    	this.state = {
      		invitePeopleResult: ''
    	};
  	}

    componentDidMount () {
      mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
              'PageName': 'InvitePeople'
      });
    }

  onSubmit (formProps) {
    //console.log(formProps);
    this.setState({invitePeopleResult: "Sending Invitation ..."})
    var component = this
    this.props.invitePersonToOrganization(formProps)
    .then((res)=>{
      component.props.findAllUsersByOrganizationId();
      //hide the form
      $('.add').click();
    })
    .catch((error)=>{
      this.setState({invitePeopleResult: error.message}); //this will cause render to be called
    })

  }

  render (){
    const handleSubmit = this.props.handleSubmit; //injected by reduxform

      return(

          <div className="add-form-wrapper">
            <div className="task-item add-form row expanded">
              <form className="inline-label" onSubmit = {handleSubmit(this.onSubmit.bind(this))}>
                <div className="column large-12 text-center">
                  <h5 className="section-title">Invite a person</h5>
                </div>

                {/* First name */}
                <Field name='firstName' type='text' component={BasicField} label='First Name' placeholder='required'/>
                {/*<div className="column large-12 input-group no-icon">
                  <div className="form-floating-label input-wrapper">
                    <input className="input-group-field" type="text"/>
                    <label>First name</label>
                  </div>
                </div>*/}

                {/* Last name */}
                <Field name='lastName' type='text' component={BasicField} label='Last Name' placeholder='required'/>
                {/*<div className="column large-12 input-group no-icon">
                  <div className="form-floating-label input-wrapper">
                    <input className="input-group-field" type="text"/>
                    <label>Last name</label>
                  </div>
                </div>*/}

                {/* Email name */}
                <Field name='email' type='email' component={BasicField} label='Email' placeholder='required'/>
                {/*<div className="column large-12 input-group no-icon">
                  <div className="form-floating-label input-wrapper">
                    <input className="input-group-field" type="text"/>
                    <label>Email</label>
                  </div>
                </div>*/}

                {/* SAVE */}
                <div className="column large-12 text-center">
                  <input type="submit" className="button medium secondary" value="Send invite"/>
                </div>
                <div className="column large-12 text-center">
                  <h3>{this.state.invitePeopleResult}</h3>
                </div>

              </form>
            </div>
          </div>

      );
    }
}

//this is automatically called as mentioned in last line reduxForm
function validate(values){
  const errors = {};

  if(!values.firstName){
    errors.firstName = 'Please enter First Name';
  }

  if(!values.lastName){
    errors.lastName = 'Please enter Last Name';
  }

  if(!values.email){
    errors.email = 'Please enter Email Address';
  }

  return errors;
}

// function mapStateToProps(state) { add this to connect if used AND <h3>{this.props.addtasklisterror}</h3>
//   return {
//     addtasklisterror: state.taskListState.addtasklisterror
//   };
// }

//this is almost similar to connect function from react-redux
//redux-form is injecting some helpers (like handleSubmit) that will be available to us on this.props
//this tells redux form about the fields that are contained within the form
//connect: 1st argument is mapStateToProps, 2nd is mapDispatchToProps
//redux form : 1st is form config, 2nd argument is mapStateToProps, 3rd is mapDispatchToProps

function mapDispatchToProps(dispatch) {
  return  bindActionCreators(PeopleActions, dispatch)
}

//redux form Version 6 specifically needs an call to connect
export default connect(null, mapDispatchToProps)(reduxForm({
    form: 'InvitePeopleForm',
    //fields:['tasklistname'],
    validate
})(InvitePeople));
