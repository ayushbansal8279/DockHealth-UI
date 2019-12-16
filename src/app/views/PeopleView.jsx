import Grid from '@material-ui/core/Grid';
import queryString from 'query-string';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

import * as PeopleActions from '../actions/people-actions';
import { mobileAnalyticsClient } from '../api/analytics-api';
import CubesLoader from '../components/common/CubesLoader';
import GenericHeader from '../components/common/GenericHeader';
import InvitePeople from '../components/people/InvitePeople';
import InvitePeopleButton from '../components/people/InvitePeopleButton';
import PeopleContainer from '../components/people/PeopleContainer';

const CubesLoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

class PeopleView extends PureComponent {
  state = {
    searchTerm: '',
  };

  componentDidMount() {
    const { location, peopleActions } = this.props;
    peopleActions.loading();
    peopleActions.findAllUsersByOrganizationId();
    mobileAnalyticsClient.recordEvent('VIEW_ACCESS', {
      PageName: 'PeopleView',
    });

    const { searchName } = queryString.parse(location.search) || {};

    if (searchName) {
      this.setState({
        searchTerm: searchName,
      });
      toggleSearch();
    }
  }

  componentDidUpdate() {
    enableFoundationComponent('.item-list-wrapper');
  }

  componentWillUnmount() {
    closeAddForm();
  }

  clearSearch = () => {
    this.setState({ searchTerm: '' });
    toggleSearch();
  };

  searchUpdated = term => {
    this.setState({ searchTerm: term.target.value });
  };

  refresh = () => {
    const { peopleActions } = this.props;
    peopleActions.loading();
    peopleActions.findAllUsersByOrganizationId();
  };

  addPerson = () => {
    openAddForm();
    scrollToTop();
  };

  render() {
    const { searchTerm } = this.state;
    const { currentUserProfile, isFetching } = this.props;
    const orgUserRole = currentUserProfile?.orgUserRole;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <GenericHeader isFetching={false} title="People" />
        <Grid
          container
          xs={9}
          item
          direction="row"
          justify="flex-end"
          wrap="nowrap"
          style={{ maxHeight: '80px' }}
        >
          <div
            className="input-group searchbar"
            style={{ width: '70%', marginTop: '5px', paddingLeft: '0em 10em' }}
          >
            <input
              className="input-field search-field"
              type="search"
              placeholder="Search people"
              onChange={this.searchUpdated}
              value={searchTerm}
            />
            <div className="input-group-button">
              <button className="button search" type="button">
                <svg onClick={this.clearSearch} className="icon">
                  <use xlinkHref="#icon-search" />
                </svg>
              </button>
            </div>
          </div>
          {(orgUserRole === 'OWNER' || orgUserRole === 'ADMIN') && (
            <InvitePeopleButton onClick={this.addPerson} />
          )}
        </Grid>
        <InvitePeople />
        <div
          className="list-wrapper"
          style={{ width: '100%', marginTop: '0px' }}
        >
          {isFetching ? (
            <CubesLoaderContainer>
              <CubesLoader size={40} />
            </CubesLoaderContainer>
          ) : (
            <PeopleContainer searchTerm={searchTerm} />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  isFetching: store.peopleState.isFetching,
  currentUserProfile: store.userState.userProfile,
});

const mapDispatchToProps = dispatch => ({
  peopleActions: bindActionCreators(PeopleActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PeopleView);
