import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as UserActions from '../../actions/people-actions';

class MemberProfilePic extends PureComponent {
  componentDidMount() {
    const { userActions, userId } = this.props;
    userActions.getUserById(userId);
  }

  render() {
    const { users } = this.props;
    return (
      <span>
        <h1>{users}</h1>
        <img
          className="member-photo circle"
          src="assets/img/user1.png"
          alt="name of user"
        />
      </span>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(UserActions, dispatch),
});

export default connect(
  undefined,
  mapDispatchToProps,
)(MemberProfilePic);
