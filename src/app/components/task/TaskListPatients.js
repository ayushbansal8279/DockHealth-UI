import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux';
import { Link } from 'react-router'
import * as PatientActions from '../../actions/patient-actions'
import * as TaskActions from '../../actions/task-actions'
import {mobileAnalyticsClient} from '../../api/analytics-api'

class TaskListPatients extends React.Component {
	constructor(props) {
		super(props)
		this.findTasksByPatient = this.findTasksByPatient.bind(this)
	}

	findTasksByPatient(patientId, taskListId){
		this.props.taskActions.getListTasksByPatient(patientId, taskListId)
	}

	componentDidMount () {
		this.props.actions.getPatientsByTaskList(this.props.taskListId)
		// triggers action to get data and update store in reducer > allPatients
    // this.props.actions.getAllPatients()
		mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
						'PageName': 'TaskListPatients'
		});
  }

	componentWillReceiveProps(nextProps){
		if(nextProps.taskListId != this.props.taskListId){
			this.props.actions.getPatientsByTaskList(nextProps.taskListId)
		}
	}

	// componentWillUpdate(nextProps, nextState){
	// 	this.props.actions.getPatientsByTaskList(this.props.taskListId)
	// }

  render() {
    return (
			<div className="content-block">
				<h6>Patients in this list</h6>
				<ul className="no-bullet expand">
					{this.props.patients.map(patient => {
						return (
							<li onClick={(e) => this.findTasksByPatient(patient.patientId, this.props.taskListId)} key={patient.patientId}><strong>{patient.firstName} {patient.lastName} {patient.mrn}</strong></li>
						);
					})}
				</ul>
	  		<Link to="/addPatient">
	    		<button className="button secondary button-small float-left">Add Patient</button>
	  		</Link>
				<br/>
				<p>*Click on Patients to sort by them</p>
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
    actions: bindActionCreators(PatientActions, dispatch),
		taskActions: bindActionCreators(TaskActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskListPatients);
