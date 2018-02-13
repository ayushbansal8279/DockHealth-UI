import React from 'react'
import ReactDOM from 'react-dom';
import { Link, browserHistory, hashHistory } from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as TaskActions from '../../actions/task-actions'
import * as TaskListActions from '../../actions/tasklist-actions'
import * as userApi from '../../api/user-api'
import $ from 'jquery'
import MemberInitials from './MemberInitials'

const NavLink = ({to, children, className}) => (
  <li>
    <Link activeClassName="active" className={className} to={to}>
      {children}
    </Link>
  </li>
)

const LinksDefault = ({className}) => (
  <div data-toggle="profile-dropdown" className="align-middle row user-profile-link link">
    <ul className={className}>
      <NavLink to='/register'>register</NavLink>
      <NavLink to='/login'>login</NavLink>
    </ul>
  </div>
)

const LinksAuth = ({user, className, onLogout, userProfilePicThumb}) => (
  <Link to="/userprofile">
    <div data-toggle="profile-dropdown" className="align-middle row user-profile-link link">
        {userProfilePicThumb ?
          <img className="medium member-photo circle" src={process.env.HEYDOC_SERVICES_BASE_URL +"user/profilePicture/"+user.userId+"/"+userProfilePicThumb} alt={user.firstName + " " + user.lastName}/> :
          <span className="medium member-initials circle">{user.initials}</span>
        }
        {user.firstName + " " + user.lastName}
    </div>
  </Link>
    // <div data-toggle="profile-dropdown" className="user-profile-link link">
    //   <MemberInitials member={user}/>
    //   {user.firstName + " " + user.lastName}
    // </div>
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

  componentDidMount () {
    // this.props.taskListActions.getTaskListForUser();
  }
  onLogout() {
    userApi.logout()
    hashHistory.push('login')
  }

  render() {

  	// var {userProfile} = this.props
    // var {userProfilePic} = this.props
    // if(userProfilePic == undefined){
    //   userProfilePic = "assets/img/dock-logo-white.png";
    // }

  	let menuClasses = "menu float-right"
    return (
      <div className="off-canvas position-left reveal-for-medium" id="sidebar" data-off-canvas>
        <LinksAuth className={menuClasses} user={this.props.userProfile} userProfilePicThumb={this.props.userProfile.profilePictureHash}/>
        {/* <h1 onClick={(e) => this.unmountAddTaskForm()}>Hello</h1> */}
        {/*{userProfile ? <LinksAuth className={menuClasses} user={userProfile} userProfilePic={userProfilePic}/> : <LinksDefault className={menuClasses}/>}*/}

        {/*{userProfile ? <LinksAuth className={menuClasses} onLogout={this.onLogout} user={userProfile} userProfilePic={userProfilePic}/> : <LinksDefault className={menuClasses}/>}*/}
        <ul className="menu vertical outer">
          <NavLink to='/activityfeed' className="center-content-vertical"><svg className="icon medium"><use xlinkHref="#icon-activity"></use></svg>Activity</NavLink>
          <li>
            <Link to='/taskList' activeClassName="active" className={"center-content-vertical " + (this.props.isList && 'active')}><svg className="icon medium"><use xlinkHref="#icon-list"></use></svg>Lists</Link>
            <ul className="nested vertical menu">

              {/* <li>
                <Link activeClassName="active" className={className} to={to}>
                  {children}
                </Link>
              </li> */}

              <NavLink activeClassName="active" to={"/tasks/Inbox"}>Inbox</NavLink>
              <NavLink activeClassName="active" to={"/tasks/Assigned to me"}>Assigned to me</NavLink>
              <NavLink activeClassName="active" to={"/tasks/Assigned by me"}>Assigned by me</NavLink>

              {this.props.taskLists && this.props.taskLists.map(taskList => {
                return(
                  <NavLink  to={"/tasks/" + taskList.listName + "/" + taskList.taskListId} activeClassName="active" title={taskList.listName} key={taskList.taskListId}><span className="list-logo small"></span>{taskList.listName}</NavLink>
                )
              })}
            </ul>
          </li>
          <NavLink to='/people' className="center-content-vertical"><svg className="icon"><use xlinkHref="#icon-user"></use></svg>People</NavLink>
          <NavLink to='/patientList' className="center-content-vertical"><svg className="icon"><use xlinkHref="#icon-patient"></use></svg>Patients</NavLink>
          <NavLink to='/support' className="center-content-vertical"><svg className="icon"><use xlinkHref="#icon-patient"></use></svg>Support</NavLink>
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
    taskLists: store.taskListState.tasklist,
    isList: store.taskListState.isList
  }
}

const mapDispatchToProps = function (dispatch) {
  return {
    taskListActions: bindActionCreators(TaskListActions, dispatch),
    taskActions: bindActionCreators(TaskActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)
