import React from 'react';
import InvitePeople from '../components/people/InvitePeople'
import PeopleContainer from '../components/people/PeopleContainer'
import {mobileAnalyticsClient} from '../api/analytics-api'
import BaseComponent from '../components/BaseComponent'

class PeopleView extends BaseComponent {

  constructor(props){
    super(props)
    this.state = {
      searchTerm: ''
    }
  }
  componentDidMount(){
		mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
						'PageName': 'PeopleView'
		});
  }
  clearSearch = () => {
    this.setState({searchTerm: ''})
  }

  searchUpdated = (term) => {
    this.setState({searchTerm: term.target.value})
  }

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

            <div className="wrapper list-filter row collapse align-middle align-right">
              <div className="columns controls">
                <div className="input-group searchbar">
                  <input className="input-field search-field" type="search" placeholder="Search tasks"  onChange={this.searchUpdated} value={this.state.searchTerm}/>
                  <div className="input-group-button">
                    <button className="button search">
                      <svg onClick={this.clearSearch} className="icon"><use xlinkHref="#icon-search"></use></svg>
                    </button>
                  </div>
                </div>


              </div>
              <div className="columns shrink">
                <svg className="add icon"><use xlinkHref="#icon-add-person"></use></svg>
              </div>

            </div>{/*list-filter*/}
            </header>{/*slideUp*/}

            <InvitePeople/>

            <div className="list-wrapper">

                <PeopleContainer searchTerm={this.state.searchTerm}/>

						</div>{/*list-wrapper*/}

          </div>
        </div>
      </div>
    );
  }
}

export default PeopleView;
