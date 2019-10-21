import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as PeopleActions from '../../actions/people-actions';

class MemberInitials extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { member } = this.props;

    return !member || member.userId !== nextProps.member.userId;
  }

  componentWillUnmount() {
    const { member } = this.props;

    const element = member
      ? $(`#tooltip-member-${member.userId}`)
      : $('#tooltip-member-unassigned');

    if (element.data('yeti-box')) {
      const tooltipId = element.data('yeti-box');
      const tooltipElement = $(`#${tooltipId}`);
      if (tooltipElement) {
        tooltipElement.remove();
      }
    }
  }

  render() {
    const { extraClass, member } = this.props;

    return (
      <span>
        {member?.profileThumbnailPictureHash ? (
          <img
            id={`tooltip-member-${member?.userId}`}
            className={`medium member-photo circle ${extraClass ?? ''}`}
            data-tooltip
            title={member?.userName ?? 'unassigned'}
            src={
              member?.userId ??
              `${process.env.HEYDOC_SERVICES_BASE_URL}user/profilePicture/${
                member?.userId
              }/${member.profileThumbnailPictureHash}`
            }
            alt={`${member.firstName} ${member.lastName}`}
          />
        ) : (
          <span
            id={`tooltip-member-${member?.userId ?? 'unassigned'}`}
            className={`medium member-initials circle ${extraClass ?? ''}`}
            data-tooltip
            title={member?.userName ?? 'unassigned'}
          >
            {member?.initials ?? '?'}
          </span>
        )}
      </span>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    peopleActions: bindActionCreators(PeopleActions, dispatch),
  };
}

export default connect(
  undefined,
  mapDispatchToProps,
)(MemberInitials);
