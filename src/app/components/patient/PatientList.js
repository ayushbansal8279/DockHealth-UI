import React from 'react'
import {Link} from 'react-router'
import BaseComponent from '../BaseComponent'

class PatientList extends BaseComponent {
		constructor(props) {
				super(props)
		}
	render() {
		return (
      <div className="list-wrapper">
				<div className="sk-circle hide">
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
				</div>
        <div className="item-list-wrapper">
					{this.props.patients
						.map(patient => {
							return (
								<Link to={"/patient/"+patient.patientId} key={patient.patientId}>
									<div className="item row expanded align-middle">
										<div className="columns shrink">
											<span className="highlight">{patient.mrn}</span>
										</div>
										<div className="columns">
											<span className="item-title">{patient.firstName}&nbsp;{patient.lastName}</span>
										</div>
									</div>
								</Link>
							);
						})
					}
        </div>
      </div>
		);
	}
}

export default PatientList
