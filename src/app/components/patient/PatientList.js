import React from 'react'
import {Link} from 'react-router'
import BaseComponent from '../BaseComponent'

class PatientList extends BaseComponent {
		constructor(props) {
				super(props)
		}
	render() {
		return (
        <div className="item-list-wrapper">
					{this.props.patients && this.props.patients.map(patient => {
							return (
								<Link to={"/patient/"+patient.patientId} key={patient.patientId}>
									<div className="item row expanded align-middle">
										<div className="columns small-4 large-2">
											<span className="highlight">{patient.mrn}</span>
										</div>
										<div className="columns small-8 large-10">
											<span className="item-title">{patient.firstName}&nbsp;{patient.lastName}</span>
										</div>
										{/* <div className="columns shrink more-options-wrapper" onClick={(e) => e.preventDefault()}>
											<svg className="icon ellipses medium" data-toggle={"more-options-person-id-"+patient.patientId}><use xlinkHref="#icon-ellipses"></use></svg>
											<div className="small dropdown-pane" id={"more-options-person-id-"+patient.patientId} data-dropdown data-close-on-click="true">
												<ul className="no-bullet">
													<li>Delete this patient</li>
												</ul>
											</div>
										</div> */}
									</div>
								</Link>
							);
						})
					}
        </div>
		);
	}
}

export default PatientList
