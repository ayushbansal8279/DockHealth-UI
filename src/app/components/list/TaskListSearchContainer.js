import React, { Component} from 'react'
import Moment from 'react-moment'
import BaseComponent from '../BaseComponent'
import * as TaskListActions from '../../actions/tasklist-actions'
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
  }

  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState)
    enableFoundationAccordionComponent(".wrapper")
    
    resizeEmailBodySection(".task-item-wrapper")
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

		// Lists Activity for a TaskList
    renderList(tasks, members) {
          return(
            <div className="list-wrapper list-wrapper-task-search">
              <div className="task-item-wrapper">
                <ListOfTasksContainer
                  taskListId="0" status="INCOMPLETE"
                  members={members}
                  filteredTasks={tasks}
                  setTaskEditingStatus={this.setTaskEditingStatus}
                />
              </div>
            </div>
          );
    }

		// Lists TaskLists
    renderTaskListName(){
      const groupedTasks = this.groupBy(this.props.tasks, task => task.taskList.listName);
      if(!groupedTasks || groupedTasks.size == 0){
        return <li/>
      }
      return Array.from(groupedTasks.keys()).map((listName) =>{
        const tasks = groupedTasks.get(listName)
        return(
          <li className="accordion-item" data-accordion-item key={"taskList_" + listName}>
            <span className="accordion-title task-search-list-name">
              <b>{listName}</b>
            </span>  
            <div>
              {tasks && tasks.length > 0 ? 
                this.renderList(tasks, null) : 
                <p className="light-gray">No matching tasks</p>}
            </div>
          </li>
        );
      })
    }

    render (){
      return (
        <ul className="columns large-12 accordion task-search-results-container" data-accordion data-allow-all-closed="true">
          {this.props.tasks && this.renderTaskListName()}
        </ul>
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
  };
}

function mapDispatchToProps(dispatch) {
  return  bindActionCreators(TaskListActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskListSearchContainer);
