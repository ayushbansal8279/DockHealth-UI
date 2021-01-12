import { createSelector } from 'reselect';

export const templateStateSelector = state => state.templateState;

export const isHeaderVisibleSelector = createSelector(
  templateStateSelector,
  ({ isHeaderVisible }) => isHeaderVisible,
);

export const subMenuKeySelector = createSelector(
  templateStateSelector,
  ({ subMenuKey }) => subMenuKey,
);

// export const isNavbarInFullModeSelector = createSelector(
//   templateStateSelector,
//   ({ isNavbarInFullMode }) => isNavbarInFullMode,
// );

// export const areNavbarSettingsVisibleSelector = createSelector(
//   templateStateSelector,
//   ({ areNavbarSettingsVisible }) => areNavbarSettingsVisible,
// );
