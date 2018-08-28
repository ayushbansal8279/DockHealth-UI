import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import TaskListSearchContainer from '../components/list/TaskListSearchContainer'
import {mobileAnalyticsClient} from '../api/analytics-api'
import BaseComponentWithFoundationUpdate from '../components/BaseComponentWithFoundationUpdate'
import AddTask from '../components/task/AddTask'
import SortFilterTasks from '../components/common/SortFilterTasks'
import * as TaskActions from '../actions/task-actions'
import $ from 'jquery'

class TaskListSearch extends BaseComponentWithFoundationUpdate {
    constructor(props){
      super(props)
      this.state = {
        searchTerm: '',
        searchPerformed: false
      }
    }

    componentDidMount(){
			mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
							'PageName': 'TaskListSearch'
      });
    }

    searchUpdated = (term) => {
      this.setState({searchTerm: term.target.value})
    }

    searchTasks = () => {
      this.props.taskActions.searchTasks(this.state.searchTerm, undefined, undefined, "INCOMPLETE");
      this.setState({searchPerformed: true})
    }

    getCompletedTasks = () => {
      this.props.taskActions.searchTasks(this.state.searchTerm, undefined, undefined, "COMPLETE");
      this.setState({searchPerformed: true})
    }
    
    getListTasks = (sortBy, filterBy) => {
      this.props.taskActions.loading()
      this.props.taskActions.searchTasks(this.state.searchTerm, sortBy, filterBy, "INCOMPLETE")
    }

    handleKeyPress = (event) => {
      if(event.key == 'Enter'){
        console.log('enter press here! ')
        this.props.taskActions.searchTasks(this.state.searchTerm, undefined, undefined, "INCOMPLETE");
        this.setState({searchPerformed: true})
      }
    }
    
    handleAddTask = () => {
      this.props.taskActions.taskToState(null)
      openAddForm();
    };

    render() {
      return (
        <div className="off-canvas-content" data-off-canvas-content>
          <div className="row expanded collapse">
            <div className="large-12 columns">
              <div className="top-bar">
                <div className="top-bar-left">
                  <button className="menu-icon hide-for-medium" type="button" data-toggle="sidebar"></button>
                  <h3>Search</h3>
                </div>
              </div>
            </div>
          </div>
          <div className="row expanded collapse">
            <div className="large-12 columns">
							  <div className={"wrapper list-filter row collapse align-middle align-right "}>
                  {/* <div className="columns shrink" onClick={(e) => this.handleAddTask()}>
                    <svg className="add icon"><use xlinkHref="#icon-add"></use></svg>
                  </div> */}
                </div>
            </div>
          </div>

                <AddTask
                  taskListId={this.props.taskListId}
                  addTask={this.props.taskActions.addTask}
                  taskLists={this.props.taskList}
                  patients={this.props.patients}
                  title={this.props.title}
                  members={this.props.members}
                  activeListMembers={this.props.activeListMembers}
                />

          <div className="wrapper">
            <div className="row expanded collapse">
              <div className="large-2 columns">
              </div>
              <div className="large-8 columns">
                <div className="input-group searchbar">
                  <input className="input-field search-field expand-search" id="task-search-field" type="search" placeholder="Search tasks" 
                    onKeyPress={this.handleKeyPress} onChange={this.searchUpdated} value={this.state.searchTerm}/>
                  <div className="input-group-button">
                    <button className="button">
                      <svg onClick={this.searchTasks} id="task-search-button" className="icon"><use xlinkHref="#icon-search"></use></svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="large-2 columns">
              </div>
            </div>

            {/* {this.state.searchPerformed &&  */}
              <SortFilterTasks title="Search Tasks" getListTasks={this.getListTasks}/>
            {/* } */}

            <TaskListSearchContainer 
              searchPerformed={this.state.searchPerformed}
              getCompletedTasks={this.getCompletedTasks}/>
            
            {this.state.searchPerformed && this.props.tasks && this.props.tasks.length == 0 &&
              <span className="taskListSearchMessage">No tasks found matching search criteria</span>
            }
          </div>
        </div>
      );
  }
}

function mapStateToProps(state){
  return{
    tasks: state.taskState.tasks
  }
}

function mapDispatchToProps(dispatch){
  return {
    taskActions: bindActionCreators(TaskActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskListSearch);