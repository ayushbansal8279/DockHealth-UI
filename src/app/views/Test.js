import React from 'react';
{/* use to test html and clean up before implementing into components */}

import TaskListContainer from '../components/tasklist/TaskListContainer'
import Header from '../components/common/Header'

class Test extends React.Component {
    render() {
      return (

        <div className="off-canvas-content" data-off-canvas-content>
  				<div className="row expanded collapse">
  					<div className="large-12 columns">

  						<header className="nav-down">
  						<div className="top-bar">
  							<div className="top-bar-left">
  								<button className="menu-icon hide-for-medium" type="button" data-toggle="sidebar"></button>
  								<h3>People</h3>
  							</div>
  						</div>

  						<div className="wrapper list-filter row expanded collapse align-middle align-right">
  							<div className="columns controls">
  								<div className="input-group searchbar">
  									<input className="input-field search-field" type="search" placeholder="Search tasks" />
  									<div className="input-group-button">
  										<button className="button search">
  											<svg className="icon"><use xlinkHref="#icon-search"></use></svg>
  										</button>
  									</div>
  								</div>


  							</div>
  							<div className="columns shrink">
  								<svg className="add icon"><use xlinkHref="#icon-add"></use></svg>
  							</div>

  						</div>{/*list-filter*/}
  						</header>{/*slideUp*/}

  						<div className="add-form-wrapper">
  							<div className="task-item add-form row expanded">
  								<form className="inline-label">
  									<div className="column large-12 text-center">
  										<h5 className="section-title">Invite a person</h5>
  									</div>

  									{/* First name */}
  									<div className="column large-12 input-group no-icon">
  										<div className="form-floating-label input-wrapper">
  											<input className="input-group-field" type="text"/>
  											<label>First name</label>
  										</div>
  									</div>

  									{/* Last name */}
  									<div className="column large-12 input-group no-icon">
  										<div className="form-floating-label input-wrapper">
  											<input className="input-group-field" type="text"/>
  											<label>Last name</label>
  										</div>
  									</div>

  									{/* Email name */}
  									<div className="column large-12 input-group no-icon">
  										<div className="form-floating-label input-wrapper">
  											<input className="input-group-field" type="text"/>
  											<label>Email</label>
  										</div>
  									</div>

  									{/* SAVE */}
  									<div className="column large-12 text-center">
  										<input type="submit" className="button medium secondary" value="Send invite"/>
  									</div>

  								</form>
  							</div>
  						</div>{/*add-form-wrapper*/}

  						<div className="list-wrapper">
  							<div className="item-list-wrapper">

  								{/* person 1 */}
  								<div className="item row expanded">
  									<div className="columns shrink">
  										<img className="member-photo circle" src="assets/img/user3.png" alt="name of user"/>
  									</div>
  									<div className="columns">
  										<span className="item-title">Megan Smith</span>
  										<span className="item-details">RN, GI Nurse</span>
  										<span className="top-buffer-xsmall item-details">megan.smith@childrens.harvard.edu</span>
  										<span className="item-details">P: 434-432-43243 | C: 434-432-43243</span>
  									</div>
  									<div className="columns shrink more-options-wrapper more-options-people">
  										<span className="more-task-options icon-group-tooltip">
  											<span data-tooltip aria-haspopup="true" data-disable-hover="false" tabindex="2" title="delete this person"><svg className="icon"><use xlinkHref="#icon-delete"></use></svg></span>
  											<span data-tooltip aria-haspopup="true" data-disable-hover="false" tabindex="2" title="give admin rights"><svg className="icon"><use xlinkHref="#icon-admin"></use></svg></span>
  										</span>
  										<svg className="icon medium ellipses"><use xlinkHref="#icon-ellipses"></use></svg>
  									</div>
  								</div>

  								{/* person 2 */}
  								<div className="item row expanded">
  									<div className="columns shrink">
  										<img className="member-photo circle" src="assets/img/user1.png" alt="name of user"/>
  									</div>
  									<div className="columns">
  										<span className="item-title">Christopher Richardson</span>
  										<span className="item-details">RN, GI Nurse</span>
  										<span className="top-buffer-xsmall item-details">christopher.richardson@childrens.harvard.edu</span>
  										<span className="item-details">P: 434-432-43243 | C: 434-432-43243</span>
  									</div>
  									<div className="columns shrink more-options-wrapper more-options-people">
  										<span className="more-task-options icon-group-tooltip">
  											<span data-tooltip aria-haspopup="true" data-disable-hover="false" tabindex="2" title="delete this person"><svg className="icon"><use xlinkHref="#icon-delete"></use></svg></span>
  											<span data-tooltip aria-haspopup="true" data-disable-hover="false" tabindex="2" title="give admin rights"><svg className="icon"><use xlinkHref="#icon-admin"></use></svg></span>
  										</span>
  										<svg className="icon medium ellipses"><use xlinkHref="#icon-ellipses"></use></svg>
  									</div>
  								</div>

  								{/* person 3 */}
  								<div className="item row expanded">
  									<div className="columns shrink">
  										<img className="member-photo circle" src="assets/img/user2.png" alt="name of user"/>
  									</div>
  									<div className="columns">
  										<span className="item-title">Emily Alexander</span>
  										<span className="item-details">MD, Endocrinology</span>
  										<span className="top-buffer-xsmall item-details">emily.alexander@childrens.harvard.edu</span>
  										<span className="item-details">P: 434-432-43243 | C: 434-432-43243</span>
  									</div>
  									<div className="columns shrink more-options-wrapper more-options-people">
  										<span className="more-task-options icon-group-tooltip">
  											<span data-tooltip aria-haspopup="true" data-disable-hover="false" tabindex="2" title="delete this person"><svg className="icon"><use xlinkHref="#icon-delete"></use></svg></span>
  											<span data-tooltip aria-haspopup="true" data-disable-hover="false" tabindex="2" title="give admin rights"><svg className="icon"><use xlinkHref="#icon-admin"></use></svg></span>
  										</span>
  										<svg className="icon medium ellipses"><use xlinkHref="#icon-ellipses"></use></svg>
  									</div>
  								</div>

  								{/* person 4 pending */}
  								<div className="item row expanded">
  									<div className="columns shrink pending">
  										<span className="member-initials circle">KV</span>
  									</div>
  									<div className="columns">
  										<span className="item-title">Kate Vasquez</span>
  										<span className="item-details">MD, Endocrinology</span>
  										<span className="item-details highlight">Pending</span>
  									</div>
  									<div className="columns shrink more-options-wrapper more-options-people">
  										<span className="more-task-options icon-group-tooltip">
  											<span data-tooltip aria-haspopup="true" data-disable-hover="false" tabindex="2" title="delete this person"><svg className="icon"><use xlinkHref="#icon-delete"></use></svg></span>
  											<span data-tooltip aria-haspopup="true" data-disable-hover="false" tabindex="2" title="give admin rights"><svg className="icon"><use xlinkHref="#icon-admin"></use></svg></span>
  										</span>
  										<svg className="icon medium ellipses"><use xlinkHref="#icon-ellipses"></use></svg>
  									</div>

  								</div>

  							</div>{/*item-list-wrapper*/}
  						</div>{/*list-wrapper*/}
  					</div>
  				</div>
  			</div>

      );
  }
}

export default Test;
