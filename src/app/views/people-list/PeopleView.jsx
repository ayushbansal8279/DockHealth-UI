import { Grid } from '@material-ui/core';
import queryString from 'query-string';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import * as TemplateActions from 'actions/template-actions';
import * as PeopleActions from 'actions/people-actions';
import { mobileAnalyticsClient } from 'api/analytics-api';
import ListSkeletonLoader from 'components/common/ListSkeletonLoader/ListSkeletonLoader';
import GenericHeader from 'components/template/GenericHeader/GenericHeader';
import PageContentHeader from 'components/common/PageContentHeader/PageContentHeader';
import Spacing from 'components/common/Spacing';
import PeopleContainer from 'components/people/PeopleContainer';
import Search from 'components/task-view/Search/Search';
import Button from 'components/common/Button/Button';
import LightbulbBig from 'img/lightbulb-big';
import InvitePeoplePopover from './PeopleView.InvitePeoplePopover';
import {
  ListLoaderContainer,
  ManageUsersContainer,
  HeaderMessage,
  HeaderMessageTitle,
  HeaderMessageDescription,
} from './styled';

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
    const { templateActions } = this.props;

    templateActions.setHeader({
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
    const { isFetching, peopleList, currentUserProfile } = this.props;

    const isOwnerOrAdmin =
      currentUserProfile.orgUserRole === 'OWNER' ||
      currentUserProfile.orgUserRole === 'ADMIN';

    return (
      <Grid container justify="center">
        <PageContentHeader>
          <Grid container wrap="nowrap">
            <Search onChange={this.handleSearch} />
          </Grid>
        </PageContentHeader>
        <Grid container xs={12} item justify="center">
          <Grid item xs={8}>
            <Spacing vertical={4} />
            {isOwnerOrAdmin && (
              <ManageUsersContainer>
                <img alt="lightbulb" src={LightbulbBig} />
                <HeaderMessage>
                  <HeaderMessageTitle>
                    Manage people in the Subscription and Users section.
                  </HeaderMessageTitle>
                  <HeaderMessageDescription>
                    Invite, remove, and change roles for people within your
                    organization.
                  </HeaderMessageDescription>
                </HeaderMessage>
                <Link to="/settings/subscriptions">
                  <Button>Manage Users</Button>
                </Link>
              </ManageUsersContainer>
            )}
            <Spacing vertical={4} />
            {isFetching ? (
              <ListLoaderContainer>
                <ListSkeletonLoader header />
              </ListLoaderContainer>
            ) : (
              <PeopleContainer
                peopleList={peopleList}
                searchTerm={searchTerm}
              />
            )}
          </Grid>
        </Grid>
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
  templateActions: bindActionCreators(TemplateActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PeopleView);
