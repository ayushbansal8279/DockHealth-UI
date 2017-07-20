import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux';

class AddSubtaskForm extends React.Component{

  constructor(props, container) {
		super(props)
		this.state = {
				description: '',
        assignedToId: '',
        patientId: ''
		}
	}

  addSubtask = () => {
    // this.props.submitSubtask(this.state)
    this.props.addSubtask(this.state)
  }

  handleDescriptionChange = (e) => {
   this.setState({description: e.target.value});
  }

  render(){
    return(
      <form>
        <div className="subtask-wrapper">
          <div className="row expanded">
            <div className="column small-4 toggle-add-subtask">
              <svg className="icon"><use xlinkHref="#icon-arrow-left"></use></svg>
            </div>
            <div className="column small-4 text-center">
              <h5 className="section-title">Add a subtask</h5>
            </div>
          </div>

          {/* Main task title */}
          <div className="column large-12 input-group has-value">
            <span className="task-title">Task: Please help get Sally in for early Remicade infusion</span>
          </div>

          {/* Task */}
          <div className="column large-12 input-group">
            <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-pencil"></use></svg></span>
            <div className="input-wrapper form-floating-label">
              <Field className="input-group-field" type="text" component="input" type="text" name="description" value={this.state.description} onChange={(e) => this.handleDescriptionChange(e)}/>
              <label>Subtask</label>
            </div>
          </div>

          {/* ADD PATIENT */}
          <div className="column large-12 input-group">
            <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-pencil"></use></svg></span>
            <div className="input-wrapper form-floating-label">
              <input id="add-patient-subtask" className="add-patient input-group-field" type="text"/>
              <label>Add Patient</label>
            </div>
          </div>

          {/* ASSIGNED TO */}
          <div className="column large-12 input-group">
            <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-assign-to"></use></svg></span>
            <div className="input-wrapper form-floating-label">
              <input id="assign-subtask-to" className="assign-to input-group-field" type="text"/>
              <label>Assigned to</label>
            </div>
          </div>

          {/* SAVE */}
          <div className="column large-12 text-right">
            <input onClick={this.addSubtask} type="button" disabled={this.props.submitting} className="button secondary" value="Save"/>
          </div>
        </div>
      </form>
    )
  }
}

AddSubtaskForm = reduxForm({
  // a unique name for the form
  form: 'addSubtaskForm',
  enableReinitialize : true
})(AddSubtaskForm)

const mapStateToProps = function(store){

  // var initialValues = {}
  // if(this.props.taskList){
  //   initialValues = this.props.taskList
  // }
  // return{
  //   initialValues: initialValues
  // }
}

export default connect(mapStateToProps)(AddSubtaskForm)
