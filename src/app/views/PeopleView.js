import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Grid from '@material-ui/core/Grid';

import * as PeopleActions from '../actions/people-actions';
import { mobileAnalyticsClient } from '../api/analytics-api';
import InvitePeople from '../components/people/InvitePeople';
import PeopleContainer from '../components/people/PeopleContainer';
import GenericHeader from '../components/common/GenericHeader';
import InvitePeopleButton from '../components/people/InvitePeopleButton';

class PeopleView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
    };
  }

  componentDidMount() {
    this.props.peopleActions.loading();
    this.props.peopleActions.findAllUsersByOrganizationId();
    mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
      PageName: 'PeopleView',
    });
  }

  componentWillUnmount() {
    closeAddForm();
  }

  componentDidUpdate() {
    enableFoundationComponent('.item-list-wrapper');
    // enableFoundationForMultipleComponents(".item-list-wrapper", ".row")
  }

  clearSearch = () => {
    this.setState({ searchTerm: '' });
    toggleSearch();
  };

  searchUpdated = term => {
    this.setState({ searchTerm: term.target.value });
  };

  refresh = () => {
    this.props.peopleActions.loading();
    this.props.peopleActions.findAllUsersByOrganizationId();
  };

  addPerson = () => {
    openAddForm();
    scrollToTop();
  };

  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <GenericHeader
          isFetching={false}
          title="People"
        />
        <Grid container xs={9} direction="row" justify="flex-end" wrap="nowrap"
          style={{ maxHeight: "80px"}}>
          <div className="input-group searchbar" style={{width: "70%", marginTop: "5px", paddingLeft: "0em 10em"}}>
            <input
              className="input-field search-field"
              type="search"
              placeholder="Search people"
              onChange={this.searchUpdated}
              value={this.state.searchTerm}
            />
            <div className="input-group-button">
              <button className="button search">
                <svg onClick={this.clearSearch} className="icon">
                  <use xlinkHref="#icon-search" />
                </svg>
              </button>
            </div>
            {/* <div className="icon-group controls">
              <span onClick={e => this.refresh()}>
                <svg className="icon refresh">
                  <use xlinkHref="#icon-activity" />
                </svg>
              </span>
            </div> */}
          </div>
          {(this.props.currentUserProfile.orgUserRole == 'OWNER' ||
            this.props.currentUserProfile.orgUserRole == 'ADMIN') && 
            <InvitePeopleButton onClick={this.addPerson}/>
          }
        </Grid>
        <InvitePeople />
            <div className="list-wrapper" style={{width: "100%", marginTop: "0px"}}>
              {this.props.isFetching ? (
                <div className="sk-circle">
                  <div className="sk-circle1 sk-child" />
                  <div className="sk-circle2 sk-child" />
                  <div className="sk-circle3 sk-child" />
                  <div className="sk-circle4 sk-child" />
                  <div className="sk-circle5 sk-child" />
                  <div className="sk-circle6 sk-child" />
                  <div className="sk-circle7 sk-child" />
                  <div className="sk-circle8 sk-child" />
                  <div className="sk-circle9 sk-child" />
                  <div className="sk-circle10 sk-child" />
                  <div className="sk-circle11 sk-child" />
                  <div className="sk-circle12 sk-child" />
                </div>
              ) : (
                <PeopleContainer searchTerm={this.state.searchTerm} />
              )}
            </div>
            {/* list-wrapper */}
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return {
    isFetching: store.peopleState.isFetching,
    currentUserProfile: store.userState.userProfile,
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    peopleActions: bindActionCreators(PeopleActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PeopleView);
