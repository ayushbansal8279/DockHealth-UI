import React from 'react'
import { Field, reduxForm, formValueSelector, actions, stopSubmit, destroy, reset, change } from 'redux-form'
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
        priority: undefined,
        subtask: undefined
		}
    this.baseState = this.state
	}

  handleDescriptionChange = (e) => {
    //builds the subtask in the state
    this.setState({description: e.target.value});
    return false;
  }

  handlePatientChange = (e) => {
    //builds the subtask in the state
    this.setState({patient: e.target.value});
  }

  componentDidMount () {
    mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
            'PageName': 'AddSubTask'
    });
  }

  componentWillUpdate(nextProps){
    if(this.props.currentSubtask && this.props.currentSubtask != this.state.subtask){
      this.setState({subtask:this.props.currentSubtask})
      this.setState({priority:this.props.currentSubtask.priority})
    }
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

  onSubmit = (formProps) => {
    //debugger;
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

  changeTaskPriority = () => {
    var priority = !this.state.priority
    this.setState({priority:priority})
    this.props.formActions.change("addSubtaskForm", "priority", priority)
  }


  render(){
    const renderDescriptionField = ({ input, label, type, meta: { touched, error, warning } }) => (
      <div className={"input-group-wrapper column large-12 " + (touched && error ? 'has-error' : ' ')}>
        <h5>{touched ? "touched" : "untouched"}</h5>
        <div className="input-group icon-right icon-left">
          <span className="input-group-label"><svg className="icon"><use xlinkHref="#icon-pencil"></use></svg></span>
          <div className={"input-wrapper form-floating-label " + (input.value && "has-value")}>
            <input {...input} className="input-group-field " type="text"/>
            <label>Task</label>
          </div>
          <span onClick={() => this.changeTaskPriority()} className="input-group-label"><svg className={"icon flag medium " + (this.state.priority ? "" : "no-flag")}><use xlinkHref="#icon-flag"></use></svg></span>
        </div>
        {touched && error &&
          <span className="form-error">
            {error}
          </span>
        }
      </div>
    )
    return(
      <form onSubmit={this.props.handleSubmit(this.onSubmit.bind(this))}>
        {/* Added 'inline-label' to fix broken ui */}
        <div className="subtask-wrapper inline-label">
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
          <Field id="description-subtask" onChange={(e) => this.handleDescriptionChange(e)} name='description' type='text' component={BasicFieldTaskDescription} label='Task' xlinkHref="#icon-pencil" isTaskDescription="true" callback={this.changeTaskPriority} priority={this.state.priority}/>
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

          {/* <div className="column top-buffer large-12">
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
          </div> */}

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
            <input type="submit" className="button secondary" value="Add Subtask"/>
          </div>
        </div>
      </form>
    )
  }
}

function validate(values){
  const errors = {};
  if(!values.description){
    errors.description = 'Please enter a subtask description';
  }
  // if(!values.patient){
  //   errors.patient = 'Please select a patient';
  // }
  return errors;
}

AddSubtaskForm = reduxForm({
  // a unique name for the form
  form: 'addSubtaskForm',
  enableReinitialize : true,
  validate
})(AddSubtaskForm)

// const selector = formValueSelector('addTaskForm')

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
    formActions: bindActionCreators({destroy, reset, change}, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddSubtaskForm)
