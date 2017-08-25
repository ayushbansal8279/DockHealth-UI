import React from 'react';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import InvitePeople from '../components/people/InvitePeople'
import PeopleContainer from '../components/people/PeopleContainer'
import * as PeopleActions from '../actions/people-actions'
import {mobileAnalyticsClient} from '../api/analytics-api'
import BaseComponentWithFoundationUpdate from '../components/BaseComponentWithFoundationUpdate'

class PeopleView extends BaseComponentWithFoundationUpdate {

  constructor(props){
    super(props)
    this.state = {
      searchTerm: ''
    }
  }
  componentDidMount(){
    this.props.peopleActions.loading();
    this.props.peopleActions.findAllUsersByOrganizationId();
		mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
						'PageName': 'PeopleView'
		});
  }

  componentWillUnmount(){
    closeAddForm()
  }

  clearSearch = () => {
    this.setState({searchTerm: ''})
    toggleSearch()
  }

  searchUpdated = (term) => {
    this.setState({searchTerm: term.target.value})
  }

  refresh = () => {
    this.props.peopleActions.loading()
    this.props.peopleActions.findAllUsersByOrganizationId()
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
              <div className="columns shrink icon-group controls">
                <span onClick={(e) => this.refresh()}><svg className="icon refresh"><use xlinkHref="#icon-activity"></use></svg></span>
              </div>
              <div className="columns shrink">
                <svg className="add icon"><use xlinkHref="#icon-add-person"></use></svg>
              </div>

            </div>{/*list-filter*/}
            </header>{/*slideUp*/}

            <InvitePeople/>

            <div className="list-wrapper">
              {this.props.isFetching ?
                <div className="sk-circle">
                  <div className="sk-circle1 sk-child"></div>
                  <div className="sk-circle2 sk-child"></div>
                  <div className="sk-circle3 sk-child"></div>
                  <div className="sk-circle4 sk-child"></div>
                  <div className="sk-circle5 sk-child"></div>
                  <div className="sk-circle6 sk-child"></div>
                  <div className="sk-circle7 sk-child"></div>
                  <div className="sk-circle8 sk-child"></div>
                  <div className="sk-circle9 sk-child"></div>
                  <div className="sk-circle10 sk-child"></div>
                  <div className="sk-circle11 sk-child"></div>
                  <div className="sk-circle12 sk-child"></div>
                </div> :
                <PeopleContainer searchTerm={this.state.searchTerm}/>
              }
						</div>{/*list-wrapper*/}

          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = function (store) {
  return{
    isFetching: store.peopleState.isFetching
  }
}

const mapDispatchToProps = function (dispatch) {
  return {
    peopleActions: bindActionCreators(PeopleActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PeopleView);
