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
import { Link } from 'react-router'
import BaseComponentWithFoundationUpdate from '../components/BaseComponentWithFoundationUpdate'

class TaskListView extends BaseComponentWithFoundationUpdate {

  constructor(props) {
      super(props)
  }

    componentDidMount(){
      this.props.taskListAction.loading()
      this.props.invitationAction.findPendingTaskListsForUser()
      this.props.taskListAction.getGenericListCounts()
      this.props.taskListAction.getTaskListForUser()
      // debugger;
			mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
				'PageName': 'Lists'
      })

    }

    componentDidUpdate(prevProps, prevState) {
      super.componentDidUpdate(prevProps, prevState)
      //enableFoundationComponent(".item-list-wrapper")
      enableFoundationForMultipleComponents(".item-list-wrapper", ".row")

    }

    submit = (form) => {
      this.props.taskListAction.saveTaskList(form)
      // print the form values to the console
      console.log(form)
      $('.add').click();
      // $('.add').toggleClass('close');
      // $('body').toggleClass('disable-header-scroll');
      // if($(this).hasClass('add-list')) {
      //   $('.add-list use').attr('href', function(index, attr) {
      //     return attr =='#icon-add' ? '#icon-lists' : '#icon-add';
      //   });
      // }
      // $('.add-form-wrapper').slideToggle(300);
      // $('.list-filter .controls, .list-wrapper').toggle();
    }

    addTaskList = () => {
      this.props.taskListAction.setTaskListAsCurrentList(null)
    }

    editTaskList = (taskList) => {
      console.log("editTaskList: "+taskList.taskListId)
      this.props.taskListAction.setTaskListAsCurrentList(taskList)
      //$('.add').click();
      // $('.add').toggleClass('close');
      // $('body').toggleClass('disable-header-scroll');
      // if($(this).hasClass('add-list')) {
      //   $('.add-list use').attr('href', function(index, attr) {
      //     return attr =='#icon-add' ? '#icon-lists' : '#icon-add';
      //   });
      // }
      // $('.add-form-wrapper').slideToggle(300);
      // $('.list-filter .controls, .list-wrapper').toggle();
      toggleTaskForm()
    }

    deleteList = (taskListId) => {
      this.props.taskListAction.deleteTaskListById(taskListId)
    }

    leaveList = (taskListId) => {
      this.props.taskListAction.leaveList(taskListId)
    }

    acceptInviteToTaskList = (taskList) => {
      this.props.invitationAction.acceptInviteToTaskList(taskList)
    }

    rejectInviteToTaskList = (taskList) => {
      this.props.invitationAction.rejectInviteToTaskList(taskList)
    }

    refresh = () => {
      this.props.taskListAction.loading()
      this.props.taskListAction.getTaskListForUser()
    }

    render() {
      // const taskLists = this.props.taskLists;
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

        			<div className="wrapper list-filter row collapse align-middle align-right">
        				<div className="columns controls">
        					{/* {{> search}} */}
        				</div>
                <div className="columns shrink icon-group controls">
                  <span onClick={(e) => this.refresh()}><svg className="icon refresh"><use xlinkHref="#icon-activity"></use></svg></span>
                </div>
        				<div className="columns shrink">
        					<svg id="icon-lists" className="add add-other icon" onClick={this.addTaskList}><use xlinkHref="#icon-lists"></use></svg>
        				</div>

        			</div>{/* <!--list-filter--> */}
        			</header>{/* <!--slideUp--> */}

              <AddListForm onSubmit={this.submit}/>

        			<div className="list-wrapper">
                {this.props.isFetching ?
                  <div className="sk-circle">
                    <div className="sk-circle1 sk-child"></div>
                    <div className="sk-circle2 sk-child"></div>
                    <div className="sk-circle3 sk-child"></div>
                    <div className="sk-circle4 sk-child"></div>
                    <div className="sk-circle5 sk-child"></div>
                    <div className="sk-circle6 sk-child"></div>
                    <div className="sk-circle7 sk-child"></div>
                    <div className="sk-circle8 sk-child"></div>
                    <div className="sk-circle9 sk-child"></div>
                    <div className="sk-circle10 sk-child"></div>
                    <div className="sk-circle11 sk-child"></div>
                    <div className="sk-circle12 sk-child"></div>
                  </div>:
          				<div className="item-list-wrapper">

                    <PendingListsComponent taskLists={this.props.pendingTaskLists} acceptInviteToTaskList={this.acceptInviteToTaskList} rejectInviteToTaskList={this.rejectInviteToTaskList}/>
                    {/* {this.props.genericLists && this.props.genericLists.map(list => {
                      return(
                        <div key={list.listName} className="item row expanded align-middle">
                          <div className="columns shrink">
                            <span className="circle xxsmall transparent"></span>
                          </div>
                          <div className="columns">
                            <Link to={"/tasks/"+list.listName}><h6 className="">{list.listName}</h6></Link>
                          </div>
                          <div className="columns shrink">
                            <h6 className="">{list.numberOfTasks}</h6>
                          </div>
                        </div>
                      )
                    })} */}
                    <ListsComponent taskLists={this.props.taskLists} editForm={this.editTaskList} deleteList={this.deleteList} leaveList={this.leaveList}/>

          				</div>
                }
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
    pendingTaskLists: state.invitationState.pendingTasklists,
    genericLists: state.taskListState.genericLists,
    isFetching: state.taskListState.isFetching
  }
}

function mapDispatchToProps(dispatch){
  return {
    taskListAction: bindActionCreators(TaskListActions, dispatch),
    invitationAction: bindActionCreators(InvitationActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskListView);
