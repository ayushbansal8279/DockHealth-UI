import React from 'react'
import { SubmissionError, Field, reduxForm } from 'redux-form'
import * as PatientActions from '../../actions/patient-actions'
import { connect } from 'react-redux'
import BasicField from '../common/BasicField'
import { Link, browserHistory, hashHistory } from 'react-router'
import {bindActionCreators} from 'redux';

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

class FormPatient extends React.Component {
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
      this.props.actions.getPatientById(this.props.patientId);
		  //this.state.text = ""
  	}

  	onSubmit (formProps) {
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

      hashHistory.push('patient/'+this.props.patientId)

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

              <Field name='mrn' type='text' component={BasicField} label='MRN' placeholder='required'/>
              <Field name='firstName' type='text' component={BasicField} label='First name' placeholder='required' value={patient.firstName}/>
              <Field name='lastName' type='text' component={BasicField} label='Last name' placeholder='required' value={patient.firstName}/>

              <fieldset className="large-12 columns">
                <span className="inner">
                  <legend>Gender</legend>
                  <span className="float-right">
                    <input type="radio" name="gender" value="female"/><label>Female</label>
                    <input type="radio" name="gender" value="male"/><label>Male</label>
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
  return {
    patient: state.patientState.selectedPatient,
    initialValues: state.patientState.selectedPatient
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
