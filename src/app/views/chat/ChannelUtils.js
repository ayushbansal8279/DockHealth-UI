import isToday from 'date-fns/isToday';
import format from 'date-fns/format';

import formatRelative from 'date-fns/formatRelative';
import isYesterday from 'date-fns/isYesterday';

// import { truncateString } from '../../utils';
const getStringSet = (lang = 'en') => {
  const stringSet = {
    en: {
      CONTEXT_MENU_DROPDOWN__RESEND: 'Resend',
      CONTEXT_MENU_DROPDOWN__DELETE: 'Delete',
    },
  };
  return stringSet[lang];
};

const LabelStringSet = getStringSet('en');

const truncateString = (fullString, stringLength_) => {
  let stringLength = stringLength_;
  if (!stringLength) stringLength = 40;
  if (fullString === null || fullString === undefined) return '';
  if (fullString.length <= stringLength) return fullString;
  const separator = '...';
  const separatorLength = separator.length;
  const charsToShow = stringLength - separatorLength;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return (
    fullString.slice(0, frontChars) +
    separator +
    fullString.slice(fullString.length - backChars)
  );
};

export const getChannelTitle = (
  channel = {},
  currentUserId,
  stringSet = LabelStringSet,
) => {
  if (!channel || (!channel.name && !channel.members)) {
    return stringSet.NO_TITLE;
  }
  if (channel.name && channel.name !== 'Group Channel') {
    return channel.name;
  }
  if (channel.members.length === 1) {
    return stringSet.NO_MEMBERS;
  }

  return channel.members
    .filter(({ userId }) => userId !== currentUserId)
    .map(({ nickname }) => nickname || stringSet.NO_NAME)
    .join(', ');
};

export const getLastMessageCreatedAt = (channel, locale) => {
  const createdAt = channel?.lastMessage?.createdAt;
  const optionalParameter = locale ? { locale } : null;
  if (!createdAt) {
    return '';
  }
  if (isToday(createdAt)) {
    return format(createdAt, 'p', optionalParameter);
  }
  if (isYesterday(createdAt)) {
    return formatRelative(createdAt, new Date(), optionalParameter);
  }
  return format(createdAt, 'MMM dd', optionalParameter);
};

export const getTotalMembers = channel =>
  channel && channel.memberCount ? channel.memberCount : 0;

const getPrettyLastMessage = (message = {}) => {
  const MAXLEN = 30;
  const { messageType, name } = message;
  if (messageType === 'file') {
    return truncateString(name, MAXLEN);
  }
  return message.message;
};

export const getLastMessage = channel =>
  channel && channel.lastMessage
    ? getPrettyLastMessage(channel.lastMessage)
    : '';

export const getChannelUnreadMessageCount = channel =>
  channel && channel.unreadMessageCount ? channel.unreadMessageCount : 0;
