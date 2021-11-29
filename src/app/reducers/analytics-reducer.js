import * as ActionTypes from 'actions/action-types';

const initialState = {
  filters: null,
  selectedFilters: null,
  isLoadingFilters: false,
};

const AnalyticsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.GET_ANALYTICS_FILTER_OPTIONS: {
      return {
        ...state,
        isLoadingFilters: true,
      };
    }

    case ActionTypes.GET_ANALYTICS_FILTER_OPTIONS_SUCCESS: {
      return {
        ...state,
        isLoadingFilters: false,
        filters: action.filters,
      };
    }

    case ActionTypes.GET_ANALYTICS_FILTER_OPTIONS_FAILURE: {
      return {
        ...state,
        isLoadingFilters: false,
      };
    }

    case ActionTypes.SELECT_ANALYTICS_FILTER: {
      const { optionCategoryIdentifier, optionIdentifier } = action;

      return {
        ...state,
        selectedFilters: {
          ...(state.selectedFilters || {}),
          [optionCategoryIdentifier]: [
            ...(state.selectedFilters?.[optionCategoryIdentifier] || []),
            optionIdentifier,
          ],
        },
      };
    }

    case ActionTypes.UNSELECT_ANALYTICS_FILTER: {
      const { optionCategoryIdentifier, optionIdentifier } = action;

      let selectedFilters = {
        ...(state.selectedFilters || {}),
        [optionCategoryIdentifier]:
          state.selectedFilters?.[optionCategoryIdentifier]?.filter(
            id => id !== optionIdentifier,
          ) || null,
      };

      selectedFilters = Object.entries(selectedFilters).reduce(
        (accumulator, [optionCategoryId, optionIds]) => {
          if (optionIds?.length > 0) {
            return {
              ...(accumulator || {}),
              [optionCategoryId]: optionIds,
            };
          }

          return accumulator;
        },
        null,
      );

      return {
        ...state,
        selectedFilters,
      };
    }

    case ActionTypes.CLEAR_ANALYTICS_FILTER:
      return {
        ...state,
        selectedFilters: null,
      };

    default:
      return state;
  }
};

export default AnalyticsReducer;
