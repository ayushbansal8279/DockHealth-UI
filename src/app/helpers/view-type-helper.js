export const ViewType = {
  LIST_VIEW: 'LIST_VIEW',
  CALENDAR_VIEW: 'CALENDAR_VIEW',
};
export const VIEW_TYPE_OPTIONS = [
  {
    label: 'List View',
    value: ViewType.LIST_VIEW,
  },
  {
    label: 'Calendar View',
    value: ViewType.CALENDAR_VIEW,
  },
];

export function getViewTypeFromQueryString(queryString) {
  const viewType = new URLSearchParams(queryString)
    .get('viewType')
    ?.toUpperCase();

  if (VIEW_TYPE_OPTIONS.some(({ value }) => value === viewType)) {
    return viewType;
  }

  return ViewType.LIST_VIEW;
}
