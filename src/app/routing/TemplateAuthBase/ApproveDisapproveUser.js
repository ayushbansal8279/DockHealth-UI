/* eslint-disable import/prefer-default-export */
import { approveOrDenyInvitation } from 'actions/user-actions';

export const onEnterApproveDisapproveUser = ({ dispatch, match }) => {
  const { params } = match;
  const { requestIdentifier, decisionType, userIdentifier } = params;

  approveOrDenyInvitation({
    requestIdentifier,
    decisionType,
    userIdentifier,
    dispatch,
  });
};
