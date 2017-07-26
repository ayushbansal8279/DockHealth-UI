import React from 'react'
import {Link} from 'react-router'
import BaseComponent from '../BaseComponent'

class PatientDropdownList extends BaseComponent {
	constructor(props) {
			super(props)
			this.addPatientToTask = this.addPatientToTask.bind(this)
	}

	addPatientToTask(patientId){
		this.props.addPatientToTaskCallback(patientId, this.props.taskId);
		// alert('clicked');
	}

	render(){
		return(
			<div className="patient-list">
				<ul className="no-bullet expand">
					{this.props.patients
						.map(patient => {
							return(
								<li onClick={(e) => this.addPatientToTask(patient.patientId)} key={patient.patientId}>{patient.firstName}&nbsp;{patient.lastName}&nbsp;{patient.mrn}</li>
							);
						})
					}
				</ul>
			</div>

		);
	}
}

export default PatientDropdownList
