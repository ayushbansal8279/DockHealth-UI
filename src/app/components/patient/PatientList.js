import React from 'react';
import { Link } from 'react-router';

const PatientList = ({ patients }) => {
  return (
    <div className="item-list-wrapper">
      <div className="item row expanded align-middle">
        <div className="columns small-3 large-2 table-header">
          <span className="item-title">MRN</span>
        </div>
        <div className="columns small-3 large-3 table-header">
          <span className="item-title">First Name</span>
        </div>
        <div className="columns small-3 large-3 table-header">
          <span className="item-title">Last Name</span>
        </div>
        <div className="columns small-3 large-4 table-header">
          <span className="item-title">&nbsp;</span>
        </div>
      </div>
      {(patients || []).map(patient => {
        return (
          <Link to={`/patient/${patient.patientIdentifier}`} key={patient.patientIdentifier}>
            <div className="item row expanded align-middle">
              <div className="columns small-3 large-2">
                <span className="highlight">{patient.mrn}</span>
              </div>
              <div className="columns small-3 large-3">
                <span className="item-title">{patient.firstName}</span>
              </div>
              <div className="columns small-3 large-3">
                <span className="item-title">{patient.lastName}</span>
              </div>
              <div className="columns small-3 large-4">
                <span className="item-title" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default PatientList;
