import React from 'react'
import { Link, browserHistory, hashHistory } from 'react-router'
import { connect } from 'react-redux'
import * as userApi from '../../api/user-api'

const NavLink = ({to, children}) => (
  <li>
  <Link activeClassName='is-active' className='nav-item is-tab' to={to}>
    <svg className="icon medium-2"></svg>{children}
  </Link>
  </li>
)

const LinksDefault = ({className}) => (
  <ul className={className}>
    <NavLink to='/register'>register</NavLink>
    <NavLink to='/login'>login</NavLink>
  </ul>
)

const LinksAuth = ({user, className, onLogout,userProfilePic}) => (
  <ul className={className}>
    <NavLink to={`/users/${user.username}`}><img className="memberphoto" src={userProfilePic} alt="name of user"/>{user.firstName} {user.lastName}</NavLink>
    <li><a className='nav-item is-tab' onClick={onLogout}>logout</a></li>
  </ul>
)

class NavBar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      user: false
    }
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
  if(userProfilePic == undefined){
    userProfilePic = "assets/img/dock-logo-white.png";
  }

	let menuClasses = 'menu float-right'
    return (
<nav>
<div className="row">
	<div className="large-12 columns">
		<ul className="menu float-left">
			<NavLink to='/inbox'>Tasks</NavLink>
			<NavLink to='/taskList'>List</NavLink>
			<NavLink to='/people'>People</NavLink>
      <NavLink to='/patientList'>Patients</NavLink>
			<li><a href="#">Learn</a></li>
      <NavLink to='/invitations'>List Invitations</NavLink>
      <NavLink to='/activityfeed'>Activity Feed</NavLink>
		</ul>
		{userProfile ? <LinksAuth className={menuClasses} onLogout={this.onLogout} user={userProfile} userProfilePic={userProfilePic}/> : <LinksDefault className={menuClasses}/>}
	</div>
</div>
</nav>
    );
    }
}

const mapStateToProps = function (store) {
  return {
    user: store.userState.user,
    userProfile: store.userState.userProfile,
    userProfilePic:store.userState.userProfilePic
  }
}

export default connect(mapStateToProps)(NavBar)
