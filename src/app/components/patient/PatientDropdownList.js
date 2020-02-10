import React, { PureComponent } from 'react';

class PatientDropdownList extends PureComponent {
  constructor(props) {
    super(props);
    this.addPatientToTask = this.addPatientToTask.bind(this);
  }

  addPatientToTask(patientIdentifier) {
    this.props.addPatientToTaskCallback(patientIdentifier, this.props.taskIdentifier);
    // alert('clicked');
  }

  render() {
    return (
      <div className="patient-list">
        <ul className="no-bullet expand">
          {this.props.patients &&
            this.props.patients.map(patient => {
              return (
                <li
                  onClick={e => this.addPatientToTask(patient.patientIdentifier)}
                  key={patient.patientIdentifier}
                >
                  {patient.firstName}
                  &nbsp;
                  {patient.lastName}
                  &nbsp;
                  {patient.mrn}
                </li>
              );
            })}
        </ul>
      </div>
    );
  }
}

export default PatientDropdownList;
