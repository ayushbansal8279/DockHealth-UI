import React from 'react'

class TaskFilters extends React.Component {
    render() {
    return (
		<div className="row collapse task-list-filter-wrapper">
			<div className="large-12 columns task-list-filter">
				<ul className="menu dropdown float-left inherit" data-disable-hover="true" data-click-open="true" data-dropdown-menu>
					<li>
            <a href="#" className="collapse" data-toggle="search-input"><svg className="icon"><use xlinkHref="#icon-search"></use></svg></a>
					</li>
					<li id="search-input" className="hide" data-toggler data-animate="slide-in-left slide-out-right">search input here . . .</li>
					<li>
            <a href="#"><span className="dropdown-tab-text">All Tasks</span>
            <svg className="icon small"><use xlinkHref="#icon-caret-down"></use></svg>
            </a>
  		      <ul className="menu">
    			    <li>Assigned to me</li>
    			    <li><a href="#">I assigned to others 42</a></li>
  		      </ul>
          </li>
			    <li>
              <a href="#"><span className="dropdown-tab-text">Sort By</span>
                <svg className="icon small"><use xlinkHref="#icon-caret-down"></use></svg>
              </a>
			        <ul className="menu">
  					    <li><a href="#">Due date</a></li>
  					    <li><a href="#">Creation date</a></li>
  					    <li><a href="#">Assignee</a></li>
  					    <li><a href="#">Assigned to</a></li>
  					    <li><a href="#">Priority</a></li>
			        </ul>
			    </li>
			    <li><a href="#"><span className="dropdown-tab-text">Show</span><svg className="icon small"><use xlinkHref="#icon-caret-down"></use></svg></a>
            <ul className="menu">
			        <li><a href="#">All</a></li>
			        <li><a href="#">Important</a></li>
			        <li><a href="#">Today</a></li>
			        <li><a href="#">Inbox</a></li>
            </ul>
          </li>
				</ul>
				<ul className="menu dropdown float-right" data-dropdown-menu data-disable-hover="true" data-click-open="true">
					<li className="align-right"><a href="#"><svg className="icon"><use xlinkHref="#icon-vertical-ellipsis"></use></svg></a>
					<ul className="menu">
						<li><a href="#">Email List</a></li>
						<li><a href="#">Print List</a></li>
						<li><a href="#">Do not disturb</a></li>
					</ul>
					</li>
				</ul>
			</div>
		</div>
    );
    }
}

export default TaskFilters
