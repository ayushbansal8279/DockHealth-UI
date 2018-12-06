import React, { Component} from 'react'
import Moment from 'react-moment'
import BaseComponent from '../BaseComponent'
import * as TaskListActions from '../../actions/tasklist-actions'
import * as TaskActions from '../../actions/task-actions'
import MemberInitials from '../common/MemberInitials'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import $ from 'jquery'
import ListOfTasksContainer from '../task/ListOfTasksContainer'

class TaskListSearchContainer extends BaseComponent {

	constructor(props) {
	  	super(props)
	  	this.handleClick = this.handleClick.bind(this)
  }
  componentDidMount () {
      super.componentDidMount()
      this.closeAuditHistory();
  }

  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState)
    enableFoundationAccordionComponent(".wrapper")
    
    resizeEmailBodySection(".task-item-wrapper")
  }

  pullCompletedTasks = () => {
    if(!this.props.showingCompletedTasks){
      this.props.getCompletedTasks();
    }else{
      this.props.taskActions.hideCompletedTasks()
    }
  }

  handleClick = (e, taskListId) => {
    e.preventDefault();
		// toggleDropDown('activityList' + taskListId)
    //not working
    //$("#activityList").foundation('toggle', $(e.target));
    console.log('The accordion link was clicked.');
  };

  setTaskEditingStatus = (isEditing) => {
    // alert("working")
    this.setState({editing: isEditing})
  }

  closeAuditHistory = () => {
    this.props.taskActions.storeAsCurrentTask(null)
    //.then((resp) => {
      this.props.taskActions.clearCurrentTaskHistory()
    //})
  }

  renderAuditHistory() {
    return this.props.currentTaskHistory.map((audit) =>{
      return(
        <div className="task-item row expanded condense align-middle" key={"audit" + audit.auditId}>
          <div className="columns shrink">
            {/* <MemberInitials /> */}
            {/* <img className="member-photo circle" src="assets/img/user1.png" alt="name of user"/> */}
            <MemberInitials member={audit.user}/>
          </div>
          <div className="columns">
            <span className="task-title">{audit.user!=null?audit.user.userName:""}</span>
          </div>
          <div className="columns">
            <span className="task-title">{audit.taskHistoryDetails}</span>
          </div>
          <div className="columns text-right">
            <span className="item-details"><Moment format="MM/DD/YYYY">{audit.createdDateTime}</Moment></span>
            <span className="item-details"><Moment format="hh:mm a">{audit.createdDateTime}</Moment></span>
          </div>
        </div>
      );
    })
  }
		// Lists Activity for a TaskList
    renderList(taskListId, taskStatus, tasks, members) {
          return(
            <div className="list-wrapper list-wrapper-task-search">
              <div className="task-item-wrapper">
                <ListOfTasksContainer
                  taskListId={taskListId} status={taskStatus}
                  members={members}
                  filteredTasks={tasks}
                  setTaskEditingStatus={this.setTaskEditingStatus}
                  listName=""
                />
              </div>
            </div>
          );
    }

		// Lists TaskLists
    renderTaskListName(taskStatus, searchedTasks){
      const groupedTasks = this.groupBy(searchedTasks, task => task.taskList.listName);
      if(!groupedTasks || groupedTasks.size == 0){
        return <li/>
      }
      return Array.from(groupedTasks.keys()).map((listName) =>{
        const tasks = groupedTasks.get(listName)
        var taskListId = 0
        if(tasks){
          taskListId = tasks[0].taskList.taskListId
        }
        return(
          <li className="accordion-item" key={"taskList_" + listName}>
            <span className={this.props.currentTaskHistory?"accordion-title task-search-list-name":"accordion-title task-search-list-name large-8 large-offset-2"}>
              <b>{listName}</b>
            </span>  
            <div>
              {tasks && tasks.length > 0 ? 
                this.renderList(taskListId, taskStatus, tasks, null) : 
                <p className="light-gray">No matching tasks</p>}
            </div>
          </li>
        );
      })
    }

    render (){
      return (
        <div className="tasks-container">
        <div className={this.props.currentTaskHistory?"large-8 columns left-column":"large-12 columns left-column"}>
          <div className="row expanded collapse">
            <ul className="columns large-12 accordion task-search-results-container" data-accordion data-allow-all-closed="true">
              {this.props.searchPerformed && this.props.tasks && this.renderTaskListName("INCOMPLETE", this.props.tasks)}
            </ul>
            <div className="columns large-12">
              {this.props.searchPerformed && 
                <div className="show-completed text-center">
                  <a className="toggle-completed button primary small" onClick={(e) => this.pullCompletedTasks()}>Show completed tasks</a>
                </div>
              }
            </div>
            {this.props.showingCompletedTasks && this.props.completedTasks && this.props.completedTasks.length > 0 &&
            <ul className="columns large-12 accordion task-search-results-container" data-accordion data-allow-all-closed="true">
              {this.props.searchPerformed && this.props.completedTasks && this.renderTaskListName("COMPLETE", this.props.completedTasks)}
            </ul>
            }
            {this.props.showingCompletedTasks && this.props.completedTasks && this.props.completedTasks.length == 0 &&
              <span>No completed tasks</span>
            }
          </div>
        </div>
        <div className="right-column">
        {this.props.currentTaskHistory &&
          <div className="task-item-wrapper">
            <div className="task-item">
              <div className="row expanded">
                <div className="columns">
                  <div className="row">
                    <div className="columns more-options-wrapper">
                      <span><strong>Audit History</strong></span>
                    </div>
                    <div className="columns shrink more-options-wrapper">
                      <svg className="icon medium" onClick={(e) => this.closeAuditHistory()}><use xlinkHref="#icon-close"></use></svg>
                    </div>
                  </div>
                  {this.props.selectedTask && 
                  <div className="row">
                    <div className="columns more-options-wrapper">
                      <span>{this.props.selectedTask.description}</span>
                    </div>
                  </div>
                  }
                  {this.props.currentTaskHistory && this.renderAuditHistory()}
                </div>
              </div>  
            </div>
          </div>
        }
        </div>
        </div>
      )
    }

    groupBy(list, keyGetter) {
      const map = new Map();
      list.forEach((item) => {
          const key = keyGetter(item);
          const collection = map.get(key);
          if (!collection) {
              map.set(key, [item]);
          } else {
              collection.push(item);
          }
      });
      return map;
    }
}

function mapStateToProps(state) {
  //console.log(state);
  return {
    //taskSearchResults: state.taskState.taskSearchResults
    tasks: state.taskState.tasks,
    completedTasks: state.taskState.completedTasks,
    isFetching: state.taskState.isFetching,
    isCompletedTasksFetching: state.taskState.isCompletedTasksFetching,
    showingCompletedTasks: state.taskState.showingCompletedTasks,
    selectedTask: state.taskState.selectedTask,
    currentTaskHistory: state.taskState.currentTaskHistory
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(TaskListActions, dispatch),
    taskActions: bindActionCreators(TaskActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskListSearchContainer);
