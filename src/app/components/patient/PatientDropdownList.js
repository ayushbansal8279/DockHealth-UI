import React from 'react'
import {Link} from 'react-router'

class PatientList extends React.Component {
	constructor(props) {
			super(props)
	}
	render(){
		return(
			<div className="user-list">
				<ul className="no-bullet expand">
					{this.props.patients
						.map(patient => {
							return(
								<li>{patient.firstName}&nbsp;{patient.lastName}&nbsp;{patient.mrn}</li>
							);
						})
					}
				</ul>
			</div>
		);
	}
}

export default PatientList