import React from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import { SubmissionError, Field, reduxForm } from 'redux-form'
import * as PatientApi from '../../api/patient-api'
import store from '../../store'
import BasicField from '../common/BasicField'

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
      		value: ''
    	};
    	this.onSubmit = this.onSubmit.bind(this)
  	}
  	componentDidMount () {
    	console.log("mounted FormPatient component")
		//this.state.text = ""
  	}

  	onSubmit (form) {
		PatientApi.addPatient({
            "firstName": form.firstName,
            "lastName": form.lastName,
            "gender": form.gender,
            "phoneHome": form.phoneHome,
            "phoneMobile": form.phoneMobile
        })
        .then(u => {
            //success('Patient Added')
            console.log('Patient Added')
            this.setState({value: ''})
            browserHistory.push('/')
        })
        .catch(e => {
            let msg = e.message || 'An error occurred.'
            let field = false
            if (!field) {
                error(msg)
            }
        })
  	}

    render() {
    return (

    <div className="content-block">
    <h4>Add Patient</h4>
	<div className="row collapse my-form-container">
		<div className="large-12 columns" >
			<div className="column">
				<form onSubmit={this.onSubmit}> 
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
                            <Field name='gender' type='text' component={BasicField} label='Gender' placeholder='required'/>
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


export default reduxForm({
  form: 'FormPatient',
  validate
})(FormPatient)
