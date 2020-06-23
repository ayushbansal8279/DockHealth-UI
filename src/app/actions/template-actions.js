import {
  SHOW_TEMPLATE_HEADER,
  HIDE_TEMPLATE_HEADER,
} from 'actions/action-types';

export const hideHeader = () => ({
  type: HIDE_TEMPLATE_HEADER,
});

export const showHeader = () => ({
  type: SHOW_TEMPLATE_HEADER,
});
