import { createSelector } from 'reselect';

const sendbirdStateSelector = (state) => state.sendbird;

export const showChatPopoverSelector = createSelector(
  sendbirdStateSelector,
  ({ showPopover }) => showPopover,
);

export const selectedChatChannelSelector = createSelector(
  sendbirdStateSelector,
  ({ channel }) => channel,
);
