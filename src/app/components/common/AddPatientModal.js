import React from 'react'
import $ from 'jquery'
import BasicField from './BasicField'
import FormPatient from '../patient/FormPatient'
import SearchPatient from '../patient/SearchPatient'
class AddPatientModal extends React.Component {

  componentDidUpdate(prevProps, prevState) {
    enableFoundationForSingleComponent("#addPatientModal")
  }

  render(){
    return(
      <div className="reveal" id="addPatientModal" data-reveal="">

        <div className="column large-12 text-center">
          <h5 className="section-title">Add a patient</h5>
        </div>
        <div className="column large-12 text-center">
          Search for an existing patient in the database
        </div>
        <SearchPatient />
        <div className="column large-12 text-center">
          or enter patient manually
        </div>
        <FormPatient modalForm="true" isSubtask={this.props.isSubtask}/>
        <button className="close-button" data-close="" aria-label="Close modal" type="button">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    )
  }
}

export default AddPatientModal
