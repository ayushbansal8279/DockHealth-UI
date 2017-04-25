import React from 'react'
import { Link } from 'react-router'

const NavLink = ({to, children}) => (
  <li>
  <Link activeClassName='is-active' className='nav-item is-tab' to={to}>
    <svg className="icon medium-2"></svg>{children}
  </Link>
  </li>
)

const LinksDefault = ({className}) => (
  <ul className={className}>
    <NavLink to='/'>Home</NavLink>
  </ul>
)


class NavBarNoLogin extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      user: false
    }
  }

  render() {
	const {user} = this.props
	let menuClasses = 'menu float-right'
    return (
<nav>
<div className="row">
	<div className="large-12 columns">
		<ul className="menu float-left">
		</ul>
		<LinksDefault className={menuClasses}/>
		
	</div>
</div> 
</nav>
    );
    }
}


export default NavBarNoLogin
