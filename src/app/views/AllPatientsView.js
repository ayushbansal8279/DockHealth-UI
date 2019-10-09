import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { destroy } from 'redux-form';
import * as PatientActions from '../actions/patient-actions';
import PatientListContainer from '../components/patient/PatientListContainer';
import SearchPatient from '../components/patient/SearchPatient';
import FormPatient from '../components/patient/FormPatient';
import { mobileAnalyticsClient } from '../api/analytics-api';
import BaseComponentWithFoundationUpdate from '../components/BaseComponentWithFoundationUpdate';

class AllPatientsView extends BaseComponentWithFoundationUpdate {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
    };
  }

  componentDidMount() {
    const { patientActions } = this.props;
    patientActions.loading();
    patientActions.getAllPatients();
    patientActions.patientToState(null);
    mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
      PageName: 'AllPatients',
    });
  }

  clearSearch = () => {
    this.setState({ searchTerm: '' });
    toggleSearch();
  };

  searchUpdated = (term) => {
    this.setState({ searchTerm: term.target.value });
  };

  refresh = () => {
    const { patientActions } = this.props;
    patientActions.loading();
    patientActions.getAllPatients();
    patientActions.patientToState(null);
  };

  handleAddPatient = () => {
    const { patientActions, formActions } = this.props;
    patientActions.patientToState(null);
    formActions.destroy('FormPatient');
    openAddForm();
  };

  render() {
    return (
      <div className="off-canvas-content" data-off-canvas-content>
        <div className="row expanded collapse">
          <div className="large-12 columns">
            <header className="nav-down">
              <div className="top-bar">
                <div className="top-bar-left">
                  <button
                    className="menu-icon hide-for-medium"
                    type="button"
                    data-toggle="sidebar"
                  />
                  <h3>Patients</h3>
                </div>
              </div>
              <div className="wrapper list-filter row collapse align-middle align-right">
                <div className="columns controls">
                  <div className="input-group searchbar">
                    <input
                      className="input-field search-field"
                      type="search"
                      placeholder="Search patients"
                      onChange={this.searchUpdated}
                      value={this.state.searchTerm}
                    />
                    <div className="input-group-button">
                      <button className="button search">
                        <svg onClick={this.clearSearch} className="icon">
                          <use xlinkHref="#icon-search" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="columns shrink icon-group controls">
                  <span onClick={e => this.refresh()}>
                    <svg className="icon refresh">
                      <use
                        xlinkHref="#icon-activity"
                      />
                    </svg>
                  </span>
                </div>
                <div className="columns shrink" onClick={e => this.handleAddPatient()}>
                  <svg id="icon-add-patient" className="add icon add-other">
                    <image width="62px" height="62px" xlinkHref="assets/img/icons/add-patient.png" />
                  </svg>
                </div>
              </div>
            </header>
            <div className="add-form-wrapper">
              <div className="task-item add-form row expanded">
                <div className="column large-12 text-center">
                  <h5 className="section-title">Add a patient</h5>
                </div>
                {this.props.currentUserProfile && this.props.currentUserProfile.emrIntegrationEnabled
                && (
                  <div>
                    <div className="column large-12 text-center">
                      Search for an existing patient in the Electronic Medical Records
                    </div>
                    <SearchPatient />
                    <div className="column large-12 text-center">
                      or enter patient manually
                    </div>
                  </div>
                )
                }
                <FormPatient />
              </div>
            </div>
            <div className="list-wrapper">
              {this.props.isFetching
                ? (
                  <div className="sk-circle">
                    <div className="sk-circle1 sk-child" />
                    <div className="sk-circle2 sk-child" />
                    <div className="sk-circle3 sk-child" />
                    <div className="sk-circle4 sk-child" />
                    <div className="sk-circle5 sk-child" />
                    <div className="sk-circle6 sk-child" />
                    <div className="sk-circle7 sk-child" />
                    <div className="sk-circle8 sk-child" />
                    <div className="sk-circle9 sk-child" />
                    <div className="sk-circle10 sk-child" />
                    <div className="sk-circle11 sk-child" />
                    <div className="sk-circle12 sk-child" />
                  </div>
                )
                : <PatientListContainer searchTerm={this.state.searchTerm} />
              }
            </div>


          </div>
        </div>
      </div>

    );
  }
}

const mapStateToProps = store => ({
  isFetching: store.patientState.isFetching,
  currentUserProfile: store.userState.userProfile,
});

const mapDispatchToProps = dispatch => ({
  patientActions: bindActionCreators(PatientActions, dispatch),
  formActions: bindActionCreators({ destroy }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AllPatientsView);
