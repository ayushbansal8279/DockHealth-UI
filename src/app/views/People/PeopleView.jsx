import { Grid } from '@material-ui/core';
import queryString from 'query-string';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { setHeader as setHeaderRaw } from 'actions/header-actions';
import * as PeopleActions from 'actions/people-actions';
import { mobileAnalyticsClient } from 'api/analytics-api';
import Loader from 'components/common/Loader/Loader';
import GenericHeader from 'components/common/GenericHeader';
import PageContentHeader from 'components/common/PageContentHeader';
import SafariFixGrid from 'components/common/SafariFixGrid';
import Spacing from 'components/common/Spacing';
import PeopleContainer from 'components/people/PeopleContainer';
import Search from 'components/taskView/Search/Search';
import InvitePeoplePopover from './PeopleView.InvitePeoplePopover';

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

class PeopleView extends PureComponent {
  state = {
    searchTerm: '',
    invitePopoverOpen: false,
  };

  invitePeopleButtonReference = React.createRef();

  async componentDidMount() {
    const { location, peopleActions } = this.props;

    peopleActions.loading();
    peopleActions.findAllUsersByOrganizationId().then(() => {
      this.resetHeader();
    });
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

    this.resetHeader();
  }

  toggleInvitePopover = ({ newInvitePopoverState } = {}) => {
    const { invitePopoverOpen } = this.state;
    this.setState({
      invitePopoverOpen: newInvitePopoverState || !invitePopoverOpen,
    });
  };

  resetHeader = () => {
    const { setHeader } = this.props;

    setHeader({
      layout: [
        {
          key: 'people-header',
          component: <GenericHeader>People</GenericHeader>,
        },
      ],
    });
  };

  handleSearch = event => {
    this.setState({ searchTerm: event.target.value });
  };

  render() {
    const { searchTerm, invitePopoverOpen } = this.state;
    const { isFetching, peopleList } = this.props;

    return (
      <Grid container justify="center">
        <PageContentHeader>
          <Grid container wrap="nowrap">
            <Search onChange={this.handleSearch} />
          </Grid>
        </PageContentHeader>
        <Spacing vertical={4} />
        <SafariFixGrid container xs={12} item justify="center">
          <Grid item xs={9}>
            {isFetching ? (
              <LoaderContainer>
                <Loader size={40} />
              </LoaderContainer>
            ) : (
              <PeopleContainer
                peopleList={peopleList}
                searchTerm={searchTerm}
              />
            )}
          </Grid>
        </SafariFixGrid>
        {this.invitePeopleButtonReference.current && (
          <InvitePeoplePopover
            anchor={this.invitePeopleButtonReference.current}
            open={invitePopoverOpen}
            toggleInvitePopover={this.toggleInvitePopover}
          />
        )}
      </Grid>
    );
  }
}

const mapStateToProps = store => ({
  isFetching: store.peopleState.isFetching,
  currentUserProfile: store.userState.userProfile,
  peopleList: store.peopleState.peoplelist,
});

const mapDispatchToProps = dispatch => ({
  peopleActions: bindActionCreators(PeopleActions, dispatch),
  setHeader: setHeaderRaw(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PeopleView);
