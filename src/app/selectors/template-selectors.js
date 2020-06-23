import { createSelector } from 'reselect';

export const templateStateSelector = state => state.templateState;

export const isHeaderVisibleSelector = createSelector(
  templateStateSelector,
  ({ isHeaderVisible }) => isHeaderVisible,
);
