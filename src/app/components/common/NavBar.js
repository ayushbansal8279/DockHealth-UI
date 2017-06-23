import React from 'react'
import { Link, browserHistory, hashHistory } from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as TaskActions from '../../actions/task-actions'
import * as TaskListActions from '../../actions/tasklist-actions'
import * as userApi from '../../api/user-api'

const NavLink = ({to, children, className}) => (
  <li>
    <Link activeClassName="active" className={className} to={to}>
      {children}
    </Link>
  </li>
)

const LinksDefault = ({className}) => (
  <div data-toggle="profile-dropdown" className="user-profile-link">
    <ul className={className}>
      <NavLink to='/register'>register</NavLink>
      <NavLink to='/login'>login</NavLink>
    </ul>
  </div>
)

const LinksAuth = ({user, className, onLogout,userProfilePic}) => (
    <div data-toggle="profile-dropdown" className="user-profile-link link"><img className="member-photo circle" src={userProfilePic} alt="name of user"/>{user.firstName + " " + user.lastName}</div>
)

class NavBar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      user: false
    }
    // this.getInboxTasks = this.getInboxTasks.bind(this)
    // this.getListTasks = this.getListTasks.bind(this)
    // this.getTasksAssignedByMe = this.getTasksAssignedByMe.bind(this)
  }

  // getTasksAssignedByMe(){
  //   this.props.taskActions.getTasksAssignedByMe()
  // }
  //
  // getInboxTasks(){
  //   this.props.taskActions.getInboxTasks()
  // }

  // getListTasks(taskListId){
  //   alert("getListTasks")
  //   this.props.taskActions.getListTasksByUser(taskListId)
  // }

  componentDidMount () {
    this.props.taskListActions.getTaskListForUser();
  }
  onLogout() {
    userApi.logout()
    hashHistory.push('login')
  }

  render() {

  	var {userProfile} = this.props
    var {userProfilePic} = this.props
    //var userProfilePicTemp = "data:image/png;base64," + userProfilePic
    //console.log(userProfilePicTemp);
    // alert(userProfilePic);
    if(userProfilePic == undefined){
      userProfilePic = "assets/img/dock-logo-white.png";
    }

  	let menuClasses = "menu float-right"
    return (
      <div className="off-canvas position-left reveal-for-medium" id="sidebar" data-off-canvas>
        <LinksAuth className={menuClasses} user={userProfile} userProfilePic={userProfilePic}/>
        {/*{userProfile ? <LinksAuth className={menuClasses} user={userProfile} userProfilePic={userProfilePic}/> : <LinksDefault className={menuClasses}/>}*/}

        {/*{userProfile ? <LinksAuth className={menuClasses} onLogout={this.onLogout} user={userProfile} userProfilePic={userProfilePic}/> : <LinksDefault className={menuClasses}/>}*/}
        <ul className="menu vertical outer">
          <NavLink to='/activityfeed'><svg className="icon medium"><use xlinkHref="#icon-activity"></use></svg>Activity</NavLink>
          <li>
            <Link to='/taskList' activeClassName="active"><svg className="icon medium"><use xlinkHref="#icon-list"></use></svg>Lists</Link>
            <ul className="nested vertical menu">
              {/*<NavLink to='/tasks'>Inbox</NavLink>*/}
              <NavLink onClick={(e) => this.getInboxTasks()} activeClassName="active" to={"/tasks/inbox"}>Inbox</NavLink>
              <NavLink onClick={(e) => this.getTasksAssignedByMe()} activeClassName="active" to={"/tasks/assignedToMe"}>Assigned to me</NavLink>
              <NavLink onClick={(e) => this.getTasksAssignedByMe()} activeClassName="active" to={"/tasks/assignedByMe"}>Assigned by me</NavLink>
              {/*<NavLink to='/tasks'>Important</NavLink>*/}
              {/*<NavLink to='/tasks'>Assigned to me</NavLink>*/}
              {/*<NavLink to='/tasks'>Assigned by me</NavLink>*/}
              {this.props.taskLists.map(taskList => {
                return(
                  // <NavLink onClick={(e) => {this.getListTasks(taskList.taskListId)}} key={taskList.taskListId} to={"/tasks/" + taskList.taskListId} activeClassName="active" title={taskList.listName}><span className="list-logo small"></span>{taskList.listName}</NavLink>
                  <NavLink to={"/tasks/" + taskList.taskListId} activeClassName="active" title={taskList.listName}><span className="list-logo small"></span>{taskList.listName}</NavLink>
                )
              })}
              {/*<li><a href="index.html" className="active">Boston Clinic</a></li>*/}
            </ul>
          </li>
          <NavLink to='/people'><svg className="icon"><use xlinkHref="#icon-user"></use></svg>People</NavLink>
          <NavLink to='/patientList'><svg className="icon"><use xlinkHref="#icon-patient"></use></svg>Patients</NavLink>
        </ul>
        <div className="share-wrapper hide">
          <div className="social-media text-center">
            <a href="#"><svg className="icon"><use xlinkHref="#icon-twitter"></use></svg></a>
            <a href="#"><svg className="icon"><use xlinkHref="#icon-facebook"></use></svg></a>
            <a href="#"><svg className="icon"><use xlinkHref="#icon-linkedin"></use></svg></a>
            <a href="#"><svg className="icon"><use xlinkHref="#icon-linkedin"></use></svg></a>
          </div>
          <div className="invite-email">
            <svg className="icon"><use xlinkHref="#icon-email"></use></svg>Invite friends via email
          </div>
        </div>
        <div className="small dropdown-pane" id="profile-dropdown" data-v-offset="0" data-h-offset="0" data-dropdown data-hover="true" data-hover-pane="true">
          <ul className="menu vertical">
            <NavLink to="/userprofile">View and edit profile</NavLink>
            <li><a href="terms2.html">Terms and conditions</a></li>
            <li><a href="login.html">Logout</a></li>
          </ul>
        </div>
      </div>
    );
    }
}


const mapStateToProps = function (store) {
  return {
    user: store.userState.user,
    userProfile: store.userState.userProfile,
    userProfilePic:store.userState.userProfilePic,
    taskLists: store.taskListState.tasklist
  }
}

const mapDispatchToProps = function (dispatch) {
  return {
    taskListActions: bindActionCreators(TaskListActions, dispatch),
    taskActions: bindActionCreators(TaskActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)
