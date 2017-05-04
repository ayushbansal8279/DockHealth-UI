import React, { Component ,PropTypes} from 'react';
import {reduxForm, Field} from 'redux-form';
import {addTaskList} from '../../actions/tasklist-actions';
import {connect} from 'react-redux'
import BasicField from '../common/BasicField';
import { Link,hashHistory } from 'react-router';

class TaskListAdd extends Component {

  constructor(props) {
    	super(props)
    	this.state = {
      		addtasklisterror: ''
    	};
  	}

  onSubmit (formProps) {
    //console.log(formProps);
    this.props.addTaskList(formProps,'1')
    .then((res)=>{
      //this.props.resetForm;//reduxforms injected fucntion
      hashHistory.push('/taskList')
    })
    .catch((error)=>{
      this.setState({addtasklisterror: error.message}); //this will cause render to be called
    })

  }

  //{...tasklistname} destructures the objects into key and values
  //and passes properties (like onchange, onBlur etc) into  <input> object title
  render (){
    const handleSubmit = this.props.handleSubmit; //injected by reduxform

      return(
        <form onSubmit = {handleSubmit(this.onSubmit.bind(this))}>

          <div className="row">
            <div className="small-12 columns">
            <h3>{this.state.addtasklisterror}</h3>
            </div>
          </div>

          <div className="row">
            <div className="small-12 columns">
            <h3>Create a Task List</h3>
            </div>
          </div>
          <div className="row">
            <div className="small-4 columns">
                <Field name="tasklistname" type="text" component={BasicField} label='Task List Name' placeholder='Please enter the name of task list'/>
            </div>
          </div>

          <div className="row">
              <div className="small-12 columns button-group">
                  <button className="button primary float-left button-small">Save</button>
                <Link to="/taskList"><button className="button secondary button-small float-left">Cancel</button></Link>
              </div>
          </div>

        </form>

      );
    }
}

//this is automatically called as mentioned in last line reduxForm
function validate(values){
  const errors = {};

  if(!values.tasklistname){
    errors.tasklistname = 'Please enter a name for task list';
  }
  return errors;
}

// function mapStateToProps(state) { add this to connect if used AND <h3>{this.props.addtasklisterror}</h3>
//   return {
//     addtasklisterror: state.taskListState.addtasklisterror
//   };
// }

//this is almost similar to connect function from react-redux
//redux-form is injecting some helpers (like handleSubmit) that will be available to us on this.props
//this tells redux form about the fields that are contained within the form
//connect: 1st argument is mapStateToProps, 2nd is mapDispatchToProps
//redux form : 1st is form config, 2nd argument is mapStateToProps, 3rd is mapDispatchToProps

//redux form Version 6 specifically needs an call to connect
export default connect(null, {addTaskList})(reduxForm({
    form: 'TaskListAddForm',
    //fields:['tasklistname'],
    validate
})(TaskListAdd));
