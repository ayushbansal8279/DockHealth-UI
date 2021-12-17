import { createSelector } from 'reselect';

export const templateStateSelector = state => state.templateState;

export const isNavbarVisibleSelector = createSelector(
  templateStateSelector,
  ({ isNavbarVisible }) => isNavbarVisible,
);

export const subMenuKeySelector = createSelector(
  templateStateSelector,
  ({ subMenuKey }) => subMenuKey,
);
