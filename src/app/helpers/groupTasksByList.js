import {
  groupBy,
  map,
  path,
  pipe,
  values,
  keys,
  head,
  propOr,
  concat,
  uniq,
  isNil,
  curry,
  sortBy,
  prop,
  toLower,
} from 'ramda';

/**
 * @typedef {Object} TaskList
 * @property {Number} taskListId
 * @property {String} listName
 */

/**
 * @typedef {Object} Task
 * @property {TaskList} taskList
 */

const getTaskListFromTasks = pipe(
  head,
  propOr({}, 'taskList'),
);

const safeGroupBy = curry((getKey, list) =>
  isNil(list) ? [] : groupBy(getKey, list),
);

const sortByName = sortBy(
  pipe(
    prop('listName'),
    toLower,
  ),
);

/**
 * @type {function(Task[])}
 */
export const groupTasksByList = pipe(
  safeGroupBy(path(['taskList', 'taskListId'])),
  map(tasks => ({ ...getTaskListFromTasks(tasks), tasks })),
  values,
);

/**
 * @type {function(Task[], Task[])}
 */
export const groupTasksAndCompletedTasksByList = (tasks, completedTasks) => {
  const lists = safeGroupBy(path(['taskList', 'listName']), tasks);
  const completedLists = safeGroupBy(
    path(['taskList', 'listName']),
    completedTasks,
  );

  const listNames = uniq(concat(keys(lists), keys(completedLists)));

  const shape = listName => ({
    ...getTaskListFromTasks(propOr([], listName, lists)),
    ...getTaskListFromTasks(propOr([], listName, completedLists)),
    tasks: lists[listName],
    completedTasks: completedLists[listName],
  });
  const group = pipe(
    map(shape),
    values,
    sortByName,
  );

  return group(listNames);
};

export default groupTasksByList;
