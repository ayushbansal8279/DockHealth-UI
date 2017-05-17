import React from 'react'
import {Link} from 'react-router'

class PatientList extends React.Component {
		constructor(props) {
				super(props)
		}
	render() {
		return (
			<div className="content-block">
				<h4>All Patients
					<Link to="/addPatient">
						<button className="button secondary button-small float-right">Add Patient</button>
					</Link>
				</h4>
				<ul className="no-bullet expand">
					{this.props.patients
						.map(patient => {
							return (
								<div className="task-item tag" key={patient.patientId}>
									<div className="task-item-inner-wrapper" data-toggle="">
										<div className="mark-complete-wrapper">
										</div>
										<div className="task-title-wrapper clearfix">
											<div className="task-title-left float-left">
													{patient.firstName}&nbsp;{patient.lastName}
											</div>
											<div className="task-title-right float-right">
												<Link to={"/updatePatient/"+patient.patientId}><button className="button secondary button-small float-right">Edit</button></Link>
											</div>
										</div>
									</div>
								</div>
							);
						})
					}
				</ul>
			</div>
		);
	}
}

export default PatientList
