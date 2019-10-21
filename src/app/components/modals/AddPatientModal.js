import React from 'react';
import { connect } from 'react-redux';

import FormPatient from '../patient/FormPatient';
import SearchPatient from '../patient/SearchPatient';

class AddPatientModal extends React.Component {
  componentDidUpdate() {
    enableFoundationForSingleComponent('#addPatientModal');
  }

  render() {
    const { currentUserProfile } = this.props;

    return (
      <div className="reveal" id="addPatientModal" data-reveal="">
        <div className="column large-12 text-center">
          <h5 className="section-title">Add a patient</h5>
        </div>
        {currentUserProfile?.emrIntegrationEnabled && (
          <div>
            <div className="column large-12 text-center">
              Search for an existing patient in the Electronic Medical Records
            </div>
            <SearchPatient />
            <div className="column large-12 text-center">
              or enter patient manually
            </div>
          </div>
        )}
        <FormPatient modalForm="true" />
        <button
          className="close-button"
          data-close=""
          aria-label="Close modal"
          type="button"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  currentUserProfile: store.userState.userProfile,
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddPatientModal);
