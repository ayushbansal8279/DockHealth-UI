import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux';
import { Link } from 'react-router'
import * as PatientActions from '../../actions/patient-actions'

class TaskListPatients extends React.Component {

	componentDidMount () {
		// triggers action to get data and update store in reducer > allPatients
    // this.props.actions.getAllPatients()
		this.props.actions.getPatientsByTaskList()
  }

  render() {
    return (
			<div className="content-block">
				<h6>Patients in this list</h6>
				<ul className="no-bullet expand">
					{this.props.patients.map(patient => {
						return (
							<li key={patient.patientId}>{patient.firstName} {patient.lastName}</li>
						);
					})}
				</ul>
	  		<Link to="/addPatient">
	    		<button className="button secondary button-small float-right">Add Patient</button>
	  		</Link>
			</div>
    );
    }
}
//)

//property validation
TaskListPatients.propTypes = {
  patients: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
}

// allPatients comes from reducer
const mapStateToProps = function(store) {
  return {
    patients: store.patientState.listPatients
  }
}

const mapDispatchToProps = function (dispatch) {
  return {
    actions: bindActionCreators(PatientActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskListPatients);
