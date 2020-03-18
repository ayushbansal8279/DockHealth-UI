/**
 * @typedef {Object} TaskList
 * @property {Number} taskListIdentifier
 * @property {String} listName
 */
/**
 * @typedef {Object} Task
 * @property {TaskList} taskList
 */
import {
  concat,
  curry,
  defaultTo,
  groupBy,
  head,
  isNil,
  keys,
  map,
  path,
  pipe,
  prop,
  propOr,
  sortBy,
  toLower,
  uniq,
  values,
} from 'ramda';

const getTaskListFromTasks = pipe(head, propOr({}, 'taskList'));

const safeGroupBy = curry((getKey, list) =>
  isNil(list) ? [] : groupBy(getKey, list),
);

const sortByName = sortBy(pipe(prop('listName'), defaultTo(''), toLower));

/**
 * @type {function(Task[])}
 */
export const groupTasksByList = pipe(
  safeGroupBy(path(['taskList', 'taskListIdentifier'])),
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
  const group = pipe(map(shape), values, sortByName);

  return group(listNames);
};

export default groupTasksByList;
