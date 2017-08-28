import React from 'react'
import { SubmissionError, Field, reduxForm } from 'redux-form'
import Moment from 'react-moment'
import * as PatientActions from '../../actions/patient-actions'
import { connect } from 'react-redux'
import BasicField from '../common/BasicField'
import { Link, browserHistory, hashHistory } from 'react-router'
import {bindActionCreators} from 'redux';
import {mobileAnalyticsClient} from '../../api/analytics-api'
import BaseComponent from '../BaseComponent'

const { DOM: { input, select, textarea } } = React  

const validate = values => {
  const errors = {}
  if (!values.firstName) {
    errors.firstName = 'Required'
  }
  if (!values.lastName) {
    errors.lastName = 'Required'
  }
  return errors
}

class FormPatient extends BaseComponent {
	constructor(props) {
    	super(props)
    	this.state = {
      		value: '',
          saveMessage: ''
    	};
    	this.onSubmit = this.onSubmit.bind(this)
  	}

  	componentDidMount () {
      console.log("mounted FormPatient component")
      if(this.props.patientId){
        this.props.actions.getPatientById(this.props.patientId);
      }
		  //this.state.text = ""
      mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
              'PageName': 'FormPatient'
      });
  	}

    // onGenderChanged (e) {
    //   this.setState({
    //     gender: e.currentTarget.value
    //   });
    // }

  	onSubmit (formProps) {
      var dobStr = $('.dobpickdate').val(); //form props is not picking up dob date value hence need to set it manually
      if(dobStr && dobStr!=""){
        formProps.dob = dobStr
      }
      if (this.props.patientId) {
          this.props.actions.updatePatient(formProps)
          .then((res) => {
            this.setState({saveMessage: 'Patient updated succesfully'})
          })
          .catch((e) => {
            this.setState({saveMessage: e.message})
          })
      }else{
  		    this.props.actions.addPatient(formProps)
          .then((res) => {
            this.setState({saveMessage: 'Patient created succesfully'})
          })
          .catch((e) => {
            this.setState({saveMessage: e.message})
          })
      }

      hashHistory.push('patientList')

  	}

    render() {
      var patient = {}
      if(this.props.patient){
        patient = this.props.patient
        //this.state.firstName = this.props.patient.firstName
      }
      
      const handleSubmit = this.props.handleSubmit; //injected by reduxform
      return (
            <form className="inline-label" onSubmit={handleSubmit(this.onSubmit)}>
              <Field name='mrn' type='number' component={BasicField} label='MRN' placeholder='required'/>
              <Field name='firstName' type='text' component={BasicField} label='First name' placeholder='required'/>
              <Field name='lastName' type='text' component={BasicField} label='Last name' placeholder='required'/>

						  {/* <div className="column large-12 input-group no-icon">
                <div className="form-floating-label input-wrapper has-value"> */}
                  {/* <input className="input-group-field pickdate" type="text" value={patient.dob && <Moment format="MM/DD/YYYY">{new Date(patient.dob)}</Moment>} name="dob"/> */}
                   {/* <Field className="input-group-field pickdate" id="dob" name='dob' type='text' component="input"/> 
                  <label>Birthday</label>
                </div>
              </div> */}
              {/* <Field name='dob' type='text' component={BasicField} extraClassName="input-group-field pickdate" label='Birthday'/>  */}
              <fieldset className="large-12 columns">
                <span className="inner">
                  <legend>Birthday</legend>
                  <span className="float-left">
                    <Field className="input-group-field dobpickdate" id="dob" name='dob' type='text' component="input" placeholder="Select Date"/> 
                  </span>
                </span>
              </fieldset>
              <fieldset className="large-12 columns">
                <span className="inner">
                  <legend>Gender</legend>
                  <span className="float-right">
                    {/* <input type="radio" name="gender" value="female" checked={patient.gender && patient.gender === 'female'} onChange={this.onGenderChanged}/><label>Female</label>
                    <input type="radio" name="gender" value="male" checked={patient.gender && patient.gender === 'male'} onChange={this.onGenderChanged}/><label>Male</label> */}
                     <label><Field name='gender' component="input" type='radio' value='male'/> Male</label>
                    <label><Field name='gender' component="input" type='radio' value='female'/> Female</label> 
                  </span>
                </span>
              </fieldset>

              <Field name='phoneHome' type='tel' component={BasicField} label='Home phone' placeholder='required'/>
              <Field name='phoneMobile' type='tel' component={BasicField} label='Mobile' placeholder='required'/>
              <Field name='email' type='email' component={BasicField} label='Email' placeholder='required'/>

              <Field name='notes' type='text' component={BasicField} label='Notes' placeholder='required'/>

              <div className="column large-12 text-right text-center">
                <input type="submit" className="button secondary medium" value="Save"/>
              </div>

              <div className="column large-12 text-right text-center">
                <h3>{this.state.saveMessage}</h3>
              </div>

            </form>
      )
    }
}

const mapStateToProps = function (state) {
  var patientInitialValues = null
  if(state.patientState.selectedEmrPatient){
    patientInitialValues = state.patientState.selectedEmrPatient
  }
  if(state.patientState.selectedPatient){
    patientInitialValues = state.patientState.selectedPatient
  }
  return {
    patient: state.patientState.selectedPatient,
    initialValues: patientInitialValues
  }
}

const mapDispatchToProps = function (dispatch) {
  return {
    actions: bindActionCreators(PatientActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'FormPatient',
    validate
})(FormPatient));

