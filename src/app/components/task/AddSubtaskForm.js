import React from 'react'
import { Field, reduxForm, formValueSelector, actions, stopSubmit } from 'redux-form'
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import BasicFieldTaskDescription from '../common/BasicFieldTaskDescription';
import BasicField from '../common/BasicField';
import {mobileAnalyticsClient} from '../../api/analytics-api'

class AddSubtaskForm extends React.Component{

  constructor(props, container) {
		super(props)
		this.state = {
				description: '',
        assignedTo: '',
        patient: ''
		}
	}

  handleDescriptionChange = (e) => {
    //builds the subtask in the state
    this.setState({description: e.target.value});
  }

  handlePatientChange = (e) => {
    //builds the subtask in the state
    this.setState({patient: e.target.value});
  }

  componentDidMount () {
  mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
          'PageName': 'AddSubTaskForm'
  });
}

  // addSubtask = () => {
  //   // this.props.formActions.stopSubmit('addSubtaskForm')
  //   // this.props.formActions.destroy('addSubtaskForm')
  //   var subtask = this.state
  //   //adds subtask to state in AddTask
  //   this.props.submitSubtask(this.state)
  //   //uses formActions to add a subtask to the dom (add task form)
  //   this.props.addSubtask(this.state)
  //   debugger;
  // }

  saveSubtaskValues = () => {
    debugger;
    this.props.addSubtaskValues(this.state, this.props.currentSubtaskIndex);
    this.props.formActions.destroy('addSubtaskForm')
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
          <Field onChange={(e) => this.handleDescriptionChange(e)} name='description' type='text' component={BasicFieldTaskDescription} label='Task' xlinkHref="#icon-pencil" isTaskDescription="true"/>
          <Field id="taskId" name="taskId" className="input-group-field" component="input" type="hidden"/>

          {/* Task */}
          {/* <div className="column large-12 input-group">
            <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-pencil"></use></svg></span>
            <div className="input-wrapper form-floating-label">
              <Field className="input-group-field" type="text" component="input" type="text" name="description" value={this.state.description} onChange={(e) => this.handleDescriptionChange(e)}/>
              <label>Subtask</label>
            </div>
          </div> */}

          {/* ADD PATIENT */}
          <Field onChange={(e) => this.handlePatientChange(e)} id="add-patient-subtask" name='patient' type='text' component={BasicField} label='Add Patient' xlinkHref="#icon-patient" extraClassName="add-patient"/>
          <Field id="add-patient-subtask-id" name="patientId" className="input-group-field" component="input" type="hidden"/>

          {/* ADD PATIENT */}
          {/* <div className="column large-12 input-group">
            <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-pencil"></use></svg></span>
            <div className="input-wrapper form-floating-label">
              <input id="add-patient-subtask" className="add-patient input-group-field" type="text"/>
              <label>Add Patient</label>
            </div>
          </div> */}

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
            <input onClick={this.saveSubtaskValues} type="button" className="button secondary" value="Save"/>
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
  // var initialSubtaskFormValues = {}
  // if(this.props.currentSubtasks && this.props.currentSubtaskIndex){
  //   initialSubtaskFormValues = this.props.currentSubtasks[this.props.currentSubtaskIndex]
  // }
  // return{
  //   initialValues: initialSubtaskFormValues
  // }
}

const mapDispatchToProps = function(dispatch){
  return{
    formActions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddSubtaskForm)
