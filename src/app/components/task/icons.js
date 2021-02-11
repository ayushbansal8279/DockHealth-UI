import moment from 'moment';
import { isEmpty } from 'ramda';

import CalendarDimIcon from 'img/calendar-dim';
import CalendarIcon from 'img/calendar-icon';
import CalendarIconHover from 'img/calendar-icon-hover';
import CalendarOverDueIcon from 'img/calendar-overdue';
import CalendarNewIcon from 'img/calendar-new';
import CalendarNewOverDueIcon from 'img/calendar-new-overdue';
import ClipDimIcon from 'img/clip-dim';
import ClipIconHover from 'img/clip-hover';
import ClipIcon from 'img/clip-v2';
import ClipNewIcon from 'img/clip-new';
import LabelDimIcon from 'img/label-dim';
import LabelIcon from 'img/label';
import LabelNewIcon from 'img/label-new';
import LabelIconHover from 'img/label-hover';
import MessageDimIcon from 'img/message-dim';
import MessageIcon from 'img/message';
import MessageIconHover from 'img/message-hover';
import MessageNewIcon from 'img/message-new';

export const COMMENTS = 'COMMENTS';
export const DUE_DATE = 'DUE_DATE';
export const LABELS = 'LABELS';
export const ATTACHMENTS = 'ATTACHMENTS';

export const LIGHT = 'LIGHT';
export const REGULAR = 'REGULAR';
export const HOVER = 'HOVER';
export const NEW = 'NEW';

export const ITEM_ICONS = {
  COMMENTS: {
    LIGHT: MessageDimIcon,
    REGULAR: MessageIcon,
    NEW: MessageNewIcon,
    HOVER: MessageIconHover,
  },
  DUE_DATE: {
    LIGHT: CalendarDimIcon,
    REGULAR: CalendarIcon,
    NEW: CalendarNewIcon,
    HOVER: CalendarIconHover,
  },
  LABELS: {
    LIGHT: LabelDimIcon,
    REGULAR: LabelIcon,
    NEW: LabelNewIcon,
    HOVER: LabelIconHover,
  },
  ATTACHMENTS: {
    LIGHT: ClipDimIcon,
    REGULAR: ClipIcon,
    NEW: ClipNewIcon,
    HOVER: ClipIconHover,
  },
};

export const getItemIconVersion = (value, isHovered, hasUpdate) => {
  if (!isEmpty(value) && value && hasUpdate) return NEW;

  if (!isEmpty(value) && value) return REGULAR;

  if (isHovered) return HOVER;

  return LIGHT;
};

export const getCalendarOverDueIcon = hasUpdate => {
  if (hasUpdate) return CalendarNewOverDueIcon;

  return CalendarOverDueIcon;
};

export const isDueDateOverdue = value =>
  moment(value).format('HH:mm') !== '00:00'
    ? moment(value).isBefore(moment())
    : value && moment(value).isBefore(moment().startOf('day'));

export const getItemIcon = (type, value, isHovered, hasUpdate) =>
  ITEM_ICONS[type][getItemIconVersion(value, isHovered, hasUpdate)];

export const getCalendarIcon = (value, isHovered, isCompleted, hasUpdate) => {
  const isOverdue =
    moment(value).format('HH:mm') !== '00:00'
      ? moment(value).isBefore(moment())
      : value && moment(value).isBefore(moment().startOf('day'));

  return isOverdue && !isCompleted
    ? getCalendarOverDueIcon(hasUpdate)
    : ITEM_ICONS[DUE_DATE][getItemIconVersion(value, isHovered, hasUpdate)];
};

export const getToolTipMultiLabelDetails = labels => {
  let toolTipMultiLabelDetails = '';
  if (labels.length === 1) {
    toolTipMultiLabelDetails = `${labels[0].labelName}`;
  } else if (labels.length === 2) {
    toolTipMultiLabelDetails = `${labels[0].labelName}, ${labels[1].labelName}`;
  } else if (labels.length > 2) {
    toolTipMultiLabelDetails = `${labels[0].labelName}, ${
      labels[1].labelName
    } + ${labels.length - 2}`;
  }
  return toolTipMultiLabelDetails;
};

export const getToolTipAttachmentsLabelDetails = attachments => {
  let attachmentLabelDetails = '';
  if (attachments.length === 1) {
    attachmentLabelDetails = `${attachments[0].fileName}`;
  } else if (attachments.length > 1) {
    attachmentLabelDetails = `${
      attachments[0].fileName
    } + ${attachments.length - 1}`;
  }
  return attachmentLabelDetails;
};
