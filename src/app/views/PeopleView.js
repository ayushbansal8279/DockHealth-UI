import React from 'react';

import PeopleContainer from '../components/people/PeopleContainer'


class PeopleView extends React.Component {
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

                  <PeopleContainer/>

  						</div>{/*list-wrapper*/}
            </div>
          </div>
        </div>
      );
  }
}

export default PeopleView;
