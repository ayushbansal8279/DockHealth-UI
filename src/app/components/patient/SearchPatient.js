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
		handleKeyPress = (event) => {
			if(event.key == 'Enter'){
				console.log('enter press here! ')
				this.searchPatients()
			}
		}

    searchPatients () {
				this.props.patientActions.loadingEMRPatients();
        this.props.patientActions.lookupEMRPatients(this.state.searchToken);
        this.props.formActions.destroy('FormPatient');
    }

    selectPatient (patient) {
        patient.dob = patient.dateOfBirth
        this.props.patientActions.selectEMRPatient(patient);
		}
		
    clearSearch () {
				this.props.patientActions.clearEMRPatients();
        this.props.formActions.destroy('FormPatient');
    }

    render() {

      const handleSubmit = this.props.handleSubmit; //injected by reduxform

      return (
					<form className="inline-label" onSubmit={handleSubmit(this.onSubmit)}>
						{/* <div className="column large-12 text-center">
							<h5 className="section-title">Add a patient</h5>
						</div>

						<div className="column large-12 text-center">
							Search for an existing patient in the Electronic Medical Records
						</div> */}

						{/* <!-- Lookup --> */}
						<div className="column large-12 top-buffer">
							<div className="row collapse expanded align-middle">
								<div className="columns input-group input-wrapper bottom-buffer-small icon-right">
									<div className="input-wrapper">
										<input className="input-group-field" type="text" placeholder="Search patient in EMR" onChange={this.onChange.bind(this)} onKeyPress={this.handleKeyPress}/>
									</div>
									<span className="input-group-label pointer" onClick={this.searchPatients.bind(this)}>
										<svg className="icon"><use xlinkHref="#icon-search"></use></svg>
									</span>
								</div>
								{this.props.emrPatients && this.props.emrPatients.length > 0 &&
								<div><a onClick={this.clearSearch.bind(this)}>&nbsp;&nbsp;&nbsp;&nbsp;Clear</a></div>
								}
							</div>
						</div>
					{this.props.isFetching ?
						<div className="sk-circle">
							<div className="sk-circle1 sk-child"></div>
							<div className="sk-circle2 sk-child"></div>
							<div className="sk-circle3 sk-child"></div>
							<div className="sk-circle4 sk-child"></div>
							<div className="sk-circle5 sk-child"></div>
							<div className="sk-circle6 sk-child"></div>
							<div className="sk-circle7 sk-child"></div>
							<div className="sk-circle8 sk-child"></div>
							<div className="sk-circle9 sk-child"></div>
							<div className="sk-circle10 sk-child"></div>
							<div className="sk-circle11 sk-child"></div>
							<div className="sk-circle12 sk-child"></div>
						</div>:
						<div className="column large-12 search-result-wrapper">

							{this.props.emrPatients && this.props.emrPatients.map((patient, index) => {
			            return(
			                <div className="item row expanded align-middle" onClick={this.selectPatient.bind(this, patient)} key={'mrn_'+patient.mrn+'_'+index}>
			                    <div className="columns shrink">
			                        <span className="">{patient.mrn}</span>
			                    </div>
			                    <div className="columns">
			                        <span className="">{patient.lastName}, {patient.firstName}</span>
			                    </div>
			                    <div className="columns">
			                        <span className=""><Moment format="MMM DD, YYYY">{patient.dateOfBirth}</Moment> ({patient.gender})</span>
			                    </div>
			                </div>
			            )
			        })}

						</div>
					}
					</form>
      )
    }
}

const mapStateToProps = function (state) {
  return {
		emrPatients: state.patientState.emrPatients,
		isFetching: state.patientState.isFetching,
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
