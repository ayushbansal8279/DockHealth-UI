import React from 'react'
import AddTask from '../task/AddTask'

class Header extends React.Component {
    render() {
    return (

<div id="header-start">
    <div data-sticky-container>
	<div className="sticky" data-top-anchor="header-start" data-sticky data-margin-top="0">
		<header>
		<div className="row">
			<div className="large-12 columns">
				<ul id="mainmenu" className="menu dropdown" data-dropdown-menu data-disable-hover="true" data-click-open="true">
				<li className="my-menu">	
				<span className="logo default"><span className="logo-text">BC</span></span>
				<h2>Boston Clinic <svg className="icon"><use xlinkHref="#icon-angle-down"></use></svg></h2>
				<ul className="menu title-dropdown-menu">
					<li className="search"><svg className="icon"><use xlinkHref="#icon-search"></use></svg>Search</li>
					<li><svg className="icon green large"><use xlinkHref="#icon-calendar"></use></svg>Today</li>
					<li><svg className="icon blue large"><use xlinkHref="#icon-envelope"></use></svg>Inbox</li>
					<li><img className="memberphoto active" src="assets/img/memberphoto.png" alt="name of user"/>Assigned to me</li>
					<li><svg className="icon blue large"><use xlinkHref="#icon-forward"></use></svg>Assigned by me</li>
				    <li><svg className="icon large priority high"><use xlinkHref="#icon-cross"></use></svg>Important</li>
					<li><span className="list-logo small"><span className="logo-text small">BC</span></span>Boston Clinic</li>
					<li><span className="list-logo small"><span className="logo-text small">WC</span></span>Waltham Clinic</li>
				</ul>
			    </li>
			    </ul>
			</div>
		</div>
		<div className="row">
			<div className="large-8 columns my-task-add-button">
				<svg className="add icon primary xlarge"><use href="#icon-add-large"></use></svg>
		    </div>
	    </div>
	    </header>

	<AddTask/>

    <div className="dropdown-pane" id="set-date" data-dropdown data-close-on-click="true">
        <label>Set due date <input type="text" className="due-date" placeholder="due date"/></label>
        <label>Schedule reminder <input type="text" className="reminder" placeholder="reminder"/></label>
    </div>

    </div>
    </div>
</div>
    );
    }
}

export default Header
