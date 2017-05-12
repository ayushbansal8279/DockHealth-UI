import React from 'react'
import { SubmissionError, Field, reduxForm } from 'redux-form'
import * as PatientActions from '../../actions/patient-actions'
import { connect } from 'react-redux'
import BasicField from '../common/BasicField'
import { Link, browserHistory } from 'react-router'
import {bindActionCreators} from 'redux';

const validate = values => {
  const errors = {}
  if (!values.firstName) {
    errors.firstName = 'Required'
  }
  if (!values.lastName) {
    errors.lastName = 'Required.'
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


  	}

    render() {
      var patient = {}
      if(this.props.patient){
        patient = this.props.patient
        //this.state.firstName = this.props.patient.firstName
      }

      const handleSubmit = this.props.handleSubmit; //injected by reduxform
      return (
        <div className="content-block">
          <h4>Add Patient</h4>
        	<div className="row collapse my-form-container">
        		<div className="large-12 columns" >
        			<div className="column">
        				<form onSubmit={handleSubmit(this.onSubmit)}>
                  <div className="row">
                    <div className="small-12 columns">
                    <h3>{this.state.saveMessage}</h3>
                    </div>
                  </div>
        					<div className="row">
        						<div className="medium-6 columns">
                      <Field name='firstName' type='text' component={BasicField} label='First Name' placeholder='required' value={patient.firstName}/>
        						</div>
        						<div className="medium-6 columns">
                      <Field name='lastName' type='text' component={BasicField} label='Last Name' placeholder='required' value={patient.firstName}/>
        						</div>
        					</div>
        					<div className="row">
        						<div className="medium-6 columns">
                      <Field name='gender' type='text' component={BasicField} label='Gender' placeholder='required'/>
        						</div>
                    <div className="medium-6 columns">
                      <Field name='mrn' type='text' component={BasicField} label='MRN' placeholder='required'/>
                    </div>
        					</div>
        					<div className="row">
        						<div className="medium-6 columns">
                      <Field name='phoneHome' type='tel' component={BasicField} label='Home Phone' placeholder='required'/>
        						</div>
        						<div className="medium-6 columns">
                      <Field name='phoneMobile' type='tel' component={BasicField} label='Cell Phone' placeholder='required'/>
        						</div>
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
