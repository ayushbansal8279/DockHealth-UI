import { isEmpty } from 'ramda';

import CalendarDimIcon from 'img/calendar-dim';
import CalendarIcon from 'img/calendar-icon';
import CalendarOverDueIcon from 'img/calendar-overdue-icon';
import CalendarIconHover from 'img/calendar-icon-hover';
import ClipDimIcon from 'img/clip-dim';
import ClipIconHover from 'img/clip-hover';
import ClipIcon from 'img/clip-v2';
import ClipNewIcon from 'img/clip-new';
import LabelDimIcon from 'img/label-dim';
import LabelIcon from 'img/label';
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
    NEW: CalendarIcon,
    HOVER: CalendarIconHover,
  },
  LABELS: {
    LIGHT: LabelDimIcon,
    REGULAR: LabelIcon,
    NEW: LabelIcon,
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

export const getItemIcon = (type, value, isHovered, hasUpdate) =>
  ITEM_ICONS[type][getItemIconVersion(value, isHovered, hasUpdate)];

export const getCalendarIcon = (value, isHovered, isOverDue, hasUpdate) =>
  isOverDue
    ? CalendarOverDueIcon
    : ITEM_ICONS[DUE_DATE][getItemIconVersion(value, isHovered, hasUpdate)];
