import React, { Component ,PropTypes} from 'react';
import {reduxForm, Field} from 'redux-form';
import {invitePersonToOrganization} from '../../actions/people-actions';
import {connect} from 'react-redux'
import BasicField from '../common/BasicField';
import { Link,hashHistory } from 'react-router';

class InvitePeople extends Component {

  constructor(props) {
    	super(props)
    	this.state = {
      		invitePeopleResult: ''
    	};
  	}

  onSubmit (formProps) {
    //console.log(formProps);
    this.props.invitePersonToOrganization(formProps)
    .then((res)=>{
      //this.props.resetForm;//reduxforms injected fucntion
      hashHistory.push('/people')
    })
    .catch((error)=>{
      this.setState({invitePeopleResult: error.message}); //this will cause render to be called
    })

  }

  render (){
    const handleSubmit = this.props.handleSubmit; //injected by reduxform

      return(
        <div className="content-block">

        <div className="row collapse my-form-container">
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
                                <Field name='firstName' type='text' component={BasicField} label='First Name' placeholder='required'/>
                </div>
                <div className="medium-6 columns">
                                <Field name='lastName' type='text' component={BasicField} label='Last Name' placeholder='required'/>
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

//redux form Version 6 specifically needs an call to connect
export default connect(null, {invitePersonToOrganization})(reduxForm({
    form: 'InvitePeopleForm',
    //fields:['tasklistname'],
    validate
})(InvitePeople));
