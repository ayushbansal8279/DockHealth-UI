import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import Moment from 'react-moment'
import ListOfTasksContainer from '../components/task/ListOfTasksContainer'
import HeaderTasks from '../components/common/HeaderTasks'
import MemberInitials from '../components/common/MemberInitials'
import * as TaskActions from '../actions/task-actions'
import * as TaskListActions from '../actions/tasklist-actions'
import * as PatientActions from '../actions/patient-actions'
import BaseComponentWithFoundationUpdate from '../components/BaseComponentWithFoundationUpdate'
import $ from 'jquery'
import {mobileAnalyticsClient} from '../api/analytics-api'
import SearchInput, {createFilter} from 'react-search-input'
import Mousetrap from 'react-mousetrap';
import * as userApi from '../api/user-api'

class Home extends BaseComponentWithFoundationUpdate {

  constructor(props){
    super(props)
    this.state = {
      title: '',
      searchTerm: '',
      editing: false
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

  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState)
    // enableFoundationComponent(".task-item-wrapper")
  }

  componentWillMount(){
    // console.log("home willMount")
  }

  refreshAccessToken(user){
    var systemTimeout= 30000;

    if(sessionStorage.timeoutId != null || sessionStorage.timeoutId != undefined){
      clearTimeout(sessionStorage.timeoutId);
      sessionStorage.setItem('refreshAccessTokenTimeoutId', null);
    }
    var comp = this;
    var refreshAccessTokenTimeoutId = setTimeout(function () {
        userApi.refreshAccessToken(user.username)
         .then(data => {
           console.log("refreshed tokens")
        })
        .catch(e => {
          console.log(e)
        });
        //set again
        comp.refreshAccessToken(user)

    }, systemTimeout)

    sessionStorage.setItem('refreshAccessTokenTimeoutId', refreshAccessTokenTimeoutId);
  }

  componentDidMount(){
    this.refreshAccessToken(this.props.user)
    var pops = this.context
    // Mousetrap.bind('ctrl+t', toggleTaskForm());
    var listName = this.props.routeParams.listName
    this.props.actions.loading()
    this.closeAuditHistory();

    if(listName == "Inbox"){
      this.props.taskListActions.isInbox(true)
      this.props.taskListActions.isList(false)
    }else{
      this.props.taskListActions.isInbox(false)
      this.props.taskListActions.isList(true)
    }

    if(!listName || listName == "Inbox"){
      // this.props.actions.getInboxTasks("COMPLETE")
      this.props.actions.getInboxTasks("INCOMPLETE")
    }else if(listName == "Assigned by me"){
      // this.props.actions.getTasksAssignedByMe(undefined, undefined, undefined, "COMPLETE")
      this.props.actions.getTasksAssignedByMe(undefined, undefined, undefined, "INCOMPLETE")
    }else if(listName == "Assigned to me"){
      // this.props.actions.getTasksAssignedToMe(undefined, undefined, undefined, "COMPLETE")
      this.props.actions.getTasksAssignedToMe(undefined, undefined, undefined, "INCOMPLETE")
    }else{
      this.props.taskListActions.getTaskListById(this.props.routeParams.taskListId)
      this.props.actions.getListTasks(this.props.routeParams.taskListId, undefined, undefined, "INCOMPLETE")
      // this.props.actions.getListTasks(this.props.routeParams.taskListId, undefined, undefined, "COMPLETE")
      if(this.props.routeParams.taskListId){
        this.props.taskListActions.getMembersByTaskListId(this.props.routeParams.taskListId, "ALL")
      }
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
      this.closeAuditHistory();
      if(!listName || listName == "Inbox"){
        // this.props.actions.getInboxTasks("COMPLETE")
        this.props.actions.getInboxTasks("INCOMPLETE")
      }else if(listName == "Assigned by me"){
        // this.props.actions.getTasksAssignedByMe(undefined, undefined, undefined, "COMPLETE")
        this.props.actions.getTasksAssignedByMe(undefined, undefined, undefined, "INCOMPLETE")
      }else if(listName == "Assigned to me"){
        // this.props.actions.getTasksAssignedToMe(undefined, undefined, undefined, "COMPLETE")
        this.props.actions.getTasksAssignedToMe(undefined, undefined, undefined, "INCOMPLETE")
      }else if(listName != null && nextProps.routeParams.taskListId !=null){
        this.props.taskListActions.getTaskListById(nextProps.routeParams.taskListId)
        this.props.actions.getListTasks(nextProps.routeParams.taskListId, undefined, undefined, "INCOMPLETE")
        // this.props.actions.getListTasks(nextProps.routeParams.taskListId, undefined, undefined, "COMPLETE")
        if(nextProps.routeParams.taskListId){
          this.props.taskListActions.getMembersByTaskListId(nextProps.routeParams.taskListId, "ALL")
        }
        this.props.taskListActions.getOrganizationUsersNotInTaskList(nextProps.routeParams.taskListId);
      }
    }
  }

  componentWillUnmount(){
    this.props.taskListActions.isList(false)
    this.props.taskListActions.isInbox(false)
  }

  refresh = () => {
    // $('.refresh').addClass('rotated').delay(100, function() {
    //   $('.refresh').removeClass('rotated')
    // });
    // $('.refresh').addClass('rotated');
    this.props.actions.loading()
    this.closeAuditHistory()
    var listName = this.props.routeParams.listName
    if(!listName || listName == "Inbox"){
      // this.props.actions.getInboxTasks("COMPLETE")
      this.props.actions.getInboxTasks("INCOMPLETE")
    }else if(listName == "Assigned by me"){
      // this.props.actions.getTasksAssignedByMe(undefined, undefined, undefined, "COMPLETE")
      this.props.actions.getTasksAssignedByMe(undefined, undefined, undefined, "INCOMPLETE")
    }else if(listName == "Assigned to me"){
      // this.props.actions.getTasksAssignedToMe(undefined, undefined, undefined, "COMPLETE")
      this.props.actions.getTasksAssignedToMe(undefined, undefined, undefined, "INCOMPLETE")
    }else{
      this.props.actions.getListTasks(this.props.routeParams.taskListId, undefined, undefined, "INCOMPLETE")
      // this.props.actions.getListTasks(this.props.routeParams.taskListId, undefined, undefined, "COMPLETE")
      if(this.props.routeParams.taskListId){
        this.props.taskListActions.getMembersByTaskListId(this.props.routeParams.taskListId, "ALL")
      }
      this.props.taskListActions.getOrganizationUsersNotInTaskList(this.props.routeParams.taskListId);
    }
    this.props.patientActions.getAllPatients()
    // $('.refresh').removeClass('rotated');
  }

  pullCompletedTasks = () => {
    if(!this.props.showingCompletedTasks){
      this.props.actions.loadingCompletedTasks()
      var listName = this.props.routeParams.listName
      if(!listName || listName == "Inbox"){
        this.props.actions.getInboxTasks("COMPLETE")
      }else if(listName == "Assigned by me"){
        this.props.actions.getTasksAssignedByMe(undefined, undefined, undefined, "COMPLETE")
      }else if(listName == "Assigned to me"){
        this.props.actions.getTasksAssignedToMe(undefined, undefined, undefined, "COMPLETE")
      }else{
        this.props.actions.getListTasks(this.props.routeParams.taskListId, undefined, undefined, "COMPLETE")
      }
    }else{
      this.props.actions.hideCompletedTasks()
    }
  }

  setTaskEditingStatus = (isEditing) => {
    // alert("working")
    this.setState({editing: isEditing})
  }

  closeAuditHistory = () => {
    this.props.actions.storeAsCurrentTask(null)
    //.then((resp) => {
      this.props.actions.clearCurrentTaskHistory()
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

  render() {
    var taskListId = this.props.params.taskListId
    const KEYS_TO_FILTERS = ['description', 'comments.comment', 'subtasks.description', 'subtasks.comments.comment']

    // Creates filter with LIST, SEARCH TERM, KEYS TO FILTER
    var filteredTasks = [];
    var filteredCompletedTasks = [];

    if(this.props.tasks && this.props.completedTasks){
      if(this.props.tasks && this.props.tasks.length>0){
        filteredTasks = this.props.tasks.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
      }
      if(this.props.completedTasks && this.props.completedTasks.length>0){
        filteredCompletedTasks = this.props.completedTasks.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
      }
    }
    return (

        <div className="off-canvas-content" data-off-canvas-content="true">
          <div className="row expanded collapse">
            <div className="large-12 columns">
              <HeaderTasks
                refresh={this.refresh}
                title={this.props.routeParams.listName}
                taskListId={this.props.routeParams.taskListId}
                searchUpdated={this.searchUpdated}
                clearSearch={this.clearSearch}
                searchTerm={this.state.searchTerm}
                isEditing={this.state.editing}
                setTaskEditingStatus={this.setTaskEditingStatus}
              />
              <div className="tasks-container">
              <div className={this.props.currentTaskHistory?"large-8 columns left-column":"large-12 columns left-column"}>
              
              <div className="list-wrapper">
                {/* <h5>{this.props.isFetching}</h5> */}
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
                    <div className="task-wrapper">
                      {filteredTasks && this.renderTaskListName(filteredTasks, "INCOMPLETE")}
                    </div>
                    <div className="show-completed text-center">
                      <a className="toggle-completed button primary small" onClick={(e) => this.pullCompletedTasks()}>Show completed tasks</a>
                    </div>
                  </div>
                }
                {this.props.isCompletedTasksFetching ?
                  <div className="sk-circle completed-tasks-fetching">
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
                    <div className="completed-task-wrapper">
                      {filteredCompletedTasks && this.renderTaskListName(filteredCompletedTasks, "COMPLETE")}
                    </div>
                    {this.props.showingCompletedTasks && this.props.completedTasks && this.props.completedTasks.length == 0 &&
                      <span className="taskListSearchMessage">No completed tasks</span>
                    }
                  </div> 
                }
              </div>
              </div>
              <div className="right-column">
              {/* <div className="large-4 columns"> */}
                <div className="list-wrapper">
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
                </div>
              {/* </div> */}
              </div>
              </div>
            </div>
          </div>
        </div>

    );
  }

  renderList(taskListId, listName, tasks, members, memberstatus) {
    return(
          <ListOfTasksContainer
            taskListId={taskListId} status={memberstatus}
            members={members}
            filteredTasks={tasks}
            setTaskEditingStatus={this.setTaskEditingStatus}
            listName=""
          />        
    );
  }

  // Lists TaskLists
  renderTaskListName(tasks, memberstatus){
    const groupedTasks = this.groupBy(tasks, task => (task.taskList ? task.taskList.listName : ""));
    if(!groupedTasks || groupedTasks.size == 0){
      return <div/>
    }
    return Array.from(groupedTasks.keys()).map((listName) =>{
      const tasks = groupedTasks.get(listName)
      var taskListId = 0
      if(tasks){
        taskListId = (tasks[0].taskList ? tasks[0].taskList.taskListId : 0)
      }
      return(
        <div className="accordion-item" key={"taskList_" + listName}>
          {(!this.props.routeParams.listName || this.props.routeParams.listName=="" 
            || this.props.routeParams.listName=="Assigned to me"
            || this.props.routeParams.listName=="Assigned by me") && 
          <span className="accordion-title task-search-list-name">
            <b>{listName}</b>
          </span>  
          }
          <div>
            {tasks && tasks.length > 0 ? 
              this.renderList(taskListId, listName, tasks, null, memberstatus) : 
              <p className="light-gray">No matching tasks</p>}
          </div>
        </div>
      );
    })
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

const mapStateToProps = function (store) {
  return{
    members: store.taskListState.tasklistmembers,
    tasks: store.taskState.tasks,
    completedTasks: store.taskState.completedTasks,
    isFetching: store.taskState.isFetching,
    isCompletedTasksFetching: store.taskState.isCompletedTasksFetching,
    showingCompletedTasks: store.taskState.showingCompletedTasks,
    user: store.userState.user,
    selectedTask: store.taskState.selectedTask,
    currentTaskHistory: store.taskState.currentTaskHistory
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
