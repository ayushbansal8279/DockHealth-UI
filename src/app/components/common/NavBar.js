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
  <div className="user-profile-link">
    <ul className={className}>
      <NavLink to='/register'>register</NavLink>
      <NavLink to='/login'>login</NavLink>
    </ul>
  </div>
)

const LinksAuth = ({user, className, onLogout,userProfilePic}) => (
  <Link activeClassName='is-active' className='nav-item is-tab' to="/userprofile">
    <div className="user-profile-link"><img className="member-photo circle memberphoto" src={userProfilePic} alt=""/>{user.firstName} {user.lastName}</div>
  </Link>
)

class NavBar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      user: false
    }
    this.getInboxTasks = this.getInboxTasks.bind(this)
    this.getListTasks = this.getListTasks.bind(this)
    this.getTasksAssignedByMe = this.getTasksAssignedByMe.bind(this)
  }

  getTasksAssignedByMe(){
    this.props.taskActions.getTasksAssignedByMe()
  }

  getInboxTasks(){
    this.props.taskActions.getInboxTasks()
  }

  getListTasks(taskListId){
    this.props.taskActions.getListTasksByUser(taskListId)
  }

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

	let menuClasses = 'menu float-right'
    return (
			<div className="off-canvas position-left reveal-for-medium" id="sidebar" data-off-canvas="true">
          {userProfile ? <LinksAuth className={menuClasses} onLogout={this.onLogout} user={userProfile} userProfilePic={userProfilePic}/> : <LinksDefault className={menuClasses}/>}
				<ul className="menu vertical outer">
          <NavLink to='/activityfeed'><svg className="icon"><use xlinkHref="#icon-activity"></use></svg>Activity</NavLink>
          <NavLink to='/taskList' activeClassName="active"><svg className="icon"><use xlinkHref="#icon-user"></use></svg>Lists</NavLink>
					{/*<li><a href="lists.html" className="active"><svg className="icon"><use xlinkHref="#icon-user"></use></svg>Lists</a>*/}
          <li>
					<ul className="nested vertical menu">
            {/*<NavLink to='/tasks'>Inbox</NavLink>*/}
            <li onClick={(e) => this.getInboxTasks()}><Link activeClassName="active" to={"/tasks/inbox"}>Inbox</Link></li>
      			<li onClick={(e) => this.getTasksAssignedByMe()}><Link activeClassName="active" to={"/tasks/assignedToMe"}>Assigned to me</Link></li>
            <li onClick={(e) => this.getTasksAssignedByMe()}><Link activeClassName="active" to={"/tasks/assignedByMe"}>Assigned by me</Link></li>
            {/*<NavLink to='/tasks'>Important</NavLink>*/}
            {/*<NavLink to='/tasks'>Assigned to me</NavLink>*/}
            {/*<NavLink to='/tasks'>Assigned by me</NavLink>*/}
            {this.props.taskLists.map(taskList => {
              return(
                <li onClick={(e) => {this.getListTasks(taskList.taskListId)}} key={taskList.taskListId}><Link to={"/tasks/" + taskList.listName} activeClassName="active" title={taskList.listName}><span className="list-logo small"></span>{taskList.listName}</Link></li>
              )
            })}
						{/*<li><a href="index.html" className="active">Boston Clinic</a></li>*/}
					</ul>
					</li>
			    <NavLink to='/people'><svg className="icon"><use xlinkHref="#icon-user"></use></svg>People</NavLink>
          <NavLink to='/patientList'><svg className="icon"><use xlinkHref="#icon-user"></use></svg>Patients</NavLink>
          <NavLink to='/invitations'>Invitations</NavLink>
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
