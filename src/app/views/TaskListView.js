import React from 'react';
import { connect } from 'react-redux'
import Header from '../components/common/Header'
import {bindActionCreators} from 'redux';
import * as TaskListActions from '../actions/tasklist-actions'
import * as InvitationActions from '../actions/invitation-actions'
import AddListForm from '../components/list/AddListForm'
import ListsComponent from '../components/list/ListsComponent'
import PendingListsComponent from '../components/list/PendingListsComponent'
import {mobileAnalyticsClient} from '../api/analytics-api'

class TaskListView extends React.Component {

    componentDidMount(){
      // this.props.taskListAction.getTaskListForUser()
      this.props.taskListAction.findPendingTaskListsForUser()

			mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
							'PageName': 'Lists'
			});
    }

    submit = (form) => {
      this.props.taskListAction.addTaskList(form)
      // print the form values to the console
      console.log(form)
      $('.add').toggleClass('close');
      $('body').toggleClass('disable-header-scroll');
      if($(this).hasClass('add-list')) {
        $('.add-list use').attr('href', function(index, attr) {
          return attr =='#icon-add' ? '#icon-lists' : '#icon-add';
        });
      }
      $('.add-form-wrapper').slideToggle(300);
      $('.list-filter .controls, .list-wrapper').toggle();
    }

    editTaskList = (taskList) => {
      this.props.taskListAction.setTaskListAsTasklistone(taskList)
      $('.add').toggleClass('close');
      $('body').toggleClass('disable-header-scroll');
      if($(this).hasClass('add-list')) {
        $('.add-list use').attr('href', function(index, attr) {
          return attr =='#icon-add' ? '#icon-lists' : '#icon-add';
        });
      }
      $('.add-form-wrapper').slideToggle(300);
      $('.list-filter .controls, .list-wrapper').toggle();
    }

    deleteList = (taskListId) => {
      this.props.taskListAction.deleteTaskListById(taskListId)
    }

    leaveList = (taskListId) => {
      this.props.taskListAction.leaveList(taskListId)
    }

    acceptInviteToTaskList = (taskListId) => {
      this.props.invitationAction.acceptInviteToTaskList(taskListId)
    }

    rejectInviteToTaskList = (taskListId) => {
      this.props.invitationAction.rejectInviteToTaskList(taskListId)
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

              <AddListForm onSubmit={this.submit}/>

        			<div className="list-wrapper">
        				<div className="item-list-wrapper">

                  <PendingListsComponent taskLists={this.props.pendingTaskLists} acceptInviteToTaskList={this.acceptInviteToTaskList} rejectInviteToTaskList={this.rejectInviteToTaskList}/>
                  <ListsComponent taskLists={this.props.taskLists} editForm={this.editTaskList} deleteList={this.deleteList} leaveList={this.leaveList}/>

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
    taskListAction: bindActionCreators(TaskListActions, dispatch),
    invitationAction: bindActionCreators(InvitationActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskListView);
