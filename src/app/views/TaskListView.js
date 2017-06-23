import React from 'react';
import { connect } from 'react-redux'
import Header from '../components/common/Header'
import {bindActionCreators} from 'redux';
import * as TaskListActions from '../actions/tasklist-actions'
import AddTaskForm from '../components/list/AddListForm'
import ListsComponent from '../components/list/ListsComponent'
import PendingListsComponent from '../components/list/PendingListsComponent'

class TaskListView extends React.Component {

    componentDidMount(){
      this.props.taskListAction.getTaskListForUser()
      this.props.taskListAction.findPendingTaskListsForUser()
    }
    render() {
      return (

        <div className="off-canvas-content" data-off-canvas-content>
        	<div className="row expanded collapse">
        		<div className="large-12 columns">

        			<header className="nav-down">
        			<div className="top-bar">
        				<div className="top-bar-left">
        					<button className="menu-icon hide-for-medium" type="button" data-toggle="sidebar"></button>
        					<h3>Lists</h3>
        				</div>
        			</div>

        			<div className="wrapper list-filter row expanded collapse align-middle align-right">
        				<div className="columns controls">
        					{/* {{> search}} */}
        				</div>
        				<div className="columns shrink">
        					<svg id="icon-lists" className="add add-other icon"><use xlinkHref="#icon-lists"></use></svg>
        				</div>

        			</div>{/* <!--list-filter--> */}
        			</header>{/* <!--slideUp--> */}

              <AddTaskForm/>

        			<div className="list-wrapper">
        				<div className="item-list-wrapper">

                  <PendingListsComponent taskLists={this.props.pendingTaskLists}/>
                  <ListsComponent taskLists={this.props.taskLists}/>

                  {/* {this.props.pendingTaskLists.map(taskList => {
                    return(<PendingListsComponent taskList={taskList}/>)
                  })} */}

                  {/* {this.props.taskLists.map(taskList => {
                    return(<ListsComponent taskList={taskList}/>)
                  })} */}

                  {/* Inbox */}
        					<div className="item row expanded align-middle">
        						<div className="columns shrink">
        							<span className="circle xxsmall transparent"></span>
        						</div>
        						<div className="columns">
        							<h6 className="">Inbox</h6>
        						</div>
        						<div className="columns shrink">
        							<h6 className="">4</h6>
        						</div>
        					</div>
                  {/* Inbox End */}

                  {/* Important */}
        					<div className="item row expanded align-middle">
        						<div className="columns shrink">
        							<span className="circle xxsmall transparent"></span>
        						</div>
        						<div className="columns">
        							<h6>Important</h6>
        						</div>
        						<div className="columns shrink">
        							<h6 className="">0</h6>
        						</div>
        					</div>
                  {/* Important End */}

                  {/* Assigned to me */}
        					<div className="item row expanded align-middle">
        						<div className="columns shrink">
        							<span className="circle xxsmall transparent"></span>
        						</div>
        						<div className="columns">
        							<h6 className="">Assigned to me</h6>
        						</div>
        						<div className="columns shrink">
        							<h6 className="">26</h6>
        						</div>
        					</div>
                  {/* Assigned to me End*/}

                  {/* Assigned by me */}
        					<div className="item row expanded align-middle">
        						<div className="columns shrink">
        							<span className="circle xxsmall transparent"></span>
        						</div>
        						<div className="columns">
        							<h6>Assigned by me</h6>
        						</div>
        						<div className="columns shrink">
        							<h6 className="">0</h6>
        						</div>
        					</div>
                  {/* Assigned by me End */}

        				</div>{/* <!--item-list-wrapper--> */}
        			</div>{/* <!--list-wrapper--> */}
        		</div>
        	</div>
        </div>

      );
  }
}

function mapStateToProps(state){
  return{
    taskLists: state.taskListState.tasklist,
    pendingTaskLists: state.taskListState.pendingTasklists
  }
}

function mapDispatchToProps(dispatch){
  return {
    taskListAction: bindActionCreators(TaskListActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskListView);
