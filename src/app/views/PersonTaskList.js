import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import PersonTaskListContainer from '../components/list/PersonTaskListContainer'
import {mobileAnalyticsClient} from '../api/analytics-api'
import BaseComponentWithFoundationUpdate from '../components/BaseComponentWithFoundationUpdate'
import AddTask from '../components/task/AddTask'
import * as TaskActions from '../actions/task-actions'
import $ from 'jquery'

class PersonTaskList extends BaseComponentWithFoundationUpdate {
    constructor(props){
      super(props)
      this.state = {
        searchTerm: ''
      }
    }

    componentDidMount(){
			mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
							'PageName': 'PersonTaskList'
      });
      var personId = this.props.routeParams.personId;
      //var memberName = this.props.routeParams.memberName;
      this.props.taskActions.getTasksAssignedToSpecificUser(personId, undefined, undefined, undefined, "INCOMPLETE")
    }
    
    handleKeyPress = (event) => {
      if(event.key == 'Enter'){
        console.log('enter press here! ')
        this.props.taskActions.searchTasks(this.state.searchTerm);
      }
    }
    
    handleAddTask = () => {
      this.props.taskActions.taskToState(null)
      openAddForm();
    };
    
    toggleSlimView = () => {
      $(this).toggleClass('active');
      $('.task-item-wrapper').toggleClass('slim');
      $('.task-item .row, .task-item, .main-task-item').toggleClass('align-middle');
    }

    render() {
      return (
        <div className="off-canvas-content" data-off-canvas-content>
          <div className="row expanded collapse">
            <div className="large-12 columns">
              <div className="top-bar">
                <div className="top-bar-left">
                  <button className="menu-icon hide-for-medium" type="button" data-toggle="sidebar"></button>
                  <h3>Tasks Assigned To {this.props.routeParams.memberName}</h3>
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

            <div className={"wrapper list-filter row collapse align-middle align-right "}>
              {/* <div className="columns controls">
                <div className="input-group searchbar">
                  <input className="input-field search-field" type="search" placeholder="Search tasks" onChange={this.props.searchUpdated} value={this.props.searchTerm}/>
                  <div className="input-group-button">
                    <button className="button">
                      <svg onClick={this.props.clearSearch} className="icon"><use xlinkHref="#icon-search"></use></svg>
                    </button>
                  </div>
                </div>
              </div> */}

              <div className="columns shrink icon-group controls">
                
                <span title="Slim view toggle" onClick={(e) => this.toggleSlimView()}><svg className="icon toggle-slim"><use xlinkHref="#icon-slim"></use></svg></span>
                
              </div>
            </div>

            <div className="row expanded collapse">
              <PersonTaskListContainer/>
            </div>
          </div>
        </div>
      );
  }
}

function mapStateToProps(state){
  return{
  }
}

function mapDispatchToProps(dispatch){
  return {
    taskActions: bindActionCreators(TaskActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonTaskList);