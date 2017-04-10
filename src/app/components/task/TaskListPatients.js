import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as PatientApi from '../../api/patient-api'
import store from '../../store'

//const TaskListPatients = () => (
class TaskListPatients extends React.Component {

	componentDidMount () {
    	PatientApi.getAllPatients()
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
			})
			}
		</ul>

  		<Link to="/addPatient">
    		<button className="button secondary button-small float-right">Add Patient</button>
  		</Link>
		
	</div>
    );
    }
}
//)

const mapStateToProps = function(store) {
  return {
    patients: store.patientState.allPatients
  };
};

export default connect(mapStateToProps)(TaskListPatients);