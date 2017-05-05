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

const LinksAuth = ({user, className, onLogout}) => (
  <ul className={className}>
    <NavLink to={`/users/${user.username}`}><img className="memberphoto" src="assets/img/memberphoto.png" alt="name of user"/>{user.username}</NavLink>
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

  isLoggedIn(message, isLoggedIn, cognitoUser) {
      if (!isLoggedIn) {
        console.log('not logged in')
        hashHistory.push('login')
      } else {
        if(!this.props.user){
          this.state.user = cognitoUser
        }
        console.log('logged in: '+cognitoUser.username)
      }
  }

  onLogout() {
      userApi.logout()
      hashHistory.push('login')
  }

  componentWillMount() {
    userApi.isAuthenticated(this)
  }

  render() {

	var {user} = this.props
  if(!user){
    user = this.state.user
  }
	let menuClasses = 'menu float-right'
    return (
<nav>
<div className="row">
	<div className="large-12 columns">
		<ul className="menu float-left">
			<li><a className="active" href="#">Tasks</a></li>
			<NavLink to='/taskList'>List</NavLink>
			<li><a href="#">People</a></li>
      <NavLink to='/patientList'>Patients</NavLink>
			<li><a href="#">Learn</a></li>
      <NavLink to='/invitations'>Invitations</NavLink>
		</ul>
		{user ? <LinksAuth className={menuClasses} onLogout={this.onLogout} user={user} /> : <LinksDefault className={menuClasses}/>}
	</div>
</div>
</nav>
    );
    }
}

const mapStateToProps = function (store) {
  return {
    user: store.userState.user
  }
}

export default connect(mapStateToProps)(NavBar)
