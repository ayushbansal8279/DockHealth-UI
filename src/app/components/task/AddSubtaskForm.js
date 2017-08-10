import React from 'react'
import { Field, reduxForm, formValueSelector, actions, stopSubmit } from 'redux-form'
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import BasicFieldTaskDescription from '../common/BasicFieldTaskDescription';
import BasicField from '../common/BasicField';
import {mobileAnalyticsClient} from '../../api/analytics-api'
import BaseComponent from '../BaseComponent'
import $ from 'jquery'

class AddSubtaskForm extends BaseComponent{

  constructor(props, container) {
		super(props)
		this.state = {
				description: '',
        assignedTo: '',
        patient: '',
        patientId: '',
        assignedTo: '',
        assignedToId: '',
        priority: 'false'
		}
    this.baseState = this.state
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
    $('.subtask-wrapper').slideToggle(300);
    $('.main-task-wrapper').slideToggle(300);
    console.log(this.state)
    // var patientId = $('#add-patient-subtask-id').val()
    // this.setState({patientId:patientId})
    var subtask = this.state
    subtask.description = $('#description-subtask').val()
    subtask.patientId = $('#add-patient-subtask-id').val()
    subtask.patient = $('#add-patient-subtask').val()
    subtask.assignedToId = $('#assign-subtask-to-id').val()
    subtask.assignedTo = $('#assign-subtask-to').val()
    if(subtask.priority == true){
      subtask.priority = "HIGH"
    }else{
      subtask.priority = "LOW"
    }
    this.props.addSubtaskValues(subtask, this.props.currentSubtaskIndex)
    this.props.formActions.destroy('addSubtaskForm')
    this.props.formActions.reset('addSubtaskForm')
    this.setState(this.baseState)
  }

  showState = () =>{
    console.log(this.state)
  }


  render(){
    return(
      <form>
        <div className="subtask-wrapper">
          <div className="row expanded">
            <div className="column small-4 toggle-add-subtask">
              <svg onClick={(e) => this.showState()} className="icon"><use xlinkHref="#icon-arrow-left"></use></svg>
            </div>
            <div className="column small-4 text-center">
              <h5 className="section-title">Add a subtask</h5>
            </div>
          </div>

          {/* Main task title */}
          <div className="column large-12 input-group has-value">
            <span className="task-title">{"Task: " + (this.props.currentTask && this.props.currentTask.description)}</span>
          </div>

          {/* Task */}
          <Field id="description-subtask" onChange={(e) => this.handleDescriptionChange(e)} name='description' type='text' component={BasicField} label='Task' xlinkHref="#icon-pencil" isTaskDescription="true"/>
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
          <Field onChange={(e) => this.handlePatientChange(e)} id="add-patient-subtask" name='patient' type='text' component={BasicField} label='Add Patient' xlinkHref="#icon-patient" extraClassName="add-patient-subtask"/>
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
          {/* Hide 'assignedTo' if user is adding a task to the 'inbox'. Tasks can only be assigned from lists */}
          {this.props.title != "Inbox" || this.props.taskListSelection ?
            <span>
              <Field id="assign-subtask-to" name='assignedTo' type='text' component={BasicField} label='Assigned to' xlinkHref="#icon-assign-to" extraClassName="assign-subtask-to"/>
              <Field id="assign-subtask-to-id" name="assignedToId" className="input-group-field" component="input" type="hidden"/>
            </span>
            :
            <span></span>
          }

          <div className="column top-buffer large-12">
            <div className="row">
              <div className="column">
                <span className="item-title">High Priority</span>
                <p className="text-light">Toggle task priority to high or low</p>
              </div>
              <div className="column shrink">
                <div className="switch">
                  <Field className="switch-input" id="subtaskSwitch" type="checkbox" name="priority" component="input"/>
                  <label className="switch-paddle" htmlFor="subtaskSwitch">
                    <span className="show-for-sr">Download Kittens</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* ASSIGNED TO */}
          {/* <div className="column large-12 input-group">
            <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-assign-to"></use></svg></span>
            <div className="input-wrapper form-floating-label">
              <input id="assign-subtask-to" className="assign-to input-group-field" type="text"/>
              <label>Assigned to</label>
            </div>
          </div> */}

          {/* SAVE */}
          <div className="column large-12 text-right">
            <input className="toggle-add-subtask" onClick={this.saveSubtaskValues} type="button" className="button secondary" value="Save"/>
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

const selector = formValueSelector('addTaskForm')

const mapStateToProps = function(store){
  // var initialSubtaskFormValues = {}
  // if(this.props.currentSubtasks && this.props.currentSubtaskIndex){
  //   initialSubtaskFormValues = this.props.currentSubtasks[this.props.currentSubtaskIndex]
  // }
  return{
  //   initialValues: initialSubtaskFormValues
  }
}

const mapDispatchToProps = function(dispatch){
  return{
    formActions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddSubtaskForm)
