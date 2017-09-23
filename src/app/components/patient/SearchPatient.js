import React from 'react'
import { SubmissionError, Field, reduxForm, actions, destroy } from 'redux-form'
import * as PatientActions from '../../actions/patient-actions'
import { connect } from 'react-redux'
import BasicField from '../common/BasicField'
import { Link, browserHistory, hashHistory } from 'react-router'
import {bindActionCreators} from 'redux';
import {mobileAnalyticsClient} from '../../api/analytics-api'
import BaseComponent from '../BaseComponent'
import Moment from 'react-moment'

class SearchPatient extends BaseComponent {
	constructor(props) {
    	super(props)
    	this.state = {
      		searchToken: ''
    	};
    	this.onSubmit = this.onSubmit.bind(this)
  	}

  	componentDidMount () {
    	console.log("mounted SearchPatient component")
			mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
							'PageName': 'SearchPatient'
			});
  	}

  	onSubmit (formProps) {
        console.log("in onSubmit");
    //   hashHistory.push('patient/'+this.props.patientId)
  	}

    onChange(event) {
        this.setState({
            searchToken: event.target.value
        });
    }

    searchPatients () {
        this.props.patientActions.lookupEMRPatients(this.state.searchToken);
        this.props.formActions.destroy('FormPatient');
    }

    selectPatient (patient) {
        patient.dob = patient.dateOfBirth
        this.props.patientActions.selectEMRPatient(patient);
    }

    render() {

      const handleSubmit = this.props.handleSubmit; //injected by reduxform

      return (
					<form className="inline-label" onSubmit={handleSubmit(this.onSubmit)}>
						{/* <div className="column large-12 text-center">
							<h5 className="section-title">Add a patient</h5>
						</div>

						<div className="column large-12 text-center">
							Search for an existing patient in the database
						</div> */}

						{/* <!-- Lookup --> */}
						<div className="column large-12 top-buffer">
							<div className="row collapse expanded align-middle">
								<div className="columns input-group input-wrapper bottom-buffer-small icon-right">
									<div className="input-wrapper">
										<input id="add-member-to-list" className="input-group-field" type="text" placeholder="Search patient in EMR" onChange={this.onChange.bind(this)}/>
									</div>
									<span className="input-group-label pointer" onClick={this.searchPatients.bind(this)}>
										<svg className="icon"><use xlinkHref="#icon-search"></use></svg>
									</span>
								</div>
							</div>
						</div>

						<div className="column large-12 search-result-wrapper">

							{this.props.emrPatients && this.props.emrPatients.map(patient => {
			            return(
			                <div className="item row expanded align-middle" onClick={this.selectPatient.bind(this, patient)} key={patient.mrn}>
			                    <div className="columns shrink">
			                        <span className="">{patient.mrn}</span>
			                    </div>
			                    <div className="columns">
			                        <span className="">{patient.lastName}, {patient.firstName}</span>
			                    </div>
			                </div>
			            )
			        })}

						</div>


					</form>
      )
    }
}

const mapStateToProps = function (state) {
  return {
    emrPatients: state.patientState.emrPatients
  }
}

const mapDispatchToProps = function (dispatch) {
  return {
    patientActions: bindActionCreators(PatientActions, dispatch),
    formActions: bindActionCreators({destroy}, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'SearchPatient'
})(SearchPatient));
