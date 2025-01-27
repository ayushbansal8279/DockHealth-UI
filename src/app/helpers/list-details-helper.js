export function extractAllTasksFromGroupsDetail(data) {
  return data.flat().reduce((allTasks, group) => {
    return [...allTasks, ...group.tasks];
  }, []);
}

export function filterDataForCalender(filterData, startDate, endDate) {
  const cleanedFilters = {
    taskDueDateOptions: {
      dateEnd: endDate,
      dateStart: startDate,
    },
  };

  if (!filterData) {
    return cleanedFilters;
  }
  Object.entries(filterData).forEach(([key, value]) => {
    if (key === '' || key === 'taskDueDateOptions') {
      return;
    }
    cleanedFilters[key] = value;
  });

  return cleanedFilters;
}
