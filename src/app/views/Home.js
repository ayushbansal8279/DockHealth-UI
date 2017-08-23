import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import ListOfTasksContainer from '../components/task/ListOfTasksContainer'
import TaskFiltersContainer from '../components/task/TaskFiltersContainer'
import TaskListPatients from '../components/task/TaskListPatients'
import TaskListUsers from '../components/task/TaskListUsers'
import Notification from '../components/common/Notification'
import HeaderTasks from '../components/common/HeaderTasks'
import * as TaskActions from '../actions/task-actions'
import * as TaskListActions from '../actions/tasklist-actions'
import * as PatientActions from '../actions/patient-actions'
import BaseComponent from '../components/BaseComponent'
import $ from 'jquery'
import {mobileAnalyticsClient} from '../api/analytics-api'
import SearchInput, {createFilter} from 'react-search-input'
import Mousetrap from 'react-mousetrap';

class Home extends BaseComponent {

  constructor(props){
    super(props)
    this.state = {
      title: '',
      searchTerm: ''
    }
    this.changeTitle = this.changeTitle.bind(this)
  }



  changeTitle(newTitle){
    // alert("working")
    this.setState({title: newTitle})
  }

  clearSearch = () => {
    this.setState({searchTerm: ''});
    toggleSearch();
    // $(".search-field").toggleClass("expand-search");
		// $(".search-field").focus();
		// $(this).find('use').attr('href', function (index, attr) {
		// 	return attr == '#icon-close' ? '#icon-search' : '#icon-close';
		// });
  }

  searchUpdated = (term) => {
    this.setState({searchTerm: term.target.value})
  }

  componentDidUpdate () {
    super.componentDidUpdate()
  }

  componentWillMount(){
    // console.log("home willMount")
  }

  componentDidMount(){
    // Mousetrap.bind('ctrl+t', toggleTaskForm());
    var listName = this.props.routeParams.listName
    this.props.actions.loading()
    if(!listName || listName == "Inbox"){
      this.props.actions.getInboxTasks("COMPLETE")
      this.props.actions.getInboxTasks("INCOMPLETE")
    }else if(listName == "Assigned by me"){
      this.props.actions.getTasksAssignedByMe(undefined, undefined, "COMPLETE")
      this.props.actions.getTasksAssignedByMe(undefined, undefined, "INCOMPLETE")
    }else if(listName == "Assigned to me"){
      this.props.actions.getTasksAssignedToMe(undefined, undefined, "COMPLETE")
      this.props.actions.getTasksAssignedToMe(undefined, undefined, "INCOMPLETE")
    }else{
      this.props.taskListActions.getTaskListById(this.props.routeParams.taskListId)
      this.props.actions.getListTasks(this.props.routeParams.taskListId, undefined, "INCOMPLETE")
      this.props.actions.getListTasks(this.props.routeParams.taskListId, undefined, "COMPLETE")
      this.props.taskListActions.getMembersByTaskListId(this.props.routeParams.taskListId, "ALL")
      this.props.taskListActions.getOrganizationUsersNotInTaskList(this.props.routeParams.taskListId);
    }

    // PUT ME SOMEWHERE ELSE
    // toggle slim view
    $('.toggle-slim').click(function() {
        if($(this).hasClass('active')) {//true means slim mode off
          mobileAnalyticsClient.recordEvent('SLIM_MODE', {
                  'Value': 'OFF'
          });
        }
        else{//false means slim mode on
          mobileAnalyticsClient.recordEvent('SLIM_MODE', {
                  'Value': 'ON'
          });
        }
        $(this).toggleClass('active');
        $('.task-item-wrapper').toggleClass('slim');
        $('.task-item .row, .task-item, .main-task-item').toggleClass('align-middle');
    });
  }

  componentWillUpdate(nextProps){
    // console.log(this.props.routeParams.listName)
    if(nextProps.routeParams.listName != this.props.routeParams.listName){
      var listName = nextProps.routeParams.listName
      this.props.actions.loading()
      if(!listName || listName == "Inbox"){
        this.props.actions.getInboxTasks("COMPLETE")
        this.props.actions.getInboxTasks("INCOMPLETE")
      }else if(listName == "Assigned by me"){
        this.props.actions.getTasksAssignedByMe(undefined, undefined, "COMPLETE")
        this.props.actions.getTasksAssignedByMe(undefined, undefined, "INCOMPLETE")
      }else if(listName == "Assigned to me"){
        this.props.actions.getTasksAssignedToMe(undefined, undefined, "COMPLETE")
        this.props.actions.getTasksAssignedToMe(undefined, undefined, "INCOMPLETE")
      }else if(listName != null && nextProps.routeParams.taskListId !=null){
        this.props.taskListActions.getTaskListById(nextProps.routeParams.taskListId)
        this.props.actions.getListTasks(nextProps.routeParams.taskListId, undefined, "INCOMPLETE")
        this.props.actions.getListTasks(nextProps.routeParams.taskListId, undefined, "COMPLETE")
        this.props.taskListActions.getMembersByTaskListId(nextProps.routeParams.taskListId, "ALL")
        this.props.taskListActions.getOrganizationUsersNotInTaskList(nextProps.routeParams.taskListId);
      }
    }
  }

  refresh = () => {
    // $('.refresh').addClass('rotated').delay(100, function() {
    //   $('.refresh').removeClass('rotated')
    // });
    // $('.refresh').addClass('rotated');
    this.props.actions.loading()
    var listName = this.props.routeParams.listName
    if(!listName || listName == "Inbox"){
      this.props.actions.getInboxTasks("COMPLETE")
      this.props.actions.getInboxTasks("INCOMPLETE")
    }else if(listName == "Assigned by me"){
      this.props.actions.getTasksAssignedByMe(undefined, undefined, "COMPLETE")
      this.props.actions.getTasksAssignedByMe(undefined, undefined, "INCOMPLETE")
    }else if(listName == "Assigned to me"){
      this.props.actions.getTasksAssignedToMe(undefined, undefined, "COMPLETE")
      this.props.actions.getTasksAssignedToMe(undefined, undefined, "INCOMPLETE")
    }else{
      this.props.actions.getListTasks(this.props.routeParams.taskListId, undefined, "INCOMPLETE")
      this.props.actions.getListTasks(this.props.routeParams.taskListId, undefined, "COMPLETE")
      this.props.taskListActions.getMembersByTaskListId(this.props.routeParams.taskListId, "ALL")
      this.props.taskListActions.getOrganizationUsersNotInTaskList(this.props.routeParams.taskListId);
    }
    this.props.patientActions.getAllPatients()
    // $('.refresh').removeClass('rotated');
  }

  render() {
    var taskListId = this.props.params.taskListId
    const KEYS_TO_FILTERS = ['description', 'comments.comment', 'subtasks.description', 'subtasks.comments.comment']

    // Creates filter with LIST, SEARCH TERM, KEYS TO FILTER
    var filteredTasks = [];
    var filteredCompletedTasks = [];

    if(this.props.tasks && this.props.completedTasks){
      filteredTasks = this.props.tasks.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
      filteredCompletedTasks = this.props.completedTasks.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
    }
    return (

        <div className="off-canvas-content" data-off-canvas-content="true">
          <div className="row expanded collapse">
            <div className="large-12 columns">
              <HeaderTasks refresh={this.refresh} title={this.props.routeParams.listName} taskListId={this.props.routeParams.taskListId} searchUpdated={this.searchUpdated} clearSearch={this.clearSearch} searchTerm={this.state.searchTerm}/>
              <div className="list-wrapper">
                <h5>{this.props.isFetching}</h5>
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
          				</div> :
                <div className="task-item-wrapper">
                  <ListOfTasksContainer taskListId={taskListId} status="INCOMPLETE" members={this.props.members} filteredTasks={filteredTasks} />
                  {this.props.completedTasks && this.props.completedTasks.length > 0 &&
                    <div className="show-completed text-center">
                      <a className="toggle-completed button primary small">Show completed tasks</a>
                    </div>
                  }
                  <div className="completed-task-wrapper">
                    <ListOfTasksContainer taskListId={taskListId} status="COMPLETE" members={this.props.members} filteredTasks={filteredCompletedTasks} />
                  </div>
                </div>
              }
              </div>
            </div>
          </div>
        </div>

    );
  }
}

const mapStateToProps = function (store) {
  return{
    members: store.taskListState.tasklistmembers,
    tasks: store.taskState.tasks,
    completedTasks: store.taskState.completedTasks,
    isFetching: store.taskState.isFetching
  }
}

const mapDispatchToProps = function (dispatch) {
  return {
    actions: bindActionCreators(TaskActions, dispatch),
    taskListActions: bindActionCreators(TaskListActions, dispatch),
    patientActions: bindActionCreators(PatientActions, dispatch)
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(Home);
