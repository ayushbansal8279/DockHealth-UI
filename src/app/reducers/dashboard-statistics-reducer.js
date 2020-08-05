import * as types from 'actions/action-types';

const initialState = {
  statistics: [],
  isLoading: false,
  error: '',
};

const DashboardStatisticsReducer = (state = initialState, action) => {
  const { type, statistics, error } = action;
  switch (type) {
    case types.REQUEST_DASHBOARD_STATISTICS:
      return {
        ...state,
        isLoading: true,
      };

    case types.REQUEST_DASHBOARD_STATISTICS_SUCCESS:
      return {
        statistics,
        isLoading: false,
      };

    case types.REQUEST_DASHBOARD_STATISTICS_FAILURE:
      return {
        ...state,
        error,
        isLoading: false,
      };

    default:
      return state;
  }
};

export default DashboardStatisticsReducer;
