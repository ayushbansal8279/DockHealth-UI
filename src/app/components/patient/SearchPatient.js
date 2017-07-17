import React from 'react'
import { SubmissionError, Field, reduxForm } from 'redux-form'
import * as PatientActions from '../../actions/patient-actions'
import { connect } from 'react-redux'
import BasicField from '../common/BasicField'
import { Link, browserHistory, hashHistory } from 'react-router'
import {bindActionCreators} from 'redux';


class SearchPatient extends React.Component {
	constructor(props) {
    	super(props)
    	this.state = {
      		searchToken: ''
    	};
    	this.onSubmit = this.onSubmit.bind(this)
  	}

  	componentDidMount () {
    	console.log("mounted SearchPatient component")
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
    }
    
    selectPatient (patient) {
        this.props.patientActions.selectEMRPatient(patient);
    }

    render() {

      const handleSubmit = this.props.handleSubmit; //injected by reduxform
      
      return (
        <div className="column large-12 top-buffer">
            <form className="inline-label" onSubmit={handleSubmit(this.onSubmit)}>
                <div className="row collapse expanded align-middle">
                    <div className="columns input-group input-wrapper bottom-buffer-small icon-right">
                        <div className="input-wrapper">
                            <input id="searchPatient" name="searchPatient" className="input-group-field" type="text" placeholder="Search patient database" onChange={this.onChange.bind(this)}/>
                        </div>
                        <span className="input-group-label">
                            <button className="button search" onClick={this.searchPatients.bind(this)}>
                                <svg className="icon"><use xlinkHref="#icon-search"></use></svg>
                            </button>
                        </span>
                    </div>
                </div>
            </form>
            <div className="item row expanded align-middle">
            <div className="column large-12 search-result-wrapper">
                {this.props.emrPatients.map(patient => {
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
            </div>
        </div>
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
    patientActions: bindActionCreators(PatientActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'SearchPatient'
})(SearchPatient));
